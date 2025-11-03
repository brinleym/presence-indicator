# Presence Indicator Prototype

Simple prototype of presence indicator application, experimenting with different connection methods including regular HTTP, websockets, Server-Sent Events (SSE), short polling and long polling.

## Setup

1. Download [Docker Desktop](https://www.docker.com/products/docker-desktop/)
2. Run Redis container: 
    ```bash
    docker run -d --name redis \
    -p 6379:6379 \
    redis:7
    ```
3. Clone this repo and install Node dependencies: `cd presence-indicator && npm i`
4. Run the web server: `npm run start`
5. Connect to `localhost:3000` and enjoy!