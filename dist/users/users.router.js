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
var router_1 = require("../common/router");
var users_model_1 = require("./users.model");
var restify_errors_1 = require("restify-errors");
var defaultReturn_1 = require("../common/defaultReturn");
var UsersRouter = /** @class */ (function (_super) {
    __extends(UsersRouter, _super);
    function UsersRouter() {
        var _this = _super.call(this) || this;
        _this.on('beforeRenderSingle', function (document) {
            document.password = undefined;
            return document;
        });
        _this.on('beforeRenderList', function (data) {
            data.map(function (document) {
                document.password = undefined;
                return document;
            });
            return data;
        });
        return _this;
    }
    UsersRouter.prototype.applyRoutes = function (app) {
        var _this = this;
        var DFReturn = new defaultReturn_1.DefaultReturn();
        app.get('/users', function (req, res, next) {
            users_model_1.User.find().then(_this.renderList(req, res, next)).catch(next);
        });
        app.get('/users/:id', function (req, res, next) {
            users_model_1.User.findById(req.params.id)
                .then(_this.render(req, res, next))
                .catch(next);
        });
        app.post('/users', function (req, res, next) {
            var user = new users_model_1.User(req.body);
            user
                .save()
                .then(_this.render(req, res, next))
                .catch(next);
        });
        app.put('/users/:id', function (req, res, next) {
            // const user: User = new User(req.body);
            var options = { overwrite: true };
            users_model_1.User.update({ _id: req.params.id }, req.body, options)
                .exec()
                .then(function (result) {
                if (result.n) {
                    return users_model_1.User.findById(req.params.id);
                }
                else {
                    throw new restify_errors_1.NotFoundError('Documento não encontrado');
                }
            })
                .then(_this.render(req, res, next))
                .catch(next);
        });
        app.patch('/user/:id', function (req, res, next) {
            var options = { new: true };
            users_model_1.User.findByIdAndUpdate(req.params.id, req.body, options).then(function (user) {
                if (user) {
                    var dfR = DFReturn.build([user], req);
                    res.json(dfR);
                    // return next();
                }
                else {
                    throw new restify_errors_1.NotFoundError('Documento não encontrado');
                }
                return next();
            });
        });
        app.del('/users/:id', function (req, res, next) {
            users_model_1.User.findByIdAndRemove({ _id: req.params.id })
                .then(function (user) {
                if (user) {
                    var dfR = DFReturn.build([user], req);
                    res.json(dfR);
                    return next();
                }
                else {
                    throw new restify_errors_1.NotFoundError('Documento não encontrado');
                }
            })
                .catch(next);
        });
    };
    return UsersRouter;
}(router_1.Router));
exports.usersRouter = new UsersRouter();
