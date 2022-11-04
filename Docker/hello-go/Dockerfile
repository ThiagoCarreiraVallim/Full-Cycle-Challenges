FROM golang:1.18.8-alpine3.16 AS builder
WORKDIR /builder
COPY hello.go .
RUN go mod init example/hello
RUN go build .

FROM scratch
WORKDIR /app
COPY --from=builder /builder/hello . 
ENTRYPOINT [ "./hello" ]