const orderService = require('../services/order.service');
const catchAsync = require('../utils/catchAsync');
const { generatePagination } = require('../utils/helpers');

class OrderController {
  createOrder = catchAsync(async (req, res) => {
    const userId = req.user.id;
    const { items } = req.body;
    
    const order = await orderService.createOrder(userId, items);
    
    res.status(201).json({
      status: 'success',
      data: { order },
    });
  });

  getOrderById = catchAsync(async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    
    const order = await orderService.getOrderById(id, userId);
    
    res.status(200).json({
      status: 'success',
      data: { order },
    });
  });

  getUserOrders = catchAsync(async (req, res) => {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    const { orders, total } = await orderService.getUserOrders(userId, page, limit);
    const pagination = generatePagination(page, limit, total);
    
    res.status(200).json({
      status: 'success',
      data: { orders, pagination },
    });
  });
}

module.exports = new OrderController();