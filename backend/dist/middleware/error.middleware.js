"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = errorMiddleware;
const AppError_1 = require("../errors/AppError");
function errorMiddleware(err, _req, res, _next) {
    if (err instanceof AppError_1.AppError) {
        return res.status(err.statusCode).json({
            msg: err.message,
        });
    }
    else {
        return res.status(500).json({
            msg: "Internal server error",
        });
    }
}
