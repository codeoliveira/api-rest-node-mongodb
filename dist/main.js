"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./server/server");
const users_router_1 = require("./users/users.router");
const restaurants_router_1 = require("./restaurants/restaurants.router");
const reviews_router_1 = require("./reviews/reviews.router");
const server = new server_1.Server();
server
    .bootstrap([users_router_1.usersRouter, restaurants_router_1.restaurantsRouter, reviews_router_1.reviewsRouter])
    .then(server => {
    const { HOST, PORT } = server.getConfig();
    console.log(`------------------------------------------------------------`);
    console.log(`\x1b[33m[api]\x1b[32m[START]`, `\x1b[0m>\x1b[36m`, `Server is running on ${HOST}:${PORT}`, 
    // server.application.address(),
    `\x1b[0m`);
    console.log(`------------------------------------------------------------`);
})
    .catch(error => {
    console.log(`\x1b[33m[api]\x1b[31m[ERROR]`, `\x1b[0m>\x1b[36m`, `${error}`, `\x1b[0m`);
    process.exit(1);
});
