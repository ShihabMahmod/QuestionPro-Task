const express = require('express');
const orderController = require('../controllers/order.controller');
const { protect, restrictTo } = require('../middleware/auth.middleware');
const validate = require('../middleware/validation.middleware');
const { createOrderSchema } = require('../validations/order.validation');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: User order management APIs
 */

/**
 * Protect all order routes
 */
router.use(protect);
router.use(restrictTo('USER'));

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *             properties:
 *               items:
 *                 type: array
 *                 description: List of grocery items in the order
 *                 items:
 *                   type: object
 *                   required:
 *                     - groceryItemId
 *                     - quantity
 *                   properties:
 *                     groceryItemId:
 *                       type: string
 *                     quantity:
 *                       type: number
 *     responses:
 *       201:
 *         description: Order created successfully
 */
router.post(
  '/',
  validate(createOrderSchema),
  orderController.createOrder
);

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get logged-in user's orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   totalPrice:
 *                     type: number
 *                   createdAt:
 *                     type: string
 */
router.get(
  '/',
  orderController.getUserOrders
);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get order by ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 totalPrice:
 *                   type: number
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *       404:
 *         description: Order not found
 */
router.get(
  '/:id',
  orderController.getOrderById
);

module.exports = router;