"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jestCli = require("jest-cli");
require("jest");
const server_1 = require("./server/server");
const environment_1 = require("./common/environment");
const users_router_1 = require("./users/users.router");
const users_model_1 = require("./users/users.model");
const reviews_router_1 = require("./reviews/reviews.router");
const reviews_model_1 = require("./reviews/reviews.model");
/*
PROTOCOL: process.env.DB_PROTOCOL || `mongodb://`,
HOST: process.env.DB_HOST || `192.168.0.160`,
PORT: process.env.DB_PORT || `27017`,
DB: process.env.DB_DB || `api-rest-mongodb`,
USER: process.env.DB_USER || `admin`,
PASSWORD: process.env.DB_PASSWORD || `dev102030`
*/
let server;
const beforeAllTests = () => {
    environment_1.environment.db.DB = process.env.DB_DB || `api-rest-mongodb-TEST`;
    // environment.server.PORT = process.env.SERVER_PORT || 3001;
    environment_1.environment.server.PORT = 3001;
    if (environment_1.environment.security.enableHTTPS) {
        environment_1.environment.server.PROTOCOL = `https`;
    }
    server = new server_1.Server();
    return server
        .bootstrap([users_router_1.usersRouter, reviews_router_1.reviewsRouter])
        .then(() => users_model_1.User.remove({}).exec())
        .then(() => {
        let admin = new users_model_1.User();
        admin.name = 'admin';
        admin.email = 'admin@email.com';
        admin.password = '1234567890';
        admin.cpf = '538.156.488-07';
        admin.profiles = ['admin', 'user'];
        return admin.save();
    })
        .then(() => reviews_model_1.Review.remove({}).exec());
};
const afterAllTests = () => {
    return server.shutdown();
};
beforeAllTests()
    .then(() => jestCli.run())
    .then(() => afterAllTests())
    .catch(console.error);
