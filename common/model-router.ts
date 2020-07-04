import * as restify from 'restify';
import { Router } from './router';
import * as mongoose from 'mongoose';
import { NotFoundError } from 'restify-errors';
import { environment } from './../common/environment';

export abstract class ModelRouter<D extends mongoose.Document> extends Router {
	basePath: string;
	pagination: {
		start: Number;
		limit: Number;
	};
	search: {
		key: String;
		value: String;
	};

	constructor(protected model: mongoose.Model<D>) {
		super();
		this.basePath = `/${model.collection.name}`;
		this.pagination = environment.pagination;
		this.search = environment.search;
	}

	envelope(document: any): any {
		let resource = Object.assign({ _links: {} }, document.toJSON());
		resource._links.self = `${environment.server.PROTOCOL}://${environment.server.HOST}:${environment.server.PORT}${this.basePath}/${resource._id}`;
		return resource;
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
