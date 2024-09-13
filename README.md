# Square-Off-JS

## Description

## Run the project

```bash
npm install

node server.js
```

Available at http://127.0.0.1:3000/

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

### Links
- Live multiplayer web browser games https://dev.to/ably/building-a-realtime-multiplayer-browser-game-in-less-than-a-day-part-1-4-14pm

- Phaser 3 Tile Map example https://phaser.io/examples/v3/view/tilemap/tile-properties#

## TODO

- Why does online play not work when running locally?
- Answer: live-server launches the app on 127.0.0.1:8080, but the server is running on 127.0.0.1:3000. The server needs to be running on the same port as the app.
- How to fix: Run node server.js and open 127.0.0.1:3000 in the browser.

- DONE: Remove libraries/ from root directory and move all libraries to public/libraries/

- get env variables from .env file to public/host.js and public/index.js... somehow

- Figure out which script imports are really needed in host.html and public/index.html, and remove the rest.

- DONE: restructure the project to have a public/ directory with all the client-side code and a src/ directory with all the server-side code.

- DONE: remove duplicative modules (only board.js needs to have a separate online and local version)

- DONE: rename online index.html to guest.html, this will affect online-setup.html

- DONE: split up server.js into multiple files, per gpts recommendation

- DONE: Fix local play after refactor: error in square-off.js tile.sprite.color is undefined... why? maybe because the tile is not being created properly in the localBoard.js file. Maybe because since in static public directory, the tile.sprite.color is not being defined

- DONE: Fix the join room button in online-setup.html, make it much simpler, split on ?= and then direct to guest.html with the room code as a query parameter

- Move online modules to src/ directory and separate into server and client side. This will require any UI updates to be done in the client side, and any game logic to be done in the server side. so the board class cannot interact with the html elements directly, it must send messages to the server, which will then send messages to the client, which will then update the UI.