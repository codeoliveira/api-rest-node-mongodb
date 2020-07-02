import { ModelRouter } from '../common/model-router';
import * as restify from 'restify';
import { User } from './users.model';
import { DefaultReturn } from '../common/defaultReturn';

class UsersRouter extends ModelRouter<User> {
	constructor() {
		super(User);
		this.on('beforeRenderSingle', document => {
			document.password = undefined;
			return document;
		});

		this.on('beforeRenderList', data => {
			data.map((document: any) => {
				document.password = undefined;
				return document;
			});

			return data;
		});
	}

	applyRoutes(app: restify.Server) {
		const DFReturn = new DefaultReturn();

		app.get('/users', this.findAll);

		app.get('/users/:id', [this.validateId, this.findById]);

		app.post('/users', this.save);

		app.put('/users/:id', [this.validateId, this.replace]);

		app.patch('/user/:id', [this.validateId, this.update]);

		app.del('/users/:id', [this.validateId, this.delete]);
	}
}

export const usersRouter = new UsersRouter();
