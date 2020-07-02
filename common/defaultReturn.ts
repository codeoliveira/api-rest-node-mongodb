import * as restify from 'restify';
import { EventEmitter } from 'events';

class DefaultReturn extends EventEmitter {
	build = (data: any[], req: restify.Request) => {
		this.emit('beforeRender', data);

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
			}
		};

		return fullData;
	};

	error = (status: boolean, http: Number, message: String) => {
		return {
			status: status,
			httpStatus: http,
			message: message
		};
	};
}

export { DefaultReturn };
