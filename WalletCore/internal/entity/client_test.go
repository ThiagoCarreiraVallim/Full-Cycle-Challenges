package entity

import (
	"testing"
	"github.com/stretchr/testify/assert"
)

func TesteCreateNewClient(t *testing.T) {
	client, err := NewClient("John Doe", "email@email.com")
	assert.Nil(t, err)
	assert.NotEmpty(t, client.ID)
	assert.Equal(t, "John Doe", client.Name)
	assert.Equal(t, "email@email.com", client.Email)
	assert.NotEmpty(t, client.CreatedAt)
	assert.NotEmpty(t, client.UpdatedAt)
}

func TestCreateNewClientError(t *testing.T) {
	client, err := NewClient("", "")
	assert.NotNil(t, err)
	assert.Nil(t, client)
}

func TestUpdateClient(t *testing.T) {
	client, _ := NewClient("John Doe", "email@email.com")
	err := client.Update("John Doe Updated", "email@updated.com")
	assert.Nil(t, err)
	assert.Equal(t, "John Doe Updated", client.Name)
	assert.Equal(t, "email@updated.com", client.Email)
}

func TestUpdateClientError(t *testing.T) {
	client, _ := NewClient("John Doe", "email@email.com")
	err := client.Update("", "")
	assert.NotNil(t, err)
	assert.Error(t, err, "invalid name")
	assert.Equal(t, "John Doe", client.Name)
	assert.Equal(t, "email@email.com", client.Email)
}

func TestAddAccount(t *testing.T) {
	client, _ := NewClient("John Doe", "j@j")
	account := NewAccount(client)
	err := client.AddAccount(account)
	assert.Nil(t, err)
	assert.Equal(t, 1, len(client.Accounts))
	assert.Equal(t, account, client.Accounts[0])
}

func TestAddAccountError(t *testing.T) {
	client, _ := NewClient("John Doe", "j@j")
	err := client.AddAccount(nil)
	assert.NotNil(t, err)
}
