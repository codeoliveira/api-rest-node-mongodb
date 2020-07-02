import { ModelRouter } from '../common/model-router';
import * as restify from 'restify';
import { Review } from './reviews.model';
import { NotFoundError } from 'restify-errors';

class ReviewsRouter extends ModelRouter<Review> {
	constructor() {
		super(Review);
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
		app.get('/reviews', this.findAll);
		app.get('/reviews/:id', [this.validateId, this.findById]);
		app.post('/reviews', this.save);
		// app.put('/reviews/:id', [this.validateId, this.replace]);
		// app.patch('/reviews/:id', [this.validateId, this.update]);
		// app.del('/reviews/:id', [this.validateId, this.delete]);
	}
}

export const reviewsRouter = new ReviewsRouter();
