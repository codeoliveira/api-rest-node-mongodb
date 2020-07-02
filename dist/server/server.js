"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var restify = require("restify");
var environment_1 = require("./../common/environment");
var mongoose = require("mongoose");
var merge_patch_parser_1 = require("./merge-patch.parser");
var error_handler_1 = require("./../server/error.handler");
var Server = /** @class */ (function () {
    function Server() {
        this.getConfig = function () {
            return environment_1.environment.server;
        };
        this.initDB = function () {
            var _a = environment_1.environment.db, PROTOCOL = _a.PROTOCOL, HOST = _a.HOST, PORT = _a.PORT, DB = _a.DB, USER = _a.USER, PASSWORD = _a.PASSWORD;
            mongoose.Promise = global.Promise;
            var connection = mongoose.connect("" + PROTOCOL + USER + ":" + PASSWORD + "@" + HOST + ":" + PORT + "/" + DB + "\n\t\t\t?authSource=admin", {
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
    Server.prototype.initRoutes = function (routers) {
        var _this = this;
        var _a = this.getConfig(), HOST = _a.HOST, PORT = _a.PORT;
        return new Promise(function (resolve, reject) {
            try {
                _this.application = restify.createServer({
                    name: 'rest-mongodb-api',
                    version: '1.0.0'
                });
                _this.application.use(restify.plugins.queryParser());
                _this.application.use(restify.plugins.bodyParser());
                _this.application.use(merge_patch_parser_1.mergePatchBodyParser);
                _this.application.use(function crossOrigin(req, res, next) {
                    res.header('Access-Control-Allow-Origin', '*');
                    res.header('Access-Control-Allow-Headers', 'X-Requested-With');
                    return next();
                });
                // this.application.use(restify.plugins.fullResponse());
                // routes
                for (var _i = 0, routers_1 = routers; _i < routers_1.length; _i++) {
                    var route = routers_1[_i];
                    route.applyRoutes(_this.application);
                }
                _this.application.listen(PORT, HOST, function () {
                    resolve(_this.application);
                    // console.log(
                    // 	`\x1b[33m[api]`,
                    // 	`\x1b[0m>\x1b[36m`,
                    // 	`Server is running on ${HOST}:${PORT}`,
                    // 	`\x1b[0m`
                    // );
                });
                _this.application.on('restifyError', error_handler_1.handleError);
            }
            catch (error) {
                console.log("\u001B[33m[api]\u001B[31m[ERROR]", "\u001B[0m>\u001B[36m", "" + error, "\u001B[0m");
                process.exit(1);
            }
        });
    };
    Server.prototype.bootstrap = function (routers) {
        var _this = this;
        if (routers === void 0) { routers = []; }
        return this.initDB().then(function () {
            return _this.initRoutes(routers).then(function () { return _this; });
        });
    };
    return Server;
}());
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
