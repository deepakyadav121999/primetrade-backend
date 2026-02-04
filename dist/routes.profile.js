"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const models_user_1 = require("./models.user");
const middleware_auth_1 = require("./middleware.auth");
const router = (0, express_1.Router)();
router.get("/me", middleware_auth_1.authMiddleware, async (req, res) => {
    const authReq = req;
    try {
        const user = await models_user_1.User.findById(authReq.userId).select("-password");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        return res.json({ success: true, data: user });
    }
    catch (err) {
        console.error(err);
        return res
            .status(500)
            .json({ success: false, message: "Server error, please try again" });
    }
});
router.put("/me", middleware_auth_1.authMiddleware, [(0, express_validator_1.body)("name").notEmpty().withMessage("Name is required")], async (req, res) => {
    const authReq = req;
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    try {
        const updated = await models_user_1.User.findByIdAndUpdate(authReq.userId, { name: req.body.name }, { new: true }).select("-password");
        if (!updated) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        return res.json({ success: true, data: updated });
    }
    catch (err) {
        console.error(err);
        return res
            .status(500)
            .json({ success: false, message: "Server error, please try again" });
    }
});
exports.default = router;
//# sourceMappingURL=routes.profile.js.map