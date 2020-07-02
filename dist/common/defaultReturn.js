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
var DefaultReturn = /** @class */ (function (_super) {
    __extends(DefaultReturn, _super);
    function DefaultReturn() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.build = function (data, req) {
            _this.emit('beforeRender', data);
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
                }
            };
            return fullData;
        };
        _this.error = function (status, http, message) {
            return {
                status: status,
                httpStatus: http,
                message: message
            };
        };
        return _this;
    }
    return DefaultReturn;
}(events_1.EventEmitter));
exports.DefaultReturn = DefaultReturn;
