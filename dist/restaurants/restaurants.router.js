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
var model_router_1 = require("../common/model-router");
var restaurants_model_1 = require("./restaurants.model");
var restify_errors_1 = require("restify-errors");
var RestaurantsRouter = /** @class */ (function (_super) {
    __extends(RestaurantsRouter, _super);
    function RestaurantsRouter() {
        var _this = _super.call(this, restaurants_model_1.Restaurant) || this;
        _this.findMenu = function (req, res, next) {
            restaurants_model_1.Restaurant.findById(req.params.id, '+menu')
                .then(function (rest) {
                if (!rest) {
                    throw new restify_errors_1.NotFoundError('Restaurant not found');
                }
                else {
                    res.json(rest.menu);
                    return next();
                }
            })
                .catch(next);
        };
        _this.replaceMenu = function (req, res, next) {
            restaurants_model_1.Restaurant.findById(req.params.id)
                .then(function (rest) {
                if (!rest) {
                    throw new restify_errors_1.NotFoundError('Restaurant not found');
                }
                else {
                    rest.menu = req.body; // Array de MenuItem
                    return rest.save();
                }
            })
                .then(function (rest) {
                res.json(rest.menu);
                return next();
            })
                .catch(next);
        };
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
    RestaurantsRouter.prototype.applyRoutes = function (app) {
        app.get('/restaurants', this.findAll);
        app.get('/restaurants/:id', [this.validateId, this.findById]);
        app.post('/restaurants', this.save);
        app.put('/restaurants/:id', [this.validateId, this.replace]);
        app.patch('/restaurants/:id', [this.validateId, this.update]);
        app.del('/restaurants/:id', [this.validateId, this.delete]);
        app.get('/restaurants/:id/menu', [this.validateId, this.findMenu]);
        app.put('/restaurants/:id/menu', [this.validateId, this.replaceMenu]);
    };
    return RestaurantsRouter;
}(model_router_1.ModelRouter));
exports.restaurantsRouter = new RestaurantsRouter();
