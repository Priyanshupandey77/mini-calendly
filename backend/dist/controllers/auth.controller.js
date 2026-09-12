"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signupController = signupController;
exports.loginController = loginController;
const auth_service_js_1 = require("../services/auth.service.js");
const auth_schema_js_1 = require("../schemas/auth.schema.js");
async function signupController(req, res) {
    const result = auth_schema_js_1.signupSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({
            msg: "Invalid input",
            errors: {
                name: "Name must be at least 2 characters",
                email: "Invalid email",
                password: "Password must be at least 8 characters",
            },
        });
    }
    const { name, email, password } = result.data;
    const user = await (0, auth_service_js_1.signup)(name, email, password);
    return res.status(201).json(user);
}
async function loginController(req, res) {
    const result = auth_schema_js_1.loginSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({
            msg: "Invalid input",
            errors: result.error,
        });
    }
    const { email, password } = result.data;
    const token = await (0, auth_service_js_1.login)(email, password);
    return res.status(200).json({
        message: "User logged in successfully",
        token,
    });
}
