import * as restify from 'restify';
import { EventEmitter } from 'events';
import { NotFoundError } from 'restify-errors';

export abstract class Router extends EventEmitter {
	abstract applyRoutes(application: restify.Server): any;

	envelope(document: any): any {
		return document;
	}

	render = (
		req: restify.Request,
		res: restify.Response,
		next: restify.Next
	) => {
		return (data: any) => {
			if (data) {
				this.emit('beforeRenderSingle', data);
				const fullData = {
					data: {
						item: this.envelope(data)
					},
					return: true,
					status: 200,
					message: 'Process done'
				};
				res.json(fullData);
			} else {
				throw new NotFoundError('Documento não encontrado');
			}
			return next(false);
		};
	};

	renderList = (
		req: restify.Request,
		res: restify.Response,
		next: restify.Next
	) => {
		return (data: any[]) => {
			if (data.length > 0) {
				data.forEach((document, index, array) => {
					this.emit('beforeRenderSingle', document);
					array[index] = this.envelope(document);
				});

				// this.emit('beforeRenderList', data);

				const fullData = {
					data: {
						items: data,
						total: data.length,
						filtered: data.length
					},
					search: {
						key: req.query.search.key,
						value: req.query.search.value
					},
					pagination: {
						start: req.query.pagination.start,
						limit: req.query.pagination.limit
					},
					return: true,
					status: 200,
					message: 'Process done'
				};
				res.json(fullData);
			} else {
				const fullData = {
					data: {
						items: data,
						total: data.length,
						filtered: data.length
					},
					search: {
						key: '',
						value: ''
					},
					pagination: {
						start: 0,
						limit: 100
					},
					return: true,
					status: 200,
					message: 'Process done'
				};
				res.json(fullData);
				// res.send(404);
			}
			return next(false);
		};
	};

	error = (
		res: restify.Response,
		next: restify.Next,
		statusProcess: boolean,
		http: Number,
		message: String
	) => {
		res.json({
			return: statusProcess,
			status: http,
			message: message
		});
		return next();
	};
}
