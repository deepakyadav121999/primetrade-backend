"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const config_1 = require("./config");
const db_1 = require("./db");
const routes_auth_1 = __importDefault(require("./routes.auth"));
const routes_profile_1 = __importDefault(require("./routes.profile"));
const routes_tasks_1 = __importDefault(require("./routes.tasks"));
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: "*", // keep simple for assignment; in prod, restrict this
}));
app.use(express_1.default.json());
app.use((0, morgan_1.default)("dev"));
app.get("/api/v1/health", (_req, res) => {
    res.json({ success: true, message: "API is healthy" });
});
app.use("/api/v1/auth", routes_auth_1.default);
app.use("/api/v1", routes_profile_1.default);
app.use("/api/v1", routes_tasks_1.default);
app.use((err, _req, res, _next) => {
    console.error("Unhandled error", err);
    res.status(500).json({ success: false, message: "Unexpected server error" });
});
const start = async () => {
    await (0, db_1.connectDB)();
    app.listen(config_1.config.port, () => {
        console.log(`🚀 Server running on http://localhost:${config_1.config.port}`);
    });
};
start().catch((err) => {
    console.error("Failed to start server", err);
});
//# sourceMappingURL=index.js.map