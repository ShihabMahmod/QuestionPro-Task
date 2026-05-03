const { PrismaClient } = require('@prisma/client');
const groceryItemRepository = require('../repositories/groceryItem.repository');
const orderRepository = require('../repositories/order.repository');
const AppError = require('../utils/AppError');
const logger = require('../utils/logger');

const prisma = new PrismaClient();

class OrderService {
  async createOrder(userId, items) {
    return await prisma.$transaction(async (tx) => {
      const itemIds = items.map(item => item.groceryItemId);
      const groceryItems = await groceryItemRepository.findByIdsWithLock(itemIds, tx);

      if (groceryItems.length !== itemIds.length) {
        throw new AppError('Some grocery items not found', 404);
      }

      let totalPrice = 0;
      const orderItemsData = [];
      const inventoryUpdates = [];

      for (const orderItem of items) {
        const groceryItem = groceryItems.find(gi => gi.id === orderItem.groceryItemId);
        
        if (!groceryItem) {
          throw new AppError(`Item not found: ${orderItem.groceryItemId}`, 404);
        }

        if (groceryItem.inventoryCount < orderItem.quantity) {
          throw new AppError(`Insufficient stock for item: ${groceryItem.name}. Available: ${groceryItem.inventoryCount}`, 400);
        }

        const itemTotal = groceryItem.price * orderItem.quantity;
        totalPrice += parseFloat(itemTotal);

        orderItemsData.push({
          groceryItemId: orderItem.groceryItemId,
          quantity: orderItem.quantity,
          price: groceryItem.price,
        });

        inventoryUpdates.push({
          id: groceryItem.id,
          inventoryCount: groceryItem.inventoryCount - orderItem.quantity,
        });
      }

      const order = await orderRepository.create({
        userId,
        totalPrice,
        orderItems: {
          create: orderItemsData,
        },
      }, tx);

      await groceryItemRepository.bulkUpdateInventory(inventoryUpdates, tx);

      logger.info(`Order created: ${order.id} by user ${userId}, Total: ${totalPrice}`);
      
      return { order, totalPrice };
    });
  }

  async getOrderById(orderId, userId) {
    const order = await orderRepository.findById(orderId);
    
    if (!order) {
      throw new AppError('Order not found', 404);
    }

    if (order.userId !== userId) {
      throw new AppError('You do not have permission to view this order', 403);
    }

    return order;
  }

  async getUserOrders(userId, page, limit) {
    const { orders, total } = await orderRepository.findByUser(userId, page, limit);
    return { orders, total };
  }
}

module.exports = new OrderService();