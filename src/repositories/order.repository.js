const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class OrderRepository {
  async create(orderData, transactionClient) {
    const client = transactionClient || prisma;
    return await client.order.create({
      data: orderData,
      include: {
        orderItems: true,
      },
    });
  }

  async findById(id) {
    return await prisma.order.findUnique({
      where: { id },
      include: {
        orderItems: {
          include: {
            groceryItem: true,
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
  }

  async findByUser(userId, page, limit) {
    const skip = (page - 1) * limit;
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          orderItems: {
            include: {
              groceryItem: true,
            },
          },
        },
      }),
      prisma.order.count({ where: { userId } }),
    ]);

    return { orders, total };
  }
}

module.exports = new OrderRepository();