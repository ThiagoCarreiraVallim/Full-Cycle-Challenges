package entity

import (
	"errors"
	"time"

	"github.com/google/uuid"
)

type Client struct {
	ID string
	Name string
	Email string
	Accounts []*Account
	CreatedAt time.Time
	UpdatedAt time.Time
}

func NewClient(name string, email string) (*Client, error) {
	client := &Client{
		ID: uuid.New().String(),
		Name: name,
		Email: email,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	err := client.Validate()
	if err != nil {
		return nil, err
	}

	return client, nil
}

func (c *Client) Validate() error {
	if c.Name == "" {
		return errors.New("invalid name")
	}

	if (c.Email == "") {
		return errors.New("invalid email")
	}

	return nil
}

func (c *Client) Update(name string, email string) error {
	oldName := c.Name
	oldEmail := c.Email
	oldUpdatedAt := c.UpdatedAt

	c.Name = name
	c.Email = email
	c.UpdatedAt = time.Now()

	err := c.Validate()

	if err != nil {
		c.Name = oldName
		c.Email = oldEmail
		c.UpdatedAt = oldUpdatedAt
		return err
	}

	return nil
}

func (c *Client) AddAccount(account *Account) error {
	if account == nil {
		return errors.New("invalid account")
	}
	
	if account.Client.ID != c.ID {
		return errors.New("account belongs to another client")
	}
	c.Accounts = append(c.Accounts, account)
	return nil
}