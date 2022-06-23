package models

import "time"

type GithubReleases []struct {
	ID     int `json:"id"`
	Author struct {
		Login     string `json:"login"`
		ID        int    `json:"id"`
		AvatarURL string `json:"avatar_url"`
	} `json:"author"`
	TagName     string    `json:"tag_name"`
	Name        string    `json:"name"`
	CreatedAt   time.Time `json:"created_at"`
	PublishedAt time.Time `json:"published_at"`
	Body        string    `json:"body"`
}
