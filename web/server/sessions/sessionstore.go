package sessions

import (
	"bytes"
	"encoding/base32"
	"encoding/gob"
	"net/http"
	"strings"

	"github.com/fanky5g/xxxinafrica/web/server/config"
	"github.com/fanky5g/xxxinafrica/web/server/database"
	"github.com/gorilla/securecookie"
	"github.com/gorilla/sessions"
)

// SessionStore represents a dynamodb session storage object
type SessionStore struct {
	Table   string
	Codecs  []securecookie.Codec
	Options *sessions.Options // default configuration
}

// DynamoData holds session store data
type DynamoData struct {
	ID   string `json:"id" key="true"`
	Data []byte `json:"data"`
}

// NewSessionStore creates a new store
func NewSessionStore(tableName string, keyPairs ...[]byte) (*SessionStore, error) {
	err := database.CreateTableFromModel(DynamoData{}, "Sessions", "id")
	if err != nil && err.Error() != "table already exists" {
		return nil, err
	}

	dynStore := &SessionStore{
		Table:  tableName,
		Codecs: securecookie.CodecsFromPairs(keyPairs...),
	}

	return dynStore, nil
}

// Get returns a session for the given name after adding it to the registry.
//
// See gorilla/sessions FilesystemStore.Get().
// or  boj/redistore
func (s *SessionStore) Get(r *http.Request, name string) (*sessions.Session, error) {
	return sessions.GetRegistry(r).Get(s, name)
}

// New creates a new sessions object
func (s *SessionStore) New(r *http.Request, name string) (*sessions.Session, error) {
	var err error
	session := sessions.NewSession(s, name)

	// make a copy
	options := sessions.Options{
		HttpOnly: true,
		Path:     "/",
	}
	session.Options = &options
	session.IsNew = true
	if c, errCookie := r.Cookie(name); errCookie == nil {
		err = securecookie.DecodeMulti(name, c.Value, &session.ID, s.Codecs...)
		if err == nil {
			err := s.load(session)
			if err == nil {
				session.IsNew = false
			} else {
				session.IsNew = true
			}
		}
	}

	return session, err
}

// Save adds a single session to the response.
func (s *SessionStore) Save(r *http.Request, w http.ResponseWriter, session *sessions.Session) error {
	// Marked for deletion.
	if session.Options.MaxAge < 0 {
		if err := s.delete(session); err != nil {
			return err
		}
		http.SetCookie(w, sessions.NewCookie(session.Name(), "", session.Options))
	} else {
		// Build an alphanumeric key for the redis store.
		if session.ID == "" {
			session.ID = strings.TrimRight(base32.StdEncoding.EncodeToString(securecookie.GenerateRandomKey(32)), "=")
		}
		if err := s.save(session); err != nil {
			return err
		}
		encoded, err := securecookie.EncodeMulti(session.Name(), session.ID, s.Codecs...)
		if err != nil {
			return err
		}
		http.SetCookie(w, sessions.NewCookie(session.Name(), encoded, session.Options))
	}
	return nil
}

// save stores the session in dynamodb
func (s *SessionStore) save(session *sessions.Session) error {
	// TODO expiration date to be added
	// TODO max length to be added
	buf := new(bytes.Buffer)
	enc := gob.NewEncoder(buf)
	err := enc.Encode(session.Values)
	if err != nil {
		return err
	}
	b := buf.Bytes()

	data := &DynamoData{ID: session.ID, Data: b}
	err = database.InsertItem(s.Table, "id", data)
	if err != nil {
		return err
	}

	return nil
}

// load reads the session from dynamodb.
// returns error if session data does not exist in dynamodb
func (s *SessionStore) load(session *sessions.Session) error {
	var sessionData DynamoData
	out, err := database.GetItemByKey(s.Table, "id", session.ID, "", DynamoData{})
	if err != nil {
		return err
	}

	sessionData = *(out.(*DynamoData))

	dec := gob.NewDecoder(bytes.NewBuffer(sessionData.Data))
	return dec.Decode(&session.Values)
}

// delete removes keys from dynamodb if MaxAge<0
func (s *SessionStore) delete(session *sessions.Session) error {
	err := database.DeleteItem(s.Table, "id", session.ID)
	if err != nil {
		return err
	}
	return nil
}

// GetSessionStore returns a dynamodb session store connection object
func GetSessionStore() (*SessionStore, error) {
	cfg, _ := config.GetConfig()

	store, err := NewSessionStore("Sessions", []byte(cfg.Secret))
	if err != nil {
		return nil, err
	}

	return store, nil
}
