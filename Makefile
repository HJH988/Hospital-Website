.PHONY: all dev clean

all: build

dev:
	docker-compose up --build

build:
	cd server && go test ./... && go build -o ../bin/hospital-server .
	cd client && npm install && npm run build

clean:
	docker-compose down --volumes --remove-orphans
	rm -rf client/node_modules client/dist server/hospital-server bin
