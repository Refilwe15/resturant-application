"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
var express_1 = require("express");
var cors_1 = require("cors");
var path_1 = require("path");
var db_ts_1 = require("./config/db.ts"); // Your DB config
var swagger_ui_express_1 = require("swagger-ui-express");
var swagger_ts_1 = require("./config/swagger.ts");
var auth_ts_1 = require("./routes/auth.ts");
var users_ts_1 = require("./routes/users.ts");
var foods_ts_1 = require("./routes/foods.ts");
var cart_ts_1 = require("./routes/cart.ts");
var orders_ts_1 = require("./routes/orders.ts");
var adminDashboard_ts_1 = require("./routes/adminDashboard.ts");
var adminOrders_ts_1 = require("./routes/adminOrders.ts");
var fs_1 = require("fs");
var url_1 = require("url");
var stripe_1 = require("stripe");
// Recreate __dirname in ES module
var __filename = (0, url_1.fileURLToPath)(import.meta.url);
var __dirname = path_1.default.dirname(__filename);
// Create uploads folder if it doesn't exist
var uploadDir = path_1.default.join(__dirname, "uploads");
if (!fs_1.default.existsSync(uploadDir))
    fs_1.default.mkdirSync(uploadDir);
// ===============================
// App
// ===============================
var app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/uploads", express_1.default.static(uploadDir));
// ===============================
// Swagger
// ===============================
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_ts_1.swaggerSpec));
// ===============================
// Routes
// ===============================
app.use("/api/auth", auth_ts_1.default);
app.use("/api/users", users_ts_1.default);
app.use("/api/foods", foods_ts_1.default);
app.use("/api/cart", cart_ts_1.default);
app.use("/api/orders", orders_ts_1.default);
app.use("/api/admin", adminDashboard_ts_1.default);
app.use("/api/admin", adminOrders_ts_1.default);
// ===============================
// Stripe Payment
// ===============================
var stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2022-11-15",
});
// Create PaymentIntent (backend-only, simple)
app.post("/api/payment/create-payment-intent", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, amount, _b, currency, paymentIntent, err_1;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = req.body, amount = _a.amount, _b = _a.currency, currency = _b === void 0 ? "usd" : _b;
                if (!amount) {
                    return [2 /*return*/, res
                            .status(400)
                            .json({ success: false, message: "Amount is required" })];
                }
                _c.label = 1;
            case 1:
                _c.trys.push([1, 3, , 4]);
                return [4 /*yield*/, stripe.paymentIntents.create({
                        amount: amount, // in cents
                        currency: currency,
                        payment_method_types: ["card"],
                        payment_method: "pm_card_visa", // Stripe test card
                        confirm: true, // immediately confirm the payment
                    })];
            case 2:
                paymentIntent = _c.sent();
                return [2 /*return*/, res.json({ success: true, paymentIntent: paymentIntent })];
            case 3:
                err_1 = _c.sent();
                console.error(err_1);
                return [2 /*return*/, res.status(500).json({ success: false, message: err_1.message })];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Retrieve PaymentIntent status
app.get("/api/payment/intent/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, paymentIntent, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, stripe.paymentIntents.retrieve(id)];
            case 2:
                paymentIntent = _a.sent();
                return [2 /*return*/, res.json({ success: true, paymentIntent: paymentIntent })];
            case 3:
                err_2 = _a.sent();
                console.error(err_2);
                return [2 /*return*/, res.status(500).json({ success: false, message: err_2.message })];
            case 4: return [2 /*return*/];
        }
    });
}); });
// ===============================
// Test route
// ===============================
app.get("/", function (req, res) {
    res.json({ message: "Restaurant API is running" });
});
// Admin views
var adminViewsPath = path_1.default.join(__dirname, "admin-views");
var adminPublicPath = path_1.default.join(__dirname, "admin", "public");
app.use("/admin/static", express_1.default.static(adminPublicPath));
app.get("/admin", function (_, res) {
    res.sendFile(path_1.default.join(adminViewsPath, "login.html"));
});
app.get("/admin/dashboard", function (_, res) {
    res.sendFile(path_1.default.join(adminViewsPath, "dashboard.html"));
});
app.get("/admin/foods", function (_, res) {
    res.sendFile(path_1.default.join(adminViewsPath, "foods.html"));
});
app.get("/admin/foods/add", function (_, res) {
    res.sendFile(path_1.default.join(adminViewsPath, "add-food.html"));
});
app.get("/admin/foods/edit/:id", function (_, res) {
    res.sendFile(path_1.default.join(adminViewsPath, "edit-food.html"));
});
app.get("/admin/orders", function (_, res) {
    res.sendFile(path_1.default.join(adminViewsPath, "orders.html"));
});
// ===============================
// Database + Server Start
// ===============================
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var PORT_1, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, db_ts_1.sequelize.sync({ alter: true })];
            case 1:
                _a.sent();
                console.log("Database connected and synced");
                PORT_1 = Number(process.env.PORT) || 8000;
                app.listen(PORT_1, function () {
                    console.log("Server running on port ".concat(PORT_1));
                });
                return [3 /*break*/, 3];
            case 2:
                err_3 = _a.sent();
                console.error("DB connection failed:", err_3);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); })();
