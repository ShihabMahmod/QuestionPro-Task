const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class GroceryItemRepository {
  async create(itemData) {
    return await prisma.groceryItem.create({
      data: itemData,
    });
  }

  async findAll(page, limit, onlyInStock = false) {
    const skip = (page - 1) * limit;
    const where = onlyInStock ? { inventoryCount: { gt: 0 } } : {};

    const [items, total] = await Promise.all([
      prisma.groceryItem.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.groceryItem.count({ where }),
    ]);

    return { items, total };
  }

  async findById(id) {
    return await prisma.groceryItem.findUnique({
      where: { id },
    });
  }

  async update(id, updateData) {
    return await prisma.groceryItem.update({
      where: { id },
      data: updateData,
    });
  }

  async delete(id) {
    return await prisma.groceryItem.delete({
      where: { id },
    });
  }

  async updateInventory(id, inventoryCount) {
    return await prisma.groceryItem.update({
      where: { id },
      data: { inventoryCount },
    });
  }

  async findByIdsWithLock(ids, transactionClient) {
    const client = transactionClient || prisma;
    return await client.groceryItem.findMany({
      where: {
        id: { in: ids },
      },
    });
  }

  async bulkUpdateInventory(updates, transactionClient) {
    const client = transactionClient || prisma;
    const promises = updates.map(({ id, inventoryCount }) =>
      client.groceryItem.update({
        where: { id },
        data: { inventoryCount },
      })
    );
    return await Promise.all(promises);
  }
}

module.exports = new GroceryItemRepository();