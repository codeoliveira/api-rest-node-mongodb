"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.environment = {
    server: {
        PORT: process.env.SERVER_PORT || 3000,
        HOST: process.env.SERVER_HOST || `localhost`,
        PROTOCOL: process.env.SERVER_PROTOCOL || `http`
    },
    db: {
        PROTOCOL: process.env.DB_PROTOCOL || `mongodb://`,
        HOST: process.env.DB_HOST || `192.168.0.160`,
        PORT: process.env.DB_PORT || `27017`,
        DB: process.env.DB_DB || `api-rest-mongodb`,
        USER: process.env.DB_USER || `admin`,
        PASSWORD: process.env.DB_PASSWORD || `dev102030`
    },
    security: {
        saltRounds: process.env.saltRounds || 10,
        apiSecret: process.env.API_SECRET || 'yhgu*&ituytr%3564#%265yrfcv',
        apiTestToken: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbkBlbWFpbC5jb20iLCJpYXQiOjE1MTYyMzkwMjJ9.Aq1avJ6DeQloKcPLughXhJ03UaP0baQ_wUhRjcASRo8',
        enableHTTPS: process.env.ENABLE_HTTPS || false,
        certificate: process.env.CERTI_FILE || './security/keys/cert.pem',
        key: process.env.CERTI_KEY || './security/keys/key.pem'
    },
    log: {
        name: 'api-rest',
        level: process.env.LOG_LEVEL || 'debug'
    },
    pagination: {
        start: 0,
        limit: 10
    },
    search: {
        key: '',
        value: ''
    }
};
