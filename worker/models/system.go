package models

type SystemResources struct {
	CPU     float64 `json:"cpu"`
	RAM     float64 `json:"ram"`
	Storage float64 `json:"storage"`
}
