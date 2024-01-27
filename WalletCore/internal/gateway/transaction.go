package gateway

import "github.com.br/ThiagoCarreiraVallim/fc-ms-wallet/internal/entity"

type TransactionGateway interface {
	Create(transaction *entity.Transaction) error
}