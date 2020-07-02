import { Server } from './server/server';
import { usersRouter } from './users/users.router';
import { restaurantsRouter } from './restaurants/restaurants.router';
import { reviewsRouter } from './reviews/reviews.router';

const server = new Server();
server
	.bootstrap([usersRouter, restaurantsRouter, reviewsRouter])
	.then(server => {
		const { HOST, PORT } = server.getConfig();

		console.log(`------------------------------------------------------------`);
		console.log(
			`\x1b[33m[api]\x1b[32m[START]`,
			`\x1b[0m>\x1b[36m`,
			`Server is running on ${HOST}:${PORT}`,
			// server.application.address(),
			`\x1b[0m`
		);
		console.log(`------------------------------------------------------------`);
	})
	.catch(error => {
		console.log(
			`\x1b[33m[api]\x1b[31m[ERROR]`,
			`\x1b[0m>\x1b[36m`,
			`${error}`,
			`\x1b[0m`
		);
		process.exit(1);
	});
