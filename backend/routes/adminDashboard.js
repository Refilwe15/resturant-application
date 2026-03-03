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
var FoodItem_ts_1 = require("../models/FoodItem.ts");
var db_ts_1 = require("../config/db.ts");
var auth_ts_1 = require("../middlewares/auth.ts");
var sequelize_1 = require("sequelize");
var router = express_1.default.Router();
router.get("/dashboard", auth_ts_1.authMiddleware, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var openOrders, completedOrders, totalFoods, revenueResult, recentOrders, ordersByDay, revenueByDay, err_1;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 8, , 9]);
                return [4 /*yield*/, Order_ts_1.Order.count({
                        where: { orderStatus: (_a = {}, _a[sequelize_1.Op.ne] = "delivered", _a) }
                    })];
            case 1:
                openOrders = _b.sent();
                return [4 /*yield*/, Order_ts_1.Order.count({
                        where: { orderStatus: "delivered" }
                    })];
            case 2:
                completedOrders = _b.sent();
                return [4 /*yield*/, FoodItem_ts_1.FoodItem.count()];
            case 3:
                totalFoods = _b.sent();
                return [4 /*yield*/, Order_ts_1.Order.sum("totalPrice", {
                        where: { orderStatus: "delivered" }
                    })];
            case 4:
                revenueResult = _b.sent();
                return [4 /*yield*/, Order_ts_1.Order.findAll({
                        order: [["createdAt", "DESC"]],
                        limit: 5,
                        attributes: ["id", "orderStatus", "totalPrice", "createdAt"],
                        include: ["User"]
                    })];
            case 5:
                recentOrders = _b.sent();
                return [4 /*yield*/, Order_ts_1.Order.findAll({
                        attributes: [
                            [db_ts_1.sequelize.fn("DATE", db_ts_1.sequelize.col("createdAt")), "date"],
                            [db_ts_1.sequelize.fn("COUNT", "*"), "count"]
                        ],
                        group: ["date"],
                        order: [["date", "ASC"]],
                        limit: 7
                    })];
            case 6:
                ordersByDay = _b.sent();
                return [4 /*yield*/, Order_ts_1.Order.findAll({
                        attributes: [
                            [db_ts_1.sequelize.fn("DATE", db_ts_1.sequelize.col("createdAt")), "date"],
                            [db_ts_1.sequelize.fn("SUM", db_ts_1.sequelize.col("totalPrice")), "total"]
                        ],
                        where: { orderStatus: "completed" },
                        group: ["date"],
                        order: [["date", "ASC"]],
                        limit: 7
                    })];
            case 7:
                revenueByDay = _b.sent();
                res.json({
                    stats: {
                        openOrders: openOrders,
                        completedOrders: completedOrders,
                        totalFoods: totalFoods,
                        totalRevenue: revenueResult || 0
                    },
                    recentOrders: recentOrders,
                    ordersByDay: ordersByDay,
                    revenueByDay: revenueByDay
                });
                return [3 /*break*/, 9];
            case 8:
                err_1 = _b.sent();
                console.error(err_1);
                res.status(500).json({ message: "Dashboard error" });
                return [3 /*break*/, 9];
            case 9: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
