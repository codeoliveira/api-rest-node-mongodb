"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const model_router_1 = require("../common/model-router");
const users_model_1 = require("./users.model");
const auth_handler_1 = require("../security/auth.handler");
const authz_handler_1 = require("../security/authz.handler");
class UsersRouter extends model_router_1.ModelRouter {
    constructor() {
        super(users_model_1.User);
        this.findByEmail = (req, res, next) => {
            if (req.query.email) {
                users_model_1.User.findByEmail(req.query.email)
                    .then(user => {
                    const nuser = user ? [user] : [];
                    return nuser;
                })
                    .then(this.renderList(req, res, next))
                    .catch(next);
            }
            else {
                next();
            }
        };
        this.applyRoutes = (app) => {
            app.get({ path: `${this.basePath}`, version: '2.0.0' }, [
                authz_handler_1.authorize('admin'),
                this.findByEmail,
                this.findAll
            ]);
            app.get({ path: `${this.basePath}`, version: '1.0.0' }, [
                authz_handler_1.authorize('admin'),
                this.findAll
            ]);
            app.get(`${this.basePath}/:id`, [
                authz_handler_1.authorize('admin'),
                this.validateId,
                this.findById
            ]);
            app.post(`${this.basePath}`, [authz_handler_1.authorize('admin'), this.save]);
            app.put(`${this.basePath}/:id`, [
                authz_handler_1.authorize('admin', 'user'),
                this.validateId,
                this.replace
            ]);
            app.patch(`${this.basePath}/:id`, [
                authz_handler_1.authorize('admin', 'user'),
                this.validateId,
                this.update
            ]);
            app.del(`${this.basePath}/:id`, [
                authz_handler_1.authorize('admin'),
                this.validateId,
                this.delete
            ]);
            app.post(`${this.basePath}/authenticate`, auth_handler_1.authenticate);
        };
        this.on('beforeRenderSingle', document => {
            document.password = undefined;
            return document;
        });
        // this.on('beforeRenderList', data => {
        // 	data.map((document: any) => {
        // 		document.password = undefined;
        // 		return document;
        // 	});
        // 	return data;
        // });
    }
}
exports.usersRouter = new UsersRouter();
