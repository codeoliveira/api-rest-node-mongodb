"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var model_router_1 = require("../common/model-router");
var reviews_model_1 = require("./reviews.model");
var ReviewsRouter = /** @class */ (function (_super) {
    __extends(ReviewsRouter, _super);
    function ReviewsRouter() {
        var _this = _super.call(this, reviews_model_1.Review) || this;
        _this.findById = function (req, res, next) {
            _this.model
                .findById(req.params.id)
                .populate('user', 'name')
                .populate('restaurant', 'name')
                .then(_this.render(req, res, next))
                .catch(next);
        };
        return _this;
    }
    ReviewsRouter.prototype.applyRoutes = function (app) {
        app.get('/reviews', this.findAll);
        app.get('/reviews/:id', [this.validateId, this.findById]);
        app.post('/reviews', this.save);
        // app.put('/reviews/:id', [this.validateId, this.replace]);
        // app.patch('/reviews/:id', [this.validateId, this.update]);
        // app.del('/reviews/:id', [this.validateId, this.delete]);
    };
    return ReviewsRouter;
}(model_router_1.ModelRouter));
exports.reviewsRouter = new ReviewsRouter();
