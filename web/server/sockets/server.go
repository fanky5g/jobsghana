package sockets

import (
	// "fmt"
	"log"
	"net/http"
	"sync"
	"sync/atomic"
	"time"

	"bytes"
	"encoding/json"

	"github.com/fanky5g/xxxinafrica/web/server/auth"
	"github.com/fanky5g/xxxinafrica/web/server/types"
	"github.com/fanky5g/xxxinafrica/web/server/util"
	"github.com/gorilla/websocket"
	"github.com/labstack/echo"
)

const (
	maxMessageSize = 512
	pongWait       = 60 * time.Second
	pingPeriod     = (pongWait * 9) / 10
	writeWait      = 10 * time.Second
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

var (
	subscriptions      = map[string][]chan []byte{}
	subscriptionsMutex sync.Mutex
)

var (
	connected int64
	failed    int64
)

type connection struct {
	ws   *websocket.Conn
	send chan []byte
}

func (c *connection) write(mt int, payload []byte) error {
	c.ws.SetWriteDeadline(time.Now().Add(writeWait))
	return c.ws.WriteMessage(mt, payload)
}

func (s subscription) readPump() {
	c := s.conn
	defer func() {
		SocketHub.unregister <- s
		c.ws.Close()
	}()

	c.ws.SetReadLimit(maxMessageSize)
	c.ws.SetReadDeadline(time.Now().Add(pongWait))
	c.ws.SetPongHandler(func(string) error { c.ws.SetReadDeadline(time.Now().Add(pongWait)); return nil })

	for {
		// messages will be json formatted
		var newMessage Incoming
		err := c.ws.ReadJSON(&newMessage)

		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway) {
				log.Printf("error: %v", err)
			}
			break
		}

		// encode message payload
		w := &bytes.Buffer{}
		err = json.NewEncoder(w).Encode(newMessage.Payload)
		if err != nil {
			log.Printf("error: %v", err)
			continue
			// don't send on error..send message to client later
		}

		if len(newMessage.Rooms) > 0 {
			for _, room := range newMessage.Rooms {
				m := message{room, w.Bytes()}
				SocketHub.broadcast <- m
			}
			continue
		}

		if newMessage.TargetUser != "" {
			m := message{newMessage.TargetUser, w.Bytes()}
			SocketHub.targetmessage <- m
		}
	}
}

func (s *subscription) writePump() {
	c := s.conn
	ticker := time.NewTicker(pingPeriod)
	defer func() {
		ticker.Stop()
		c.ws.Close()
	}()
	for {
		select {
		case message, ok := <-c.send:
			if !ok {
				c.write(websocket.CloseMessage, []byte{})
				return
			}
			if err := c.write(websocket.TextMessage, message); err != nil {
				return
			}
		case <-ticker.C:
			if err := c.write(websocket.PingMessage, []byte{}); err != nil {
				return
			}
		}
	}
}

// SocketHandler handles websocket connection and spawns background goroutine to keep connection between client and server active
func SocketHandler(c echo.Context) error {
	ws, err := upgrader.Upgrade(c.Response(), c.Request(), nil)
	if err != nil {
		return err
	}

	// get user from request context
	user, err := auth.GetAuthenticatedUser(c)
	if err != nil {
		returnMsg := struct {
			Message string `json:"message"`
		}{err.Error()}
		return c.JSON(http.StatusUnauthorized, returnMsg)
	}

	// get active user role
	s := []byte(user.Role.Role)
	key := []byte(user.Role.Key)

	decrypted, _ := util.DecryptString(key, s)
	role := string(decrypted)

	// channel := c.Request().URL.Path[1:]

	// launch a new goroutine so that this function can return and the http server can free up
	// buffers associated with this connection
	go handleConnection(ws, role, *user)

	return nil
}

func handleConnection(ws *websocket.Conn, channel string, user types.User) {
	atomic.AddInt64(&connected, 1)

	c := &connection{send: make(chan []byte, 256), ws: ws}
	s := subscription{c, channel, user}
	SocketHub.register <- s
	go s.writePump()
	s.readPump()

	atomic.AddInt64(&connected, -1)
	atomic.AddInt64(&failed, 1)
}
