"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
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
        maxlength: 30
    },
    gender: { type: String, required: false, enum: ['M', 'F'] }
});
exports.User = mongoose.model('User', userSchema);
