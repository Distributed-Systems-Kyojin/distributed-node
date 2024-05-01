# node-backend-framework

## Instructions

1. Add the ".env" file with the neccessary connection strings and secret keys to the project directory

2. Run below command from the project directory to update the server dependencies to their latest versions

### `npm run update_dep`

3. Run below commands one by one from the project directory to install the packages

### `npm install`

### `npm run install-client`

## Server deployment options (all commands should run from the project directory)

### 1. To run the "front-end" alone

### `npm run client`

### 2. To run a server instance with default configuration

### `npm run server`

### 3. To run a server instance with a specific node ID and a port

### `set NODE_ID=<An integet> && set PORT=<Port Number (defauld 5000)> && npm run server`

This will launch a server instance with the specified port and an sqlite database instance will be created based on the given NODE_ID (if not existing).
