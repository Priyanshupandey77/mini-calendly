"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_routes_js_1 = __importDefault(require("./routes/auth.routes.js"));
const event_routes_js_1 = __importDefault(require("./routes/event.routes.js"));
const availability_routes_js_1 = __importDefault(require("./routes/availability.routes.js"));
const booking_routes_js_1 = __importDefault(require("./routes/booking.routes.js"));
const error_middleware_js_1 = require("./middleware/error.middleware.js");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/api/auth", auth_routes_js_1.default);
app.use("/api/events", event_routes_js_1.default);
app.use("/api/availability", availability_routes_js_1.default);
app.use("/api/booking", booking_routes_js_1.default);
app.get("/", (_req, res) => {
    res.json({
        message: "Mini Calendly API is running",
    });
});
app.use(error_middleware_js_1.errorMiddleware);
exports.default = app;
