"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
class DefaultReturn extends events_1.EventEmitter {
    constructor() {
        super(...arguments);
        this.build = (data, req) => {
            this.emit('beforeRender', data);
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
                }
            };
            return fullData;
        };
        this.error = (status, http, message) => {
            return {
                status: status,
                httpStatus: http,
                message: message
            };
        };
    }
}
exports.DefaultReturn = DefaultReturn;
