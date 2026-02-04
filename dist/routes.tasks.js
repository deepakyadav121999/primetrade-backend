"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const models_task_1 = require("./models.task");
const middleware_auth_1 = require("./middleware.auth");
const router = (0, express_1.Router)();
router.get("/tasks", middleware_auth_1.authMiddleware, async (req, res) => {
    const authReq = req;
    const { q, status } = req.query;
    const filter = { user: authReq.userId };
    if (status)
        filter.status = status;
    if (q)
        filter.title = { $regex: q, $options: "i" };
    try {
        const tasks = await models_task_1.Task.find(filter).sort({ createdAt: -1 });
        return res.json({ success: true, data: tasks });
    }
    catch (err) {
        console.error(err);
        return res
            .status(500)
            .json({ success: false, message: "Server error, please try again" });
    }
});
router.post("/tasks", middleware_auth_1.authMiddleware, [(0, express_validator_1.body)("title").notEmpty().withMessage("Title is required")], async (req, res) => {
    const authReq = req;
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    const { title, description, status } = req.body;
    try {
        const task = await models_task_1.Task.create({
            user: authReq.userId,
            title,
            description,
            status,
        });
        return res.status(201).json({ success: true, data: task });
    }
    catch (err) {
        console.error(err);
        return res
            .status(500)
            .json({ success: false, message: "Server error, please try again" });
    }
});
router.get("/tasks/:id", middleware_auth_1.authMiddleware, [(0, express_validator_1.param)("id").isMongoId().withMessage("Invalid task id")], async (req, res) => {
    const authReq = req;
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    try {
        const task = await models_task_1.Task.findOne({
            _id: req.params.id,
            user: authReq.userId,
        });
        if (!task) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }
        return res.json({ success: true, data: task });
    }
    catch (err) {
        console.error(err);
        return res
            .status(500)
            .json({ success: false, message: "Server error, please try again" });
    }
});
router.put("/tasks/:id", middleware_auth_1.authMiddleware, [
    (0, express_validator_1.param)("id").isMongoId().withMessage("Invalid task id"),
    (0, express_validator_1.body)("title").notEmpty().withMessage("Title is required"),
], async (req, res) => {
    const authReq = req;
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    const { title, description, status } = req.body;
    try {
        const task = await models_task_1.Task.findOneAndUpdate({ _id: req.params.id, user: authReq.userId }, { title, description, status }, { new: true });
        if (!task) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }
        return res.json({ success: true, data: task });
    }
    catch (err) {
        console.error(err);
        return res
            .status(500)
            .json({ success: false, message: "Server error, please try again" });
    }
});
router.delete("/tasks/:id", middleware_auth_1.authMiddleware, [(0, express_validator_1.param)("id").isMongoId().withMessage("Invalid task id")], async (req, res) => {
    const authReq = req;
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    try {
        const deleted = await models_task_1.Task.findOneAndDelete({
            _id: req.params.id,
            user: authReq.userId,
        });
        if (!deleted) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }
        return res.json({ success: true, message: "Task deleted" });
    }
    catch (err) {
        console.error(err);
        return res
            .status(500)
            .json({ success: false, message: "Server error, please try again" });
    }
});
exports.default = router;
//# sourceMappingURL=routes.tasks.js.map