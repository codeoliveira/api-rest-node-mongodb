import * as mongoose from 'mongoose';

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
		select: true,
		required: true,
		minlength: 8,
		maxlength: 30
	},
	gender: { type: String, required: false, enum: ['M', 'F'] }
});

export const User = mongoose.model<User>('User', userSchema);
