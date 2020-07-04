"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const model_router_1 = require("../common/model-router");
const restaurants_model_1 = require("./restaurants.model");
const restify_errors_1 = require("restify-errors");
const environment_1 = require("./../common/environment");
const authz_handler_1 = require("../security/authz.handler");
class RestaurantsRouter extends model_router_1.ModelRouter {
    constructor() {
        super(restaurants_model_1.Restaurant);
        this.findMenu = (req, res, next) => {
            restaurants_model_1.Restaurant.findById(req.params.id, '+menu')
                .then(rest => {
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
        this.replaceMenu = (req, res, next) => {
            restaurants_model_1.Restaurant.findById(req.params.id)
                .then(rest => {
                if (!rest) {
                    throw new restify_errors_1.NotFoundError('Restaurant not found');
                }
                else {
                    rest.menu = req.body; // Array de MenuItem
                    return rest.save();
                }
            })
                .then(rest => {
                res.json(rest.menu);
                return next();
            })
                .catch(next);
        };
        // this.on('beforeRenderSingle', document => {
        // 	document.password = undefined;
        // 	return document;
        // });
        // this.on('beforeRenderList', data => {
        // 	data.map((document: any) => {
        // 		document.password = undefined;
        // 		return document;
        // 	});
        // 	return data;
        // });
    }
    envelope(document) {
        let resource = super.envelope(document);
        resource._links.menu = `${environment_1.environment.server.PROTOCOL}://${environment_1.environment.server.HOST}:${environment_1.environment.server.PORT}${this.basePath}/${resource._id}/menu`;
        return resource;
    }
    applyRoutes(app) {
        app.get(`${this.basePath}`, this.findAll);
        app.get(`${this.basePath}/:id`, [this.validateId, this.findById]);
        app.post(`${this.basePath}`, [authz_handler_1.authorize('admin'), this.save]);
        app.put(`${this.basePath}/:id`, [
            authz_handler_1.authorize('admin'),
            this.validateId,
            this.replace
        ]);
        app.patch(`${this.basePath}/:id`, [
            authz_handler_1.authorize('admin'),
            this.validateId,
            this.update
        ]);
        app.del(`${this.basePath}/:id`, [
            authz_handler_1.authorize('admin'),
            this.validateId,
            this.delete
        ]);
        app.get(`${this.basePath}/:id/menu`, [this.validateId, this.findMenu]);
        app.put(`${this.basePath}/:id/menu`, [
            authz_handler_1.authorize('admin'),
            this.validateId,
            this.replaceMenu
        ]);
    }
}
exports.restaurantsRouter = new RestaurantsRouter();
