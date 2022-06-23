package models

type HttpError struct {
	Code  int    `json:"code"`
	Error string `json:"error"`
	Event string `json:"event"`
}
