import * as restify from 'restify';
import { EventEmitter } from 'events';
import { NotFoundError } from 'restify-errors';

export abstract class Router extends EventEmitter {
	abstract applyRoutes(application: restify.Server): any;

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
						item: data
					},
					return: true,
					status: 200,
					message: 'Process done'
				};
				res.json(fullData);
			} else {
				throw new NotFoundError('Documento não encontrado');
			}
			return next();
		};
	};

	renderList = (
		req: restify.Request,
		res: restify.Response,
		next: restify.Next
	) => {
		return (data: any[]) => {
			if (data.length > 0) {
				this.emit('beforeRenderList', data);
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
			} else {
				res.send(404);
			}
			return next();
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
