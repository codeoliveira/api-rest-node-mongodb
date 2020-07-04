"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const restify_errors_1 = require("restify-errors");
class Router extends events_1.EventEmitter {
    constructor() {
        super(...arguments);
        this.render = (req, res, next) => {
            return (data) => {
                if (data) {
                    this.emit('beforeRenderSingle', data);
                    const fullData = {
                        data: {
                            item: this.envelope(data)
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
                return next(false);
            };
        };
        this.renderList = (req, res, next) => {
            return (data) => {
                if (data.length > 0) {
                    data.forEach((document, index, array) => {
                        this.emit('beforeRenderSingle', document);
                        array[index] = this.envelope(document);
                    });
                    // this.emit('beforeRenderList', data);
                    const fullData = {
                        data: {
                            items: data,
                            total: data.length,
                            filtered: data.length
                        },
                        search: {
                            key: req.query.search.key,
                            value: req.query.search.value
                        },
                        pagination: {
                            start: req.query.pagination.start,
                            limit: req.query.pagination.limit
                        },
                        return: true,
                        status: 200,
                        message: 'Process done'
                    };
                    res.json(fullData);
                }
                else {
                    const fullData = {
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
                return next(false);
            };
        };
        this.error = (res, next, statusProcess, http, message) => {
            res.json({
                return: statusProcess,
                status: http,
                message: message
            });
            return next();
        };
    }
    envelope(document) {
        return document;
    }
}
exports.Router = Router;
