"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;
exports.config = {
    port: PORT,
    mongoUri: process.env.MONGO_URI ??
        "mongodb://localhost:27017/primetrade_auth_dashboard",
    jwtSecret: process.env.JWT_SECRET ?? "dev-secret-change-in-prod",
    jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "1h",
};
//# sourceMappingURL=config.js.map