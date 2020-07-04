"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = require("./router");
const mongoose = require("mongoose");
const restify_errors_1 = require("restify-errors");
const environment_1 = require("./../common/environment");
class ModelRouter extends router_1.Router {
    constructor(model) {
        super();
        this.model = model;
        this.validateId = (req, res, next) => {
            if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
                next(new restify_errors_1.NotFoundError('Document not found'));
            }
            else {
                next();
            }
        };
        this.findAll = (req, res, next) => {
            // PAGINATION
            req.query.pagination = req.query.pagination ? req.query.pagination : {};
            const pag = req.query.pagination;
            pag.start = pag.start ? parseInt(pag.start) : this.pagination.start;
            pag.limit = pag.limit ? parseInt(pag.limit) : this.pagination.limit;
            req.query.pagination = pag;
            // SEARCH
            req.query.search = req.query.search ? req.query.search : {};
            const search = req.query.search;
            search.key = search.start ? search.start : this.search.key;
            search.value = search.limit ? search.limit : this.search.value;
            req.query.search = search;
            this.model
                .find()
                .skip(req.query.pagination.start * req.query.pagination.limit)
                .limit(req.query.pagination.limit)
                .then(this.renderList(req, res, next))
                .catch(next);
        };
        this.findById = (req, res, next) => {
            this.model
                .findById(req.params.id)
                .then(this.render(req, res, next))
                .catch(next);
        };
        this.save = (req, res, next) => {
            const document = new this.model(req.body);
            document.save().then(this.render(req, res, next)).catch(next);
        };
        this.replace = (req, res, next) => {
            const options = {
                runValidators: true,
                overwrite: true
            };
            this.model
                .update({ _id: req.params.id }, req.body, options)
                .exec()
                .then((result) => {
                if (result.n) {
                    return this.model.findById(req.params.id);
                }
                else {
                    throw new restify_errors_1.NotFoundError('Documento não encontrado');
                }
            })
                .then(this.render(req, res, next))
                .catch(next);
        };
        this.update = (req, res, next) => {
            const options = {
                runValidators: true,
                new: true
            };
            this.model
                .findByIdAndUpdate(req.params.id, req.body, options)
                .then(this.render(req, res, next))
                .catch(next);
        };
        this.delete = (req, res, next) => {
            this.model
                .findByIdAndRemove({ _id: req.params.id })
                .then(this.render(req, res, next))
                .catch(next);
        };
        this.basePath = `/${model.collection.name}`;
        this.pagination = environment_1.environment.pagination;
        this.search = environment_1.environment.search;
    }
    envelope(document) {
        let resource = Object.assign({ _links: {} }, document.toJSON());
        resource._links.self = `${environment_1.environment.server.PROTOCOL}://${environment_1.environment.server.HOST}:${environment_1.environment.server.PORT}${this.basePath}/${resource._id}`;
        return resource;
    }
}
exports.ModelRouter = ModelRouter;
