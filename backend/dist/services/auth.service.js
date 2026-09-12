"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signup = signup;
exports.login = login;
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_js_1 = __importDefault(require("../lib/prisma.js"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
async function signup(name, email, password) {
    const normalizedEmail = email.toLowerCase();
    // 1. Hash password
    const hashedPassword = await bcrypt_1.default.hash(password, 10);
    // 2. Create user
    const user = await prisma_js_1.default.user.create({
        data: {
            name,
            email: normalizedEmail,
            password: hashedPassword,
        },
        select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
        },
    });
    // 3. Return user
    return user;
}
async function login(email, password) {
    const normalizedEmail = email.toLowerCase();
    const user = await prisma_js_1.default.user.findUnique({
        where: {
            email: normalizedEmail,
        },
    });
    if (!user) {
        throw new Error("User not found");
    }
    const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error("Incorrect email or password");
    }
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("jwt not found");
    }
    const token = jsonwebtoken_1.default.sign({ userId: user.id }, secret);
    return token;
}
