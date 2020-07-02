import * as mongoose from 'mongoose';
import { validateCPF } from '../common/validators';
import * as bcrypt from 'bcrypt';
import { environment } from './../common/environment';
import * as restify from 'restify';

export interface User extends mongoose.Document {
	name: string;
	email: string;
	password: string;
}

const userSchema = new mongoose.Schema({
	name: { type: String, required: true, minlength: 3, maxlength: 50 },
	email: {
		type: String,
		unique: true,
		required: true,
		match: /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/
	},
	password: {
		type: String,
		select: false,
		required: true,
		minlength: 8,
		maxlength: 100
	},
	gender: { type: String, required: false, enum: ['M', 'F'] },
	cpf: {
		type: String,
		required: true,
		validate: {
			validator: validateCPF,
			message: '{PATH}: Invalid CPF ({VALUE})'
		}
	}
});

const hashPassword = (obj: any, next: restify.Next) => {
	bcrypt
		.hash(obj.password, environment.security.saltRounds)
		.then(hash => {
			obj.password = hash;
			next();
		})
		.catch(next);
};

const saveMiddleware = function (next: restify.Next) {
	const user: User = this;
	if (!user.isModified('password')) {
		next();
	} else {
		hashPassword(user, next);
	}
};

const updateMiddleware = function (next: restify.Next) {
	if (!this.getUpdate().password) {
		next();
	} else {
		hashPassword(this.getUpdate(), next);
	}
};

userSchema.pre('save', saveMiddleware);
userSchema.pre('findOneAndUpdate', updateMiddleware);
userSchema.pre('update', updateMiddleware);

export const User = mongoose.model<User>('User', userSchema);
