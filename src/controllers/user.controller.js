const userService = require('../services/user.service');
const catchAsync = require('../utils/catchAsync');
const { generatePagination } = require('../utils/helpers');
const logger = require('../utils/logger');

class UserController {
  getAvailableItems = catchAsync(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search;
    const minPrice = req.query.minPrice ? parseFloat(req.query.minPrice) : undefined;
    const maxPrice = req.query.maxPrice ? parseFloat(req.query.maxPrice) : undefined;
    
    const { items, total } = await userService.getAvailableItems(
      page, 
      limit, 
      search, 
      minPrice, 
      maxPrice
    );
    const pagination = generatePagination(page, limit, total);
    
    res.status(200).json({
      status: 'success',
      data: { items, pagination },
    });
  });

  updateProfile = catchAsync(async (req, res) => {
    const userId = req.user.id;
    const updatedUser = await userService.updateProfile(userId, req.body);
    
    res.status(200).json({
      status: 'success',
      data: { user: updatedUser },
    });
  });

  getUserOrders = catchAsync(async (req, res) => {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    
    const { orders, total } = await userService.getUserOrders(
      userId, 
      page, 
      limit, 
      startDate, 
      endDate
    );
    const pagination = generatePagination(page, limit, total);
    
    res.status(200).json({
      status: 'success',
      data: { orders, pagination },
    });
  });

  getOrderDetails = catchAsync(async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    
    const order = await userService.getOrderDetails(id, userId);
    
    res.status(200).json({
      status: 'success',
      data: { order },
    });
  });
}

module.exports = new UserController();