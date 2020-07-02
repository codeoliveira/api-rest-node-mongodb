import { Router } from '../common/router';
import * as restify from 'restify';
import { User } from './users.model';
import { NotFoundError } from 'restify-errors';
import { DefaultReturn } from '../common/defaultReturn';

class UsersRouter extends Router {
	constructor() {
		super();
		this.on('beforeRenderSingle', document => {
			document.password = undefined;
			return document;
		});

		this.on('beforeRenderList', data => {
			data.map(document => {
				document.password = undefined;
				return document;
			});

			return data;
		});
	}

	applyRoutes(app: restify.Server) {
		const DFReturn = new DefaultReturn();

		app.get('/users', (req, res, next) => {
			User.find().then(this.renderList(req, res, next)).catch(next);
		});

		app.get('/users/:id', (req, res, next) => {
			User.findById(req.params.id)
				.then(this.render(req, res, next))
				// .catch(err => {
				// 	this.error(res, next, false, 404, 'User not found');
				// });
				.catch(next);
		});

		app.post('/users', (req, res, next) => {
			const user: User = new User(req.body);
			user
				.save()
				.then(this.render(req, res, next))
				// .catch(err => {
				// 	this.error(res, next, false, 404, 'User not created');
				// });
				.catch(next);
		});

		app.put('/users/:id', (req, res, next) => {
			// const user: User = new User(req.body);
			const options = { overwrite: true };
			User.update({ _id: req.params.id }, req.body, options)
				.exec()
				.then((result): any => {
					if (result.n) {
						return User.findById(req.params.id);
					} else {
						throw new NotFoundError('Documento não encontrado');
					}
				})
				.then(this.render(req, res, next))
				// .catch(err => {
				// 	this.error(res, next, false, 404, 'User not updated');
				// });
				.catch(next);
		});

		app.patch('/user/:id', (req, res, next) => {
			const options = { new: true };

			User.findByIdAndUpdate(req.params.id, req.body, options).then(user => {
				if (user) {
					const dfR = DFReturn.build([user], req);
					res.json(dfR);
					// return next();
				} else {
					throw new NotFoundError('Documento não encontrado');
				}
				return next();
			});
		});

		app.del('/users/:id', (req, res, next) => {
			User.findByIdAndRemove({ _id: req.params.id })
				.then(user => {
					if (user) {
						const dfR = DFReturn.build([user], req);
						res.json(dfR);
						return next();
					} else {
						throw new NotFoundError('Documento não encontrado');
					}
				})
				.catch(next);
		});
	}
}

export const usersRouter = new UsersRouter();
