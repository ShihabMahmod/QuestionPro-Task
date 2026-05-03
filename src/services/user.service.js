const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const groceryItemRepository = require('../repositories/groceryItem.repository');
const orderRepository = require('../repositories/order.repository');
const userRepository = require('../repositories/user.repository');
const AppError = require('../utils/AppError');
const logger = require('../utils/logger');
const { sanitizeUser } = require('../utils/helpers');

const prisma = new PrismaClient();

class UserService {
  async getAvailableItems(page, limit, search, minPrice, maxPrice) {
    const where = {
      inventoryCount: { gt: 0 },
    };

    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    const skip = (page - 1) * limit;
    
    const [items, total] = await Promise.all([
      prisma.groceryItem.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          price: true,
          inventoryCount: true,
          createdAt: true,
        },
      }),
      prisma.groceryItem.count({ where }),
    ]);

    return { items, total };
  }

  async updateProfile(userId, updateData) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    // If updating email, check if it's already taken
    if (updateData.email && updateData.email !== user.email) {
      const existingUser = await userRepository.findByEmail(updateData.email);
      if (existingUser) {
        throw new AppError('Email already in use', 400);
      }
    }

    // If updating password, verify current password
    if (updateData.newPassword) {
      if (!updateData.currentPassword) {
        throw new AppError('Current password is required to update password', 400);
      }
      
      const isPasswordValid = await bcrypt.compare(updateData.currentPassword, user.password);
      if (!isPasswordValid) {
        throw new AppError('Current password is incorrect', 401);
      }
      
      updateData.password = await bcrypt.hash(updateData.newPassword, 12);
      delete updateData.newPassword;
      delete updateData.currentPassword;
    }

    // Remove any fields that shouldn't be updated
    delete updateData.role;
    delete updateData.id;
    delete updateData.createdAt;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    logger.info(`User profile updated: ${updatedUser.email}`);
    
    return sanitizeUser(updatedUser);
  }

  async getUserOrders(userId, page, limit, startDate, endDate) {
    const where = { userId };
    
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    const skip = (page - 1) * limit;
    
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          orderItems: {
            include: {
              groceryItem: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                },
              },
            },
          },
        },
      }),
      prisma.order.count({ where }),
    ]);

    return { orders, total };
  }

  async getOrderDetails(orderId, userId) {
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId,
      },
      include: {
        orderItems: {
          include: {
            groceryItem: {
              select: {
                id: true,
                name: true,
                price: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    return order;
  }
}

module.exports = new UserService();