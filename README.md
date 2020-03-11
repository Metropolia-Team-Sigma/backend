# backend

The Sigma backend server, used to propel the chat application.

## Installation

Prerequisites:
- Git
- Docker
- Node.js and NPM

```bash
git clone https://github.com/Metropolia-Team-Sigma/backend.git
docker-compose up -d
# Configure environment variables from .env.example
npm i
npm run db-init
npm start
```

**Note:** Per default, the ArangoDB Docker image sets a random root password. To obtain the password, check the output of `docker logs backend_arango_1`.

## Structure

### Networking

The backend server utilises a combination of a RESTful HTTP server and a WebSocket server to operate. The HTTP server is implemented in [server/http](src/server/http), and the WebSocket server is implemented in [server/ws](src/server/ws).

The HTTP server is used for chat room creation and for authentication and initiation of the chat room join flow. The WebSocket server is used to exchange messages between clients.

### Data storage

Chat rooms are stored using ArangoDB with the rocksdb storage engine. The database functions are implemented in [db](src/db).

### Encryption

Messages are encrypted and decrypted client-side using AES-256-CBC. The cryptography implementations can be found in the [client](https://github.com/Metropolia-Team-Sigma/client) repository.
