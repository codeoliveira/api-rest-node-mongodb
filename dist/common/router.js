"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var events_1 = require("events");
var restify_errors_1 = require("restify-errors");
var Router = /** @class */ (function (_super) {
    __extends(Router, _super);
    function Router() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.render = function (req, res, next) {
            return function (data) {
                if (data) {
                    _this.emit('beforeRenderSingle', data);
                    var fullData = {
                        data: {
                            item: data
                        },
                        return: true,
                        status: 200,
                        message: 'Process done'
                    };
                    res.json(fullData);
                }
                else {
                    throw new restify_errors_1.NotFoundError('Documento não encontrado');
                }
                return next();
            };
        };
        _this.renderList = function (req, res, next) {
            return function (data) {
                if (data.length > 0) {
                    _this.emit('beforeRenderList', data);
                    var fullData = {
                        data: {
                            items: data,
                            total: data.length,
                            filtered: data.length
                        },
                        search: {
                            key: '',
                            value: ''
                        },
                        pagination: {
                            start: 0,
                            limit: 100
                        },
                        return: true,
                        status: 200,
                        message: 'Process done'
                    };
                    res.json(fullData);
                }
                else {
                    var fullData = {
                        data: {
                            items: data,
                            total: data.length,
                            filtered: data.length
                        },
                        search: {
                            key: '',
                            value: ''
                        },
                        pagination: {
                            start: 0,
                            limit: 100
                        },
                        return: true,
                        status: 200,
                        message: 'Process done'
                    };
                    res.json(fullData);
                    // res.send(404);
                }
                return next();
            };
        };
        _this.error = function (res, next, statusProcess, http, message) {
            res.json({
                return: statusProcess,
                status: http,
                message: message
            });
            return next();
        };
        return _this;
    }
    return Router;
}(events_1.EventEmitter));
exports.Router = Router;
