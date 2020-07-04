"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const restify = require("restify");
const environment_1 = require("./../common/environment");
const mongoose = require("mongoose");
const merge_patch_parser_1 = require("./merge-patch.parser");
const error_handler_1 = require("./../server/error.handler");
const token_parser_1 = require("../security/token.parser");
const logger_1 = require("./../common/logger");
class Server {
    constructor() {
        this.getConfig = () => {
            return environment_1.environment.server;
        };
        this.initDB = () => {
            const { PROTOCOL, HOST, PORT, DB, USER, PASSWORD } = environment_1.environment.db;
            mongoose.Promise = global.Promise;
            const connection = mongoose.connect(`${PROTOCOL}${USER}:${PASSWORD}@${HOST}:${PORT}/${DB}
			?authSource=admin`, {
                useMongoClient: true
            });
            return connection;
            // mongoose.connect(`mongodb://${HOST}:${PORT}/${DATABASE}`, {
            // 	useNewUrlParser: true,
            // 	useUnifiedTopology: true,
            // 	authSource: "admin",
            // 	auth: {
            // 		user: USER,
            // 		password: PASSWD,
            // 	},
            // });
        };
    }
    initRoutes(routers) {
        const { HOST, PORT } = this.getConfig();
        return new Promise((resolve, reject) => {
            try {
                const options = {
                    name: 'rest-mongodb-api',
                    version: '1.0.0',
                    log: logger_1.logger
                };
                if (environment_1.environment.security.enableHTTPS) {
                    options.certificate = fs.readFileSync(environment_1.environment.security.certificate);
                    options.key = fs.readFileSync(environment_1.environment.security.key);
                }
                this.application = restify.createServer(options);
                this.application.pre(restify.plugins.requestLogger({
                    log: logger_1.logger
                }));
                this.application.use(restify.plugins.queryParser());
                this.application.use(restify.plugins.bodyParser());
                this.application.use(merge_patch_parser_1.mergePatchBodyParser);
                this.application.use(token_parser_1.tokenParser);
                this.application.use(function crossOrigin(req, res, next) {
                    res.header('Access-Control-Allow-Origin', '*');
                    res.header('Access-Control-Allow-Headers', 'X-Requested-With');
                    return next();
                });
                // this.application.use(restify.plugins.fullResponse());
                // routes
                for (const route of routers) {
                    route.applyRoutes(this.application);
                }
                this.application.listen(PORT, HOST, () => {
                    resolve(this.application);
                    // console.log(
                    // 	`\x1b[33m[api]`,
                    // 	`\x1b[0m>\x1b[36m`,
                    // 	`Server is running on ${HOST}:${PORT}`,
                    // 	`\x1b[0m`
                    // );
                });
                this.application.on('restifyError', error_handler_1.handleError);
            }
            catch (error) {
                console.log(`\x1b[33m[api]\x1b[31m[ERROR]`, `\x1b[0m>\x1b[36m`, `${error}`, `\x1b[0m`);
                process.exit(1);
            }
        });
    }
    bootstrap(routers = []) {
        return this.initDB().then(() => {
            return this.initRoutes(routers).then(() => this);
        });
    }
    shutdown() {
        mongoose.disconnect().then(() => this.application.close());
    }
}
exports.Server = Server;
// Reset = "\x1b[0m"
// Bright = "\x1b[1m"
// Dim = "\x1b[2m"
// Underscore = "\x1b[4m"
// Blink = "\x1b[5m"
// Reverse = "\x1b[7m"
// Hidden = "\x1b[8m"
// FgBlack = "\x1b[30m"
// FgRed = "\x1b[31m"
// FgGreen = "\x1b[32m"
// FgYellow = "\x1b[33m"
// FgBlue = "\x1b[34m"
// FgMagenta = "\x1b[35m"
// FgCyan = "\x1b[36m"
// FgWhite = "\x1b[37m"
// BgBlack = "\x1b[40m"
// BgRed = "\x1b[41m"
// BgGreen = "\x1b[42m"
// BgYellow = "\x1b[43m"
// BgBlue = "\x1b[44m"
// BgMagenta = "\x1b[45m"
// BgCyan = "\x1b[46m"
// BgWhite = "\x1b[47m"
