import * as restify from 'restify';
import { User } from '../users/users.model';
import * as jwt from 'jsonwebtoken';
import { environment } from '../common/environment';

export const tokenParser: restify.RequestHandler = (req, res, next) => {
	const token = extractToken(req);
	if (token) {
		jwt.verify(token, environment.security.apiSecret, applyBearer(req, next));
	} else {
		next();
	}
};

function extractToken(req: restify.Request) {
	let token = undefined;
	// Authorization: Bearer TOKEN
	const authorizaton = req.header('authorization');
	if (authorizaton) {
		const parts: string[] = authorizaton.split(' ');
		if (parts.length === 2 && parts[0] === 'Bearer') {
			token = parts[1];
		}
	}
	return token;
}

function applyBearer(
	req: restify.Request,
	next: restify.Next
): (error: any, decoded: any) => void {
	return (error, decoded) => {
		if (decoded) {
			User.findByEmail(decoded.sub).then(user => {
				if (user) {
					// associado usuário no request
					req.authenticated = user;
				}
				next();
			});
		} else {
			next();
		}
	};
}
