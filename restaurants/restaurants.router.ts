import { ModelRouter } from '../common/model-router';
import * as restify from 'restify';
import { Restaurant } from './restaurants.model';
import { NotFoundError } from 'restify-errors';

class RestaurantsRouter extends ModelRouter<Restaurant> {
	constructor() {
		super(Restaurant);
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
		app.get('/restaurants', this.findAll);
		app.get('/restaurants/:id', [this.validateId, this.findById]);
		app.post('/restaurants', this.save);
		app.put('/restaurants/:id', [this.validateId, this.replace]);
		app.patch('/restaurants/:id', [this.validateId, this.update]);
		app.del('/restaurants/:id', [this.validateId, this.delete]);

		app.get('/restaurants/:id/menu', [this.validateId, this.findMenu]);
		app.put('/restaurants/:id/menu', [this.validateId, this.replaceMenu]);
	}
}

export const restaurantsRouter = new RestaurantsRouter();
