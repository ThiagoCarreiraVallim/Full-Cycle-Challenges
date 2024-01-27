package entity

import (
	"testing"

	"github.com/stretchr/testify/assert"
)


func TestCreateTransaction(t *testing.T) {
	client1, _ := NewClient("John Doe", "j@j")
	accountFrom := NewAccount(client1)

	client2, _ := NewClient("Jane Doe", "j@j")
	accountTo := NewAccount(client2)

	accountFrom.Credit(100)

	transaction, err := NewTransaction(accountFrom, accountTo, 100)
	assert.Nil(t, err)
	assert.NotNil(t, transaction)
	assert.NotEmpty(t, transaction.ID)
	assert.Equal(t, float64(100), accountTo.Balance)
	assert.Equal(t, float64(0), accountFrom.Balance)
}

func TestCreateTransactionErrorInsufficientFounds(t *testing.T) {
	client1, _ := NewClient("John Doe", "j@j")
	accountFrom := NewAccount(client1)

	client2, _ := NewClient("Jane Doe", "j@j")
	accountTo := NewAccount(client2)

	accountFrom.Credit(50)
	accountTo.Credit(50)

	transaction, err := NewTransaction(accountFrom, accountTo, 100)
	assert.NotNil(t, err)
	assert.Nil(t, transaction)
	assert.Equal(t, "insufficient funds", err.Error())
	assert.Equal(t, float64(50), accountTo.Balance)
	assert.Equal(t, float64(50), accountFrom.Balance)
}