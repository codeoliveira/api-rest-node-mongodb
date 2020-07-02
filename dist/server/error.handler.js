"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleError = function (req, res, err, done) {
    err.toJSON = function () {
        return {
            message: err.message
        };
    };
    switch (err.name) {
        case 'MongoError':
            if (err.code === 11000) {
                err.statusCode = 400;
            }
            break;
        case 'ValidationError':
            err.statusCode = 400;
            var messages_1 = [];
            for (var name_1 in err.errors) {
                messages_1.push({ message: err.errors[name_1].message });
            }
            err.toJSON = function () { return ({
                errors: messages_1
            }); };
            break;
    }
    done();
};
