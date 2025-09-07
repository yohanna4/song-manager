# Song Manager
Test Project for managing songs with CRUD operations and statistics.

## Project Structure

```

song-manager/
│
├── client/      # React frontend
└── server/      # Express/Node backend

````

## Prerequisites

- Node.js (v20+ recommended)
- npm or yarn

## Setup

### 1. Server

```bash
cd server
npm install
npm run dev   # Starts the backend server (e.g., on http://localhost:5000)
````

* The server provides APIs for fetching, creating, updating, and deleting songs.

### 2. Client

```bash
cd client
npm install
npm run dev     # Starts the React app (e.g., on http://localhost:5173)
```

* The client connects to the backend to display songs and statistics.
* Supports creating, editing, and deleting songs via modals.

## Features

* View a list of songs
* Add new songs
* Edit existing songs
* Delete songs with confirmation
* View statistics by artist, album, and genre

## Notes

* Ensure the server is running before using the client.
* You can change the API base URL in the client if the server runs on a different port.

## License

MIT