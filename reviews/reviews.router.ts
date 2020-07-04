import { ModelRouter } from '../common/model-router';
import * as restify from 'restify';
import { Review } from './reviews.model';
import { NotFoundError } from 'restify-errors';
import { environment } from './../common/environment';
import { authorize } from '../security/authz.handler';

class ReviewsRouter extends ModelRouter<Review> {
	constructor() {
		super(Review);
	}

	envelope(document: Review | any) {
		let resource = super.envelope(document);
		const restId = document.restaurant._id
			? document.restaurant._id
			: document.restaurant;

		const userId = document.user._id ? document.user._id : document.user;
		resource._links.restaurant = `${environment.server.PROTOCOL}://${environment.server.HOST}:${environment.server.PORT}/restaurants/${restId}`;
		resource._links.user = `${environment.server.PROTOCOL}://${environment.server.HOST}:${environment.server.PORT}/users/${userId}`;
		return resource;
	}

	findById = (
		req: restify.Request,
		res: restify.Response,
		next: restify.Next
	) => {
		this.model
			.findById(req.params.id)
			.populate('user', 'name')
			.populate('restaurant', 'name')
			.then(this.render(req, res, next))
			.catch(next);
	};

	applyRoutes(app: restify.Server) {
		app.get(`${this.basePath}`, this.findAll);
		app.get(`${this.basePath}/:id`, [this.validateId, this.findById]);
		app.post(`${this.basePath}`, [authorize('user'), this.save]);
		// app.put('/reviews/:id', [this.validateId, this.replace]);
		// app.patch('/reviews/:id', [this.validateId, this.update]);
		// app.del('/reviews/:id', [this.validateId, this.delete]);
	}
}

export const reviewsRouter = new ReviewsRouter();
