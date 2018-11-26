package types

// MessagePayload are websocket messages we forward to users in json encoded string
type MessagePayload struct {
	Event   string      `json:"event"`
	Message string      `json:"message"`
	Payload interface{} `json:"payload"`
}
