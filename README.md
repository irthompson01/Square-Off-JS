# Square-Off-JS

## Description

## Run the project

### Install Node.js (I'm using Chocolatey and Windows)

https://nodejs.org/en/download/package-manager
```bash
# NOTE:
# Chocolatey is not a Node.js package manager.
# Please ensure it is already installed on your system.
# Follow official instructions at https://chocolatey.org/
# Chocolatey is not officially maintained by the Node.js project and might not support the v22.9.0 version of Node.js

# download and install Node.js
choco install nodejs --version="22.9.0"

# verifies the right Node.js version is in the environment
node -v # should print `22`

# verifies the right npm version is in the environment
npm -v # should print `10.8.3`
```

### Install dependencies

```bash
npm install
```

### Run the server

```bash
node server.js
```

### If you have Make installed

```bash
make run
```

Available at http://127.0.0.1:3000/

## Build and run the Docker container

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

- DONE: get env variables from .env file to public/host.js and public/index.js... somehow

- DONE:Figure out which script imports are really needed in host.html and public/index.html, and remove the rest.

- DONE: restructure the project to have a public/ directory with all the client-side code and a src/ directory with all the server-side code.

- DONE: remove duplicative modules (only board.js needs to have a separate online and local version)

- DONE: rename online index.html to guest.html, this will affect online-setup.html

- DONE: split up server.js into multiple files, per gpts recommendation

- DONE: Fix local play after refactor: error in square-off.js tile.sprite.color is undefined... why? maybe because the tile is not being created properly in the localBoard.js file. Maybe because since in static public directory, the tile.sprite.color is not being defined

- DONE: Fix the join room button in online-setup.html, make it much simpler, split on ?= and then direct to guest.html with the room code as a query parameter

- DONE: Merge the online and local versions of the board and score class. Score class is done, board class is in progress.

- DONE: Setup config.js to fetch the config from the server. Enabling local and online to coexist without pushing changes to main. Deployment can be configured by changing the .env file.

- IN PROGRESS: Move online modules to src/ directory and separate into server and client side. This will require any UI updates to be done in the client side, and any game logic to be done in the server side. so the board class cannot interact with the html elements directly, it must send messages to the server, which will then send messages to the client, which will then update the UI.

- Move game modules from public/ to src/ directory. UI updates are separated from game on client side.

- DONE:When a player leaves, they should be removed from the player list and the game board. removePlayer() is not working.

- DONE:Add a javascript linter to the project (https://eslint.org/docs/latest/use/getting-started)

- DONE: Fix all eslint errors and warnings in the project

- DONE: Add a javascript formatter to the project (https://prettier.io/docs/en/install)