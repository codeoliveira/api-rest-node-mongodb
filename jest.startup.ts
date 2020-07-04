import * as jestCli from 'jest-cli';

import 'jest';
import * as request from 'supertest';
import { Server } from './server/server';
import { environment } from './common/environment';
import { usersRouter } from './users/users.router';
import { User } from './users/users.model';
import { reviewsRouter } from './reviews/reviews.router';
import { Review } from './reviews/reviews.model';

/*
PROTOCOL: process.env.DB_PROTOCOL || `mongodb://`,
HOST: process.env.DB_HOST || `192.168.0.160`,
PORT: process.env.DB_PORT || `27017`,
DB: process.env.DB_DB || `api-rest-mongodb`,
USER: process.env.DB_USER || `admin`,
PASSWORD: process.env.DB_PASSWORD || `dev102030`
*/

let server: Server;

const beforeAllTests = () => {
	environment.db.DB = process.env.DB_DB || `api-rest-mongodb-TEST`;
	// environment.server.PORT = process.env.SERVER_PORT || 3001;
	environment.server.PORT = 3001;
	if (environment.security.enableHTTPS) {
		environment.server.PROTOCOL = `https`;
	}

	server = new Server();
	return server
		.bootstrap([usersRouter, reviewsRouter])
		.then(() => User.remove({}).exec())
		.then(() => {
			let admin = new User();
			admin.name = 'admin';
			admin.email = 'admin@email.com';
			admin.password = '1234567890';
			admin.cpf = '538.156.488-07';
			admin.profiles = ['admin', 'user'];
			return admin.save();
		})
		.then(() => Review.remove({}).exec());
};

const afterAllTests = () => {
	return server.shutdown();
};

beforeAllTests()
	.then(() => jestCli.run())
	.then(() => afterAllTests())
	.catch(console.error);
