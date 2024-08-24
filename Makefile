run:
	node src/server.js

install:
	npm install

docker-build:
	docker build -t square-off-js-app .

docker-run:
	docker run -p 8080:3000 square-off-js-app

docker:
	docker-compose up --build