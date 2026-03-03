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
exports.CartItem = void 0;
var sequelize_1 = require("sequelize");
var db_ts_1 = require("../config/db.ts");
var CartItem = /** @class */ (function (_super) {
    __extends(CartItem, _super);
    function CartItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return CartItem;
}(sequelize_1.Model));
exports.CartItem = CartItem;
CartItem.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    quantity: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 1,
    },
    selectedExtras: {
        type: sequelize_1.DataTypes.JSONB,
        defaultValue: [],
    },
}, {
    sequelize: db_ts_1.sequelize,
    tableName: "cart_items",
    modelName: "CartItem",
});
