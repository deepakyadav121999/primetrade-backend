"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_validator_1 = require("express-validator");
const models_user_1 = require("./models.user");
const config_1 = require("./config");
const router = (0, express_1.Router)();
const signToken = (userId) => jsonwebtoken_1.default.sign({ userId }, config_1.config.jwtSecret, { expiresIn: config_1.config.jwtExpiresIn });
router.post("/signup", [
    (0, express_validator_1.body)("name").notEmpty().withMessage("Name is required"),
    (0, express_validator_1.body)("email").isEmail().withMessage("Valid email is required"),
    (0, express_validator_1.body)("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters"),
], async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    const { name, email, password } = req.body;
    try {
        const existing = await models_user_1.User.findOne({ email });
        if (existing) {
            return res
                .status(400)
                .json({ success: false, message: "Email already registered" });
        }
        const hashed = await bcryptjs_1.default.hash(password, 10);
        const user = await models_user_1.User.create({ name, email, password: hashed });
        const token = signToken(user.id);
        return res.status(201).json({
            success: true,
            data: {
                token,
                user: { id: user.id, name: user.name, email: user.email },
            },
        });
    }
    catch (err) {
        console.error(err);
        return res
            .status(500)
            .json({ success: false, message: "Server error, please try again" });
    }
});
router.post("/login", [
    (0, express_validator_1.body)("email").isEmail().withMessage("Valid email is required"),
    (0, express_validator_1.body)("password").notEmpty().withMessage("Password is required"),
], async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
        const user = await models_user_1.User.findOne({ email });
        if (!user) {
            return res
                .status(400)
                .json({ success: false, message: "Invalid credentials" });
        }
        const match = await bcryptjs_1.default.compare(password, user.password);
        if (!match) {
            return res
                .status(400)
                .json({ success: false, message: "Invalid credentials" });
        }
        const token = signToken(user.id);
        return res.json({
            success: true,
            data: {
                token,
                user: { id: user.id, name: user.name, email: user.email },
            },
        });
    }
    catch (err) {
        console.error(err);
        return res
            .status(500)
            .json({ success: false, message: "Server error, please try again" });
    }
});
exports.default = router;
//# sourceMappingURL=routes.auth.js.map