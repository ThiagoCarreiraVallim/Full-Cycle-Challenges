package create_transaction

import (
	"testing"

	"github.com.br/ThiagoCarreiraVallim/fc-ms-wallet/internal/entity"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

type TransactionGatewayMock struct {
	mock.Mock
}

func (m *TransactionGatewayMock) Create(transaction *entity.Transaction) error {
	args := m.Called(transaction)
	return args.Error(0)
}

type AccountGatewayMock struct {
	mock.Mock
}

func (m *AccountGatewayMock) Save(account *entity.Account) error {
	args := m.Called(account)
	return args.Error(0)
}

func (m *AccountGatewayMock) FindByID(id string) (*entity.Account, error) {
	args := m.Called(id)
	return args.Get(0).(*entity.Account), args.Error(1)
}

func (m *AccountGatewayMock) UpdateBalance(account *entity.Account) error {
	args := m.Called(account)
	return args.Error(0)
}

func TestCreateTransactionUseCase_Execute(t *testing.T) {
	client1, _ := entity.NewClient("client1", "j@j.com")
	account1 := entity.NewAccount(client1)
	account1.Credit(1000)

	client2, _ := entity.NewClient("client2", "j@j2.com")
	account2 := entity.NewAccount(client2)
	account2.Credit(1000)

	inputDto := CreateTransactionInputDTO{
		AccountIDFrom: account1.ID,
		AccountIDTo:   account2.ID,
		Amount:        100,
	}

	accountMock := &AccountGatewayMock{}
	accountMock.On("FindByID", account1.ID).Return(account1, nil)
	accountMock.On("FindByID", account2.ID).Return(account2, nil)

	transactionMock := &TransactionGatewayMock{}
	transactionMock.On("Create", mock.Anything).Return(nil)

	uc := NewCreateTransactionUseCase(transactionMock, accountMock)
	output, err := uc.Execute(inputDto)
	assert.Nil(t, err)
	assert.NotNil(t, output.ID)

	accountMock.AssertExpectations(t)
	transactionMock.AssertExpectations(t)

	accountMock.AssertNumberOfCalls(t, "FindByID", 2)
	transactionMock.AssertNumberOfCalls(t, "Create", 1)
}