"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var validators_1 = require("../common/validators");
var bcrypt = require("bcrypt");
var environment_1 = require("./../common/environment");
var userSchema = new mongoose.Schema({
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
        maxlength: 100
    },
    gender: { type: String, required: false, enum: ['M', 'F'] },
    cpf: {
        type: String,
        required: true,
        validate: {
            validator: validators_1.validateCPF,
            message: '{PATH}: Invalid CPF ({VALUE})'
        }
    }
});
var hashPassword = function (obj, next) {
    bcrypt
        .hash(obj.password, environment_1.environment.security.saltRounds)
        .then(function (hash) {
        obj.password = hash;
        next();
    })
        .catch(next);
};
var saveMiddleware = function (next) {
    var user = this;
    if (!user.isModified('password')) {
        next();
    }
    else {
        hashPassword(user, next);
    }
};
var updateMiddleware = function (next) {
    if (!this.getUpdate().password) {
        next();
    }
    else {
        hashPassword(this.getUpdate(), next);
    }
};
userSchema.pre('save', saveMiddleware);
userSchema.pre('findOneAndUpdate', updateMiddleware);
userSchema.pre('update', updateMiddleware);
exports.User = mongoose.model('User', userSchema);
