const adminService = require('../services/admin.service');
const catchAsync = require('../utils/catchAsync');
const { generatePagination } = require('../utils/helpers');

class AdminController {
  createItem = catchAsync(async (req, res) => {
    const item = await adminService.createItem(req.body);
    
    res.status(201).json({
      status: 'success',
      data: { item },
    });
  });

  getAllItems = catchAsync(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    const { items, total } = await adminService.getAllItems(page, limit);
    const pagination = generatePagination(page, limit, total);
    
    res.status(200).json({
      status: 'success',
      data: { items, pagination },
    });
  });

  updateItem = catchAsync(async (req, res) => {
    const { id } = req.params;
    const updatedItem = await adminService.updateItem(id, req.body);
    
    res.status(200).json({
      status: 'success',
      data: { item: updatedItem },
    });
  });

  deleteItem = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await adminService.deleteItem(id);
    
    res.status(200).json({
      status: 'success',
      message: result.message,
    });
  });

  updateInventory = catchAsync(async (req, res) => {
    const { id } = req.params;
    const { inventoryCount } = req.body;
    const updatedItem = await adminService.updateInventory(id, inventoryCount);
    
    res.status(200).json({
      status: 'success',
      data: { item: updatedItem },
    });
  });
}

module.exports = new AdminController();