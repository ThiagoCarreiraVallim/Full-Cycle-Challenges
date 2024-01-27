package entity

import (
	"errors"
	"time"

	"github.com/google/uuid"
)

type Transaction struct {
	ID string
	AccountFrom *Account
	AccountTo *Account
	Amount float64
	CreatedAt time.Time
	UpdatedAt time.Time
}

func NewTransaction(accountFrom *Account, accountTo *Account, amount float64) (*Transaction, error) {
	transaction := &Transaction{
		ID: uuid.New().String(),
		AccountFrom: accountFrom,
		AccountTo: accountTo,
		Amount: amount,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	err := transaction.Validate()

	if err != nil {
		return nil, err
	}

	transaction.Commit()

	return transaction, nil
}

func (t *Transaction) Commit() {
	t.AccountFrom.Debit(t.Amount)
	t.AccountTo.Credit(t.Amount)
}

func (t *Transaction) Validate() error {
	if t.AccountFrom == nil {
		return errors.New("invalid account from")
	}

	if t.AccountTo == nil {
		return errors.New("invalid account to")
	}

	if t.Amount <= 0 {
		return errors.New("invalid amount")
	}

	if t.AccountFrom.Balance < t.Amount {
		return errors.New("insufficient funds")
	}

	return nil
}