import * as restify from 'restify';
import { Router } from './router';
import * as mongoose from 'mongoose';
import { NotFoundError } from 'restify-errors';

export abstract class ModelRouter<D extends mongoose.Document> extends Router {
	constructor(protected model: mongoose.Model<D>) {
		super();
	}

	validateId = (
		req: restify.Request,
		res: restify.Response,
		next: restify.Next
	) => {
		if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
			next(new NotFoundError('Document not found'));
		} else {
			next();
		}
	};

	findAll = (
		req: restify.Request,
		res: restify.Response,
		next: restify.Next
	) => {
		this.model.find().then(this.renderList(req, res, next)).catch(next);
	};

	findById = (
		req: restify.Request,
		res: restify.Response,
		next: restify.Next
	) => {
		this.model
			.findById(req.params.id)
			.then(this.render(req, res, next))
			.catch(next);
	};

	save = (req: restify.Request, res: restify.Response, next: restify.Next) => {
		const document: D = new this.model(req.body);
		document.save().then(this.render(req, res, next)).catch(next);
	};

	replace = (
		req: restify.Request,
		res: restify.Response,
		next: restify.Next
	) => {
		const options = {
			runValidators: true,
			overwrite: true
		};
		this.model
			.update({ _id: req.params.id }, req.body, options)
			.exec()
			.then((result): any => {
				if (result.n) {
					return this.model.findById(req.params.id);
				} else {
					throw new NotFoundError('Documento não encontrado');
				}
			})
			.then(this.render(req, res, next))
			.catch(next);
	};

	update = (
		req: restify.Request,
		res: restify.Response,
		next: restify.Next
	) => {
		const options = {
			runValidators: true,
			new: true
		};

		this.model
			.findByIdAndUpdate(req.params.id, req.body, options)
			.then(this.render(req, res, next))
			.catch(next);
	};

	delete = (
		req: restify.Request,
		res: restify.Response,
		next: restify.Next
	) => {
		this.model
			.findByIdAndRemove({ _id: req.params.id })
			.then(this.render(req, res, next))
			.catch(next);
	};
}
