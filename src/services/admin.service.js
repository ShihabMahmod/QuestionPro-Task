const groceryItemRepository = require('../repositories/groceryItem.repository');
const AppError = require('../utils/AppError');
const logger = require('../utils/logger');

class AdminService {
  async createItem(itemData) {
    const item = await groceryItemRepository.create(itemData);
    logger.info(`Admin created grocery item: ${item.name}`);
    return item;
  }

  async getAllItems(page, limit) {
    const { items, total } = await groceryItemRepository.findAll(page, limit);
    return { items, total };
  }

  async updateItem(id, updateData) {
    const item = await groceryItemRepository.findById(id);
    if (!item) {
      throw new AppError('Grocery item not found', 404);
    }

    const updatedItem = await groceryItemRepository.update(id, updateData);
    logger.info(`Admin updated grocery item: ${updatedItem.name}`);
    return updatedItem;
  }

  async deleteItem(id) {
    const item = await groceryItemRepository.findById(id);
    if (!item) {
      throw new AppError('Grocery item not found', 404);
    }

    await groceryItemRepository.delete(id);
    logger.info(`Admin deleted grocery item: ${item.name}`);
    return { message: 'Grocery item deleted successfully' };
  }

  async updateInventory(id, inventoryCount) {
    const item = await groceryItemRepository.findById(id);
    if (!item) {
      throw new AppError('Grocery item not found', 404);
    }

    const updatedItem = await groceryItemRepository.updateInventory(id, inventoryCount);
    logger.info(`Admin updated inventory for item: ${item.name} to ${inventoryCount}`);
    return updatedItem;
  }
}

module.exports = new AdminService();