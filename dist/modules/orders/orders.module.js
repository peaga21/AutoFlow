"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersModule = void 0;
const common_1 = require("@nestjs/common");
const orders_controller_js_1 = require("./controllers/orders.controller.js");
const orders_service_js_1 = require("./services/orders.service.js");
const orders_repository_interface_js_1 = require("./repositories/orders.repository.interface.js");
const payments_repository_interface_js_1 = require("../payments/repositories/payments.repository.interface.js");
let OrdersModule = class OrdersModule {
};
exports.OrdersModule = OrdersModule;
exports.OrdersModule = OrdersModule = __decorate([
    (0, common_1.Module)({
        controllers: [orders_controller_js_1.OrdersController],
        providers: [
            orders_service_js_1.OrdersService,
            {
                provide: orders_repository_interface_js_1.ORDERS_REPOSITORY,
                useValue: {
                    findById: async (id) => {
                        if (id === '123') {
                            return {
                                id: '123',
                                status: 'PENDING',
                                totalAmount: 100,
                                confirmedAt: null,
                                confirm() {
                                    this.status = 'CONFIRMED';
                                    this.confirmedAt = new Date();
                                },
                            };
                        }
                        return null;
                    },
                    save: async (order) => order,
                },
            },
            {
                provide: payments_repository_interface_js_1.PAYMENTS_REPOSITORY,
                useValue: {
                    findByOrderId: async (orderId) => {
                        if (orderId === '123') {
                            return {
                                id: 'p1',
                                orderId: '123',
                                status: 'APPROVED',
                                isApproved() {
                                    return true;
                                },
                            };
                        }
                        return null;
                    },
                },
            },
        ],
    })
], OrdersModule);
//# sourceMappingURL=orders.module.js.map