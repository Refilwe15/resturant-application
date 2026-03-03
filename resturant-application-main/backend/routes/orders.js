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
var express_1 = require("express");
var Order_ts_1 = require("../models/Order.ts");
var auth_ts_1 = require("../middlewares/auth.ts");
var router = express_1.default.Router();
/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Place an order
 */
router.post("/", auth_ts_1.authMiddleware, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, items, totalPrice, deliveryAddress, paymentStatus, order, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                // ✅ Ensure user is authenticated
                if (!req.user)
                    return [2 /*return*/, res.status(401).json({ message: "Unauthorized" })];
                _a = req.body, items = _a.items, totalPrice = _a.totalPrice, deliveryAddress = _a.deliveryAddress, paymentStatus = _a.paymentStatus;
                // ✅ Validate incoming data
                if (!items || !Array.isArray(items) || items.length === 0)
                    return [2 /*return*/, res.status(400).json({ message: "Cart is empty" })];
                if (!totalPrice || !deliveryAddress)
                    return [2 /*return*/, res
                            .status(400)
                            .json({ message: "Missing totalPrice or deliveryAddress" })];
                return [4 /*yield*/, Order_ts_1.Order.create({
                        userId: req.user.id,
                        items: items, // frontend sends items as [{ foodId, quantity, selectedExtras, notes }]
                        totalPrice: totalPrice,
                        deliveryAddress: deliveryAddress,
                        paymentStatus: paymentStatus || "pending",
                        orderStatus: "processing",
                    })];
            case 1:
                order = _b.sent();
                return [2 /*return*/, res.status(201).json({
                        success: true,
                        message: "Order placed successfully",
                        order: order,
                    })];
            case 2:
                err_1 = _b.sent();
                console.error("POST /orders error:", err_1);
                return [2 /*return*/, res
                        .status(500)
                        .json({ success: false, message: "Server error", error: err_1.message })];
            case 3: return [2 /*return*/];
        }
    });
}); });
/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: View user orders
 */
router.get("/", auth_ts_1.authMiddleware, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var orders, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                if (!req.user)
                    return [2 /*return*/, res.status(401).json({ message: "Unauthorized" })];
                return [4 /*yield*/, Order_ts_1.Order.findAll({
                        where: { userId: req.user.id },
                        order: [["createdAt", "DESC"]],
                    })];
            case 1:
                orders = _a.sent();
                return [2 /*return*/, res.json({
                        success: true,
                        message: "Orders fetched successfully",
                        orders: orders,
                    })];
            case 2:
                err_2 = _a.sent();
                console.error("GET /orders error:", err_2);
                return [2 /*return*/, res
                        .status(500)
                        .json({ success: false, message: "Server error", error: err_2.message })];
            case 3: return [2 /*return*/];
        }
    });
}); });
/**
 * @swagger
 * /api/orders/{id}/status:
 *   put:
 *     summary: Update order status (Admin)
 */
router.put("/:id/status", auth_ts_1.authMiddleware, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, orderStatus, order, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                if (!req.user) {
                    return [2 /*return*/, res.status(403).json({ message: "Admins only" })];
                }
                id = req.params.id;
                orderStatus = req.body.orderStatus;
                if (!orderStatus) {
                    return [2 /*return*/, res.status(400).json({ message: "orderStatus is required" })];
                }
                return [4 /*yield*/, Order_ts_1.Order.findByPk(id)];
            case 1:
                order = _a.sent();
                if (!order) {
                    return [2 /*return*/, res.status(404).json({ message: "Order not found" })];
                }
                return [4 /*yield*/, order.update({ orderStatus: orderStatus })];
            case 2:
                _a.sent();
                return [2 /*return*/, res.json({
                        success: true,
                        message: "Order status updated",
                        order: order,
                    })];
            case 3:
                err_3 = _a.sent();
                console.error("PUT /orders/:id/status error:", err_3);
                return [2 /*return*/, res.status(500).json({ message: "Server error" })];
            case 4: return [2 /*return*/];
        }
    });
}); });
/**
 * @swagger
 * /api/orders/my-orders:
 *   get:
 *     summary: Get orders belonging to the logged-in user
 *
 */
router.get("/my-orders", auth_ts_1.authMiddleware, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var orders, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                if (!req.user)
                    return [2 /*return*/, res.status(401).json({ message: "Unauthorized" })];
                return [4 /*yield*/, Order_ts_1.Order.findAll({
                        where: { userId: req.user.id },
                        order: [["createdAt", "DESC"]],
                    })];
            case 1:
                orders = _a.sent();
                return [2 /*return*/, res.json({
                        success: true,
                        message: "User orders fetched successfully",
                        orders: orders,
                    })];
            case 2:
                err_4 = _a.sent();
                console.error("GET /orders/my-orders error:", err_4);
                return [2 /*return*/, res.status(500).json({ success: false, message: "Server error", error: err_4.message })];
            case 3: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
