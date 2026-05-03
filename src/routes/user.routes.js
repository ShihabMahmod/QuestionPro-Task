const express = require('express');
const userController = require('../controllers/user.controller');
const { protect, restrictTo } = require('../middleware/auth.middleware');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User APIs (Customer side)
 */

/**
 * Protect all user routes
 */
router.use(protect);
router.use(restrictTo('USER'));

/**
 * @swagger
 * /api/user/items:
 *   get:
 *     summary: Get available grocery items for users
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of available grocery items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   price:
 *                     type: number
 *                   inventoryCount:
 *                     type: number
 */
router.get(
  '/items',
  userController.getAvailableItems
);

module.exports = router;