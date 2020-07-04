"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const model_router_1 = require("../common/model-router");
const reviews_model_1 = require("./reviews.model");
const environment_1 = require("./../common/environment");
const authz_handler_1 = require("../security/authz.handler");
class ReviewsRouter extends model_router_1.ModelRouter {
    constructor() {
        super(reviews_model_1.Review);
        this.findById = (req, res, next) => {
            this.model
                .findById(req.params.id)
                .populate('user', 'name')
                .populate('restaurant', 'name')
                .then(this.render(req, res, next))
                .catch(next);
        };
    }
    envelope(document) {
        let resource = super.envelope(document);
        const restId = document.restaurant._id
            ? document.restaurant._id
            : document.restaurant;
        const userId = document.user._id ? document.user._id : document.user;
        resource._links.restaurant = `${environment_1.environment.server.PROTOCOL}://${environment_1.environment.server.HOST}:${environment_1.environment.server.PORT}/restaurants/${restId}`;
        resource._links.user = `${environment_1.environment.server.PROTOCOL}://${environment_1.environment.server.HOST}:${environment_1.environment.server.PORT}/users/${userId}`;
        return resource;
    }
    applyRoutes(app) {
        app.get(`${this.basePath}`, this.findAll);
        app.get(`${this.basePath}/:id`, [this.validateId, this.findById]);
        app.post(`${this.basePath}`, [authz_handler_1.authorize('user'), this.save]);
        // app.put('/reviews/:id', [this.validateId, this.replace]);
        // app.patch('/reviews/:id', [this.validateId, this.update]);
        // app.del('/reviews/:id', [this.validateId, this.delete]);
    }
}
exports.reviewsRouter = new ReviewsRouter();
