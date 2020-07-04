import 'jest';
import * as request from 'supertest';
import { Server } from '../server/server';
import { environment } from '../common/environment';

/*
PROTOCOL: process.env.DB_PROTOCOL || `mongodb://`,
HOST: process.env.DB_HOST || `192.168.0.160`,
PORT: process.env.DB_PORT || `27017`,
DB: process.env.DB_DB || `api-rest-mongodb`,
USER: process.env.DB_USER || `admin`,
PASSWORD: process.env.DB_PASSWORD || `dev102030`
*/

let server: Server;
let fullURL = `${(<any>global).testURL}`;

if (environment.security.enableHTTPS) {
	// fullURL = fullURL.replace('http:', 'https:');
}

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

test('post /users', () => {
	return request(fullURL)
		.post('/users')
		.set('Authorization', auth)
		.send({
			name: 'Usuário teste 01',
			email: 'usuario-teste-01@email.com',
			password: '1234567890',
			cpf: '770.022.068-93'
		})
		.then(res => {
			expect(res.status).toBe(200);
			expect(res.body.data.item._id).toBeDefined();
			expect(res.body.data.item.name).toBe('Usuário teste 01');
			expect(res.body.data.item.email).toBe('usuario-teste-01@email.com');
			expect(res.body.data.item.cpf).toBe('770.022.068-93');
			expect(res.body.data.item.profiles).toBeDefined();
			expect(res.body.data.item.profiles).toBeInstanceOf(Array);
			expect(res.body.data.item.password).toBeUndefined();
		})
		.catch(fail);
});

test('get /users/aaaaa - not found', () => {
	return request(fullURL)
		.get('/users/aaaaa')
		.set('Authorization', auth)
		.then(res => {
			expect(res.status).toBe(404);
			// expect(res.body.data.items).toBeInstanceOf(Array);
		})
		.catch(fail);
});

test('patch /users/:id', () => {
	return request(fullURL)
		.post('/users')
		.set('Authorization', auth)
		.send({
			name: 'Usuário teste 02',
			email: 'usuario-teste-02@email.com',
			password: '1234567890',
			cpf: '747.444.738-06'
		})
		.then(res =>
			request(fullURL)
				.patch(`/users/${res.body.data.item._id}`)
				.set('Authorization', auth)
				.send({
					name: 'Usuário teste 02 Patch'
				})
		)
		.then(res => {
			expect(res.status).toBe(200);
			expect(res.body.data.item._id).toBeDefined();
			expect(res.body.data.item.name).toBe('Usuário teste 02 Patch');
			expect(res.body.data.item.email).toBe('usuario-teste-02@email.com');
			expect(res.body.data.item.password).toBeUndefined();
		})
		.catch(fail);
});

afterAll(() => {
	return server.shutdown();
});
