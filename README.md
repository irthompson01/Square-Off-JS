# Square-Off-JS

## TODO

- Why does online play not work when running locally?
- Answer: live-server launches the app on 127.0.0.1:8080, but the server is running on 127.0.0.1:3000. The server needs to be running on the same port as the app.
- How to fix: Run node server.js and open 127.0.0.1:3000 in the browser.

- Figure out which script imports are really needed in host.html and public/index.html, and remove the rest.

## Description

## Run the project

```bash
npm install

node server.js
```

## Run the Docker container

```bash
docker build -t square-off-js-app .

docker run -p 8080:3000 square-off-js-app
```
OR

```bash
docker-compose up --build
```

If you don't need to rebuild the image, you can just run:

```bash
docker-compose up
```

### CDN Links

- [Socket.io 4.5.4](https://cdn.socket.io/4.5.4/socket.io.min.js)
- [P5.min.js](https://cdn.jsdelivr.net/npm/p5@1/lib/p5.min.js)
- [p5.sound.min.js](https://cdn.jsdelivr.net/npm/p5@1/lib/addons/p5.sound.min.js)
- [planck.min.js](https://cdn.jsdelivr.net/npm/planck@latest/dist/planck.min.js)
- [p5play.js](https://p5play.org/v3/p5play.js)