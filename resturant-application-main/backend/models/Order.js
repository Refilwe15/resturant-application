"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
var sequelize_1 = require("sequelize");
var db_ts_1 = require("../config/db.ts");
var User_ts_1 = require("./User.ts");
var Order = /** @class */ (function (_super) {
    __extends(Order, _super);
    function Order() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Order;
}(sequelize_1.Model));
exports.Order = Order;
Order.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    items: {
        type: sequelize_1.DataTypes.JSONB,
        allowNull: false,
    },
    totalPrice: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
    },
    deliveryAddress: {
        type: sequelize_1.DataTypes.TEXT,
    },
    paymentStatus: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: "pending",
    },
    orderStatus: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: "processing",
    },
}, {
    sequelize: db_ts_1.sequelize,
    tableName: "orders",
    modelName: "Order",
});
User_ts_1.User.hasMany(Order, { foreignKey: "userId" });
Order.belongsTo(User_ts_1.User, { foreignKey: "userId" });
