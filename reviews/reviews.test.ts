import 'jest';
import * as request from 'supertest';
import { environment } from '../common/environment';

let fullURL = `${(<any>global).testURL}`;
const auth = environment.security.apiTestToken;

test('get /users', () => {
	return request(fullURL)
		.get('/users')
		.set('Authorization', auth)
		.then(res => {
			expect(res.status).toBe(200);
			expect(res.body.data.items).toBeInstanceOf(Array);
		})
		.catch(fail);
});
