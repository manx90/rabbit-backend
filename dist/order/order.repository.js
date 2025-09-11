/* eslint-disable @typescript-eslint/no-unsafe-assignment */ /* eslint-disable prettier/prettier */ /* eslint-disable @typescript-eslint/no-unsafe-member-access */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "OrderRepository", {
    enumerable: true,
    get: function() {
        return OrderRepository;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _authentity = require("../auth/entities/auth.entity");
const _optosshipmentservice = require("../optos/optos.shipment.service");
const _productentity = require("../product/entities/product.entity");
const _typeorm1 = require("typeorm");
const _orderentity = require("./order.entity");
const _ordertypes = require("./order.types");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
let OrderRepository = class OrderRepository {
    async createOrder(dto) {
        const Order = new _orderentity.order();
        // order.business = 1; // Set explicit business value
        Order.items = [];
        for (const item of dto.items){
            const product = await this.productRepo.findOne({
                where: {
                    id: item.productId
                },
                relations: [
                    'category',
                    'subCategory'
                ]
            });
            if (!product) throw new _common.BadRequestException(`Product ${item.productId} not found`);
            const size = product.sizeDetails.find((size)=>size.sizeName === item.sizeName);
            if (!size) {
                throw new _common.BadRequestException(`Size ${item.sizeName} not found in product ${product.id}`);
            }
            const color = size.quantities.find((q)=>q.colorName === item.colorName);
            if (!color) {
                throw new _common.BadRequestException(`Color ${item.colorName} not found in product ${product.id} with size ${item.sizeName}`);
            }
            // Check if there's enough quantity for this specific size and color
            if (color.quantity < item.quantity) {
                throw new _common.BadRequestException(`Insufficient quantity. Available: ${color.quantity}, Requested: ${item.quantity} for product ${product.id} with size ${item.sizeName} and color ${item.colorName}`);
            }
            if (item.quantity <= 0) {
                throw new _common.BadRequestException(`Quantity of ${item.quantity} is not valid for product ${product.id}`);
            }
            const orderItem = new _orderentity.orderitem();
            orderItem.product = product;
            orderItem.productId = product.id;
            orderItem.sizeName = size.sizeName;
            orderItem.colorName = color.colorName;
            orderItem.quantity = item.quantity;
            orderItem.order = Order;
            Order.items.push(orderItem);
            // Update the specific color quantity for this size
            color.quantity -= item.quantity;
            await this.productRepo.save(product);
        }
        // First save the order
        const savedOrder = await this.orderRepo.save(Order);
        // Calculate total amount after items are saved
        savedOrder.amount = Order.items.reduce((total, item)=>total + item.price * item.quantity, 0);
        Order.consignee_name = dto.consignee_name;
        Order.consignee_phone = dto.consignee_phone;
        Order.consignee_city = dto.consignee_city;
        Order.consignee_area = dto.consignee_area;
        Order.consignee_address = dto.consignee_address;
        Order.shipment_types = dto.shipment_types;
        Order.quantity = dto.items.reduce((total, item)=>total + item.quantity, 0).toString();
        Order.items_description = dto.items_description;
        Order.is_cod = dto.is_cod;
        Order.cod_amount = Order.amount.toString();
        Order.has_return = dto.has_return;
        Order.return_notes = dto.return_notes;
        Order.notes = dto.notes;
        //optos create shipment
        const shipmentDto = {
            consignee_name: dto.consignee_name,
            consignee_phone: dto.consignee_phone,
            consignee_city: dto.consignee_city,
            consignee_area: dto.consignee_area,
            consignee_address: dto.consignee_address,
            shipment_types: dto.shipment_types,
            quantity: Order.quantity,
            items_description: dto.items_description,
            is_cod: dto.is_cod === '1' ? '1' : '0',
            cod_amount: Order.amount.toString(),
            has_return: dto.has_return === '1' ? '1' : '0',
            return_notes: dto.return_notes,
            notes: dto.notes
        };
        await this.optosService.createShipment(shipmentDto).then((res)=>{
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            Order.optos_id = res.id;
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            Order.optos_status = res.status;
        });
        // Update the order with the calculated amount
        return this.orderRepo.save(savedOrder);
    }
    async updateOrder(id, orderDto) {
        const order = await this.orderRepo.findOne({
            where: {
                id
            }
        });
        if (!order) {
            throw new _common.NotFoundException(`Order ${id} not found`);
        }
        // Safely update string fields
        if (orderDto.consignee_name) order.consignee_name = orderDto.consignee_name;
        if (orderDto.consignee_phone) order.consignee_phone = orderDto.consignee_phone;
        if (orderDto.consignee_city) order.consignee_city = orderDto.consignee_city;
        if (orderDto.consignee_area) order.consignee_area = orderDto.consignee_area;
        if (orderDto.consignee_address) order.consignee_address = orderDto.consignee_address;
        if (orderDto.shipment_types) order.shipment_types = orderDto.shipment_types;
        if (orderDto.items_description) order.items_description = orderDto.items_description;
        if (orderDto.return_notes) order.return_notes = orderDto.return_notes;
        if (orderDto.notes) order.notes = orderDto.notes;
        if (orderDto.is_cod) {
            order.is_cod = orderDto.is_cod;
        }
        if (orderDto.has_return) {
            order.has_return = orderDto.has_return;
        }
        if (orderDto.items) {
            const orderItems = await Promise.all(orderDto.items.map(async (item)=>{
                const orderItem = new _orderentity.orderitem();
                const product = await this.productRepo.findOne({
                    where: {
                        id: item.productId
                    },
                    relations: [
                        'category',
                        'subCategory'
                    ]
                });
                if (!product) {
                    throw new _common.BadRequestException(`Product ${item.productId} not found`);
                }
                const size = product.sizeDetails.find((size)=>size.sizeName === item.sizeName);
                if (!size) {
                    throw new _common.BadRequestException(`Size ${item.sizeName} not found in product ${product.id}`);
                }
                const color = size.quantities.find((q)=>q.colorName === item.colorName);
                if (!color) {
                    throw new _common.BadRequestException(`Color ${item.colorName} not found in product ${product.id} with size ${item.sizeName}`);
                }
                orderItem.product = product; // Set the product object
                orderItem.productId = product.id;
                orderItem.sizeName = size.sizeName;
                orderItem.colorName = color.colorName;
                orderItem.quantity = item.quantity;
                orderItem.price = size.price; // Set the price from the size
                orderItem.order = order;
                return orderItem;
            }));
            order.items = orderItems;
            // Recalculate order totals
            order.quantity = orderDto.items.reduce((total, item)=>total + item.quantity, 0).toString();
            // The amount will be calculated automatically by the @BeforeUpdate hook
            // but we need to set cod_amount after saving
            const savedOrder = await this.orderRepo.save(order);
            savedOrder.cod_amount = savedOrder.amount.toString();
            return this.orderRepo.save(savedOrder);
        }
        return order;
    }
    async updateOrderStatusToReadied(id) {
        const order = await this.orderRepo.findOne({
            where: {
                id
            }
        });
        if (!order) {
            throw new _common.NotFoundException(`Order ${id} not found`);
        }
        order.status = _ordertypes.OrderStatus.READIED;
        const updatedOrder = await this.orderRepo.save(order);
        return updatedOrder;
    }
    async updateOrderStatusToShipped(id) {
        const order = await this.orderRepo.findOne({
            where: {
                id
            }
        });
        if (!order) {
            throw new _common.NotFoundException(`Order ${id} not found`);
        }
        order.status = _ordertypes.OrderStatus.SHIPPED;
        await this.orderRepo.save(order);
        return;
    }
    async updateOrderStatusToCancelled(id) {
        const order = await this.orderRepo.findOne({
            where: {
                id
            },
            relations: [
                'items',
                'items.product'
            ]
        });
        if (!order) {
            throw new _common.NotFoundException(`Order ${id} not found`);
        }
        // Return all items to inventory before cancelling the order
        if (order.items && order.items.length > 0) {
            for (const item of order.items){
                if (item.product && item.product.sizeDetails) {
                    // Find the specific size and color combination
                    const sizeDetail = item.product.sizeDetails.find((size)=>size.sizeName === item.sizeName);
                    if (sizeDetail) {
                        const colorQuantity = sizeDetail.quantities.find((colorQty)=>colorQty.colorName === item.colorName);
                        if (colorQuantity) {
                            // Return the quantity back to inventory
                            colorQuantity.quantity += item.quantity;
                        }
                    }
                    // Save the updated product
                    await this.orderRepo.manager.save(item.product);
                }
            }
        }
        order.status = _ordertypes.OrderStatus.CANCELLED;
        await this.orderRepo.save(order);
    }
    async getAllOrders() {
        const orders = await this.orderRepo.find();
        for (const order of orders){
            if (order.optos_id) {
                await this.updateOrderOptosStatus(order.optos_id);
            }
        }
        const finalOrders = await this.orderRepo.find();
        return finalOrders;
    }
    async getOrderById(id) {
        const order = await this.orderRepo.findOne({
            where: {
                id
            }
        });
        if (!order) {
            throw new _common.NotFoundException(`Order ${id} not found`);
        }
        return order;
    }
    async getOrdersByStatus(status) {
        return this.orderRepo.find({
            where: {
                status
            }
        });
    }
    async deleteOrder(id) {
        const order = await this.orderRepo.findOne({
            where: {
                id
            }
        });
        if (!order) {
            throw new _common.NotFoundException(`Order ${id} not found`);
        }
        await this.orderRepo.remove(order);
    }
    async addReadyBy(id, readyById) {
        const order = await this.getOrderById(id);
        const readyBy = await this.authRepo.findOne({
            where: {
                id: readyById
            }
        });
        if (!readyBy) {
            throw new _common.NotFoundException(`Ready by user ${readyById} not found`);
        }
        const readyByUser = new _authentity.auth();
        readyByUser.username = readyBy.username;
        order.readyBy = readyByUser;
        const optos = {
            consignee_name: order.consignee_name,
            consignee_phone: order.consignee_phone,
            consignee_city: String(order.consignee_city),
            consignee_area: String(order.consignee_area),
            consignee_address: order.consignee_address,
            shipment_types: String(order.shipment_types),
            quantity: String(order.quantity),
            items_description: order.items_description,
            is_cod: order.is_cod ? '1' : '0',
            cod_amount: String(order.cod_amount),
            has_return: order.has_return ? '1' : '0',
            return_notes: order.return_notes,
            notes: order.notes
        };
        await this.optosService.createShipment(optos);
        return this.orderRepo.save(order);
    }
    async updateOrderOptosStatus(optosId) {
        const order = await this.orderRepo.findOne({
            where: {
                optos_id: optosId
            }
        });
        if (!order) {
            throw new _common.NotFoundException(`Order with optos_id ${optosId} not found`);
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const res = await this.optosService.getShipment({
            id: optosId
        });
        // Add null checks to prevent the error
        if (res && res[0] && res[0].data && res[0].data[0]) {
            console.log(res[0].data[0].status);
            order.optos_status = res[0].data[0].status;
        } else {
            console.log(`No shipment data found for optos_id: ${optosId}`);
            // You can set a default status or leave it as is
            order.optos_status = order.optos_status || '';
        }
        return await this.orderRepo.save(order);
    }
    async deleteAllOrders() {
        await this.orderRepo.createQueryBuilder().delete().execute();
    }
    async length() {
        return this.orderRepo.count();
    }
    async countPendingOrders() {
        return this.orderRepo.count({
            where: {
                status: _ordertypes.OrderStatus.PENDING
            }
        });
    }
    async countCancelledOrders() {
        return this.orderRepo.count({
            where: {
                status: _ordertypes.OrderStatus.CANCELLED
            }
        });
    }
    async countShippedOrders() {
        return this.orderRepo.count({
            where: {
                status: _ordertypes.OrderStatus.SHIPPED
            }
        });
    }
    async countReadiedOrders() {
        return this.orderRepo.count({
            where: {
                status: _ordertypes.OrderStatus.READIED
            }
        });
    }
    constructor(orderRepo, productRepo, authRepo, optosService){
        this.orderRepo = orderRepo;
        this.productRepo = productRepo;
        this.authRepo = authRepo;
        this.optosService = optosService;
    }
};
OrderRepository = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _typeorm.InjectRepository)(_orderentity.order)),
    _ts_param(1, (0, _typeorm.InjectRepository)(_productentity.product)),
    _ts_param(2, (0, _typeorm.InjectRepository)(_authentity.auth)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _optosshipmentservice.OptosShipmentService === "undefined" ? Object : _optosshipmentservice.OptosShipmentService
    ])
], OrderRepository);

//# sourceMappingURL=order.repository.js.map