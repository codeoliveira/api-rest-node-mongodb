import { ModelRouter } from '../common/model-router';
import * as restify from 'restify';
import { User } from './users.model';
import { authenticate } from '../security/auth.handler';
import { authorize } from '../security/authz.handler';

class UsersRouter extends ModelRouter<User> {
	constructor() {
		super(User);
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

	findByEmail = (
		req: restify.Request,
		res: restify.Response,
		next: restify.Next
	) => {
		if (req.query.email) {
			User.findByEmail(req.query.email)
				.then(user => {
					const nuser = user ? [user] : [];
					return nuser;
				})
				.then(this.renderList(req, res, next))
				.catch(next);
		} else {
			next();
		}
	};

	applyRoutes = (app: restify.Server) => {
		app.get({ path: `${this.basePath}`, version: '2.0.0' }, [
			authorize('admin'),
			this.findByEmail,
			this.findAll
		]);
		app.get({ path: `${this.basePath}`, version: '1.0.0' }, [
			authorize('admin'),
			this.findAll
		]);
		app.get(`${this.basePath}/:id`, [
			authorize('admin'),
			this.validateId,
			this.findById
		]);
		app.post(`${this.basePath}`, [authorize('admin'), this.save]);
		app.put(`${this.basePath}/:id`, [
			authorize('admin', 'user'),
			this.validateId,
			this.replace
		]);
		app.patch(`${this.basePath}/:id`, [
			authorize('admin', 'user'),
			this.validateId,
			this.update
		]);
		app.del(`${this.basePath}/:id`, [
			authorize('admin'),
			this.validateId,
			this.delete
		]);

		app.post(`${this.basePath}/authenticate`, authenticate);
	};
}

export const usersRouter = new UsersRouter();
