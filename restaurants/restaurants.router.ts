import { ModelRouter } from '../common/model-router';
import * as restify from 'restify';
import { Restaurant } from './restaurants.model';
import { NotFoundError } from 'restify-errors';
import { environment } from './../common/environment';
import { authorize } from '../security/authz.handler';

class RestaurantsRouter extends ModelRouter<Restaurant> {
	constructor() {
		super(Restaurant);
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

	envelope(document: Restaurant) {
		let resource = super.envelope(document);
		resource._links.menu = `${environment.server.PROTOCOL}://${environment.server.HOST}:${environment.server.PORT}${this.basePath}/${resource._id}/menu`;
		return resource;
	}

	findMenu = (
		req: restify.Request,
		res: restify.Response,
		next: restify.Next
	) => {
		Restaurant.findById(req.params.id, '+menu')
			.then(rest => {
				if (!rest) {
					throw new NotFoundError('Restaurant not found');
				} else {
					res.json(rest.menu);
					return next();
				}
			})
			.catch(next);
	};

	replaceMenu = (
		req: restify.Request,
		res: restify.Response,
		next: restify.Next
	) => {
		Restaurant.findById(req.params.id)
			.then(rest => {
				if (!rest) {
					throw new NotFoundError('Restaurant not found');
				} else {
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

	applyRoutes(app: restify.Server) {
		app.get(`${this.basePath}`, this.findAll);
		app.get(`${this.basePath}/:id`, [this.validateId, this.findById]);
		app.post(`${this.basePath}`, [authorize('admin'), this.save]);
		app.put(`${this.basePath}/:id`, [
			authorize('admin'),
			this.validateId,
			this.replace
		]);
		app.patch(`${this.basePath}/:id`, [
			authorize('admin'),
			this.validateId,
			this.update
		]);
		app.del(`${this.basePath}/:id`, [
			authorize('admin'),
			this.validateId,
			this.delete
		]);

		app.get(`${this.basePath}/:id/menu`, [this.validateId, this.findMenu]);
		app.put(`${this.basePath}/:id/menu`, [
			authorize('admin'),
			this.validateId,
			this.replaceMenu
		]);
	}
}

export const restaurantsRouter = new RestaurantsRouter();
