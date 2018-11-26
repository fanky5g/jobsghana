package sockets

import (
	"bytes"
	"encoding/json"
	"log"

	"github.com/fanky5g/xxxinafrica/web/server/log2"
	"github.com/fanky5g/xxxinafrica/web/server/types"
)

var logger = log2.Log

type message struct {
	target string
	data   []byte
}

// Incoming message
type Incoming struct {
	Rooms      []string    `json:"room,omitempty"`
	TargetUser string      `json:"email,omitempty"`
	Payload    interface{} `json:"body"`
}

type subscription struct {
	conn *connection
	room string
	user types.User
}

type hub struct {
	rooms         map[string]map[*connection]types.User
	broadcast     chan message
	targetmessage chan message
	register      chan subscription
	unregister    chan subscription
}

// SocketHub is the main pool on which socket connections are run
var SocketHub = hub{
	broadcast:     make(chan message),
	targetmessage: make(chan message),
	register:      make(chan subscription),
	unregister:    make(chan subscription),
	rooms:         make(map[string]map[*connection]types.User),
}

func (h *hub) Run() {
	go func() {
		for {
			select {
			case s := <-h.register:
				connections := h.rooms[s.room]
				if connections == nil {
					connections = make(map[*connection]types.User)
					h.rooms[s.room] = connections
				}
				h.rooms[s.room][s.conn] = s.user
				// send online users to new user
			case s := <-h.unregister:
				connections := h.rooms[s.room]
				if connections != nil {
					if _, ok := connections[s.conn]; ok {
						delete(connections, s.conn)
						close(s.conn.send)
						if len(connections) == 0 {
							delete(h.rooms, s.room)
						}
					}
				}
				// update online users with new user list
			case m := <-h.broadcast:
				connections := h.rooms[m.target]
				for c := range connections {
					select {
					case c.send <- m.data:
					default:
						close(c.send)
						delete(connections, c)
						if len(connections) == 0 {
							delete(h.rooms, m.target)
						}
					}
				}
			case m := <-h.targetmessage:
				for _, room := range h.rooms {
					var done bool
					for conn, user := range room {
						if user.Email == m.target {
							conn.send <- m.data
							done = true
							break
						}
					}
					if done {
						break
					}
				}
			}
		}
	}()
}

// SendBroadcast sends a broadcast message
func SendBroadcast(payload Incoming) error {
	w := &bytes.Buffer{}
	err := json.NewEncoder(w).Encode(payload.Payload)
	if err != nil {
		log.Printf("error: %v", err)
		return err
	}

	for _, room := range payload.Rooms {
		m := message{room, w.Bytes()}
		SocketHub.broadcast <- m
	}

	return nil
}

// SendTargetedMessage sends a direct message to user
func SendTargetedMessage(payload Incoming) error {
	w := &bytes.Buffer{}
	err := json.NewEncoder(w).Encode(payload.Payload)
	if err != nil {
		log.Printf("error: %v", err)
		return err
	}

	m := message{payload.TargetUser, w.Bytes()}
	SocketHub.targetmessage <- m

	return nil
}
