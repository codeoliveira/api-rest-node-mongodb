"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var server_1 = require("./server/server");
var users_router_1 = require("./users/users.router");
var restaurants_router_1 = require("./restaurants/restaurants.router");
var reviews_router_1 = require("./reviews/reviews.router");
var server = new server_1.Server();
server
    .bootstrap([users_router_1.usersRouter, restaurants_router_1.restaurantsRouter, reviews_router_1.reviewsRouter])
    .then(function (server) {
    var _a = server.getConfig(), HOST = _a.HOST, PORT = _a.PORT;
    console.log("------------------------------------------------------------");
    console.log("\u001B[33m[api]\u001B[32m[START]", "\u001B[0m>\u001B[36m", "Server is running on " + HOST + ":" + PORT, 
    // server.application.address(),
    "\u001B[0m");
    console.log("------------------------------------------------------------");
})
    .catch(function (error) {
    console.log("\u001B[33m[api]\u001B[31m[ERROR]", "\u001B[0m>\u001B[36m", "" + error, "\u001B[0m");
    process.exit(1);
});
