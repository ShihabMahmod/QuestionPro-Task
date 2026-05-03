const express = require('express');
const adminController = require('../controllers/admin.controller');
const { protect, restrictTo } = require('../middleware/auth.middleware');
const validate = require('../middleware/validation.middleware');

const {
  createItemSchema,
  updateItemSchema,
  updateInventorySchema
} = require('../validations/admin.validation');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin management APIs (Grocery Items)
 */

/**
 * Protect all admin routes
 */
router.use(protect);
router.use(restrictTo('ADMIN'));

/**
 * @swagger
 * /api/admin/items:
 *   post:
 *     summary: Create a new grocery item
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - inventoryCount
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               inventoryCount:
 *                 type: number
 *     responses:
 *       201:
 *         description: Item created successfully
 */
router.post(
  '/items',
  validate(createItemSchema),
  adminController.createItem
);

/**
 * @swagger
 * /api/admin/items:
 *   get:
 *     summary: Get all grocery items
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: List of grocery items
 */
router.get(
  '/items',
  adminController.getAllItems
);

/**
 * @swagger
 * /api/admin/items/{id}:
 *   put:
 *     summary: Update grocery item
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *     responses:
 *       200:
 *         description: Item updated successfully
 */
router.put(
  '/items/:id',
  validate(updateItemSchema),
  adminController.updateItem
);

/**
 * @swagger
 * /api/admin/items/{id}:
 *   delete:
 *     summary: Delete grocery item
 *     tags: [Admin]
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
 *         description: Item deleted successfully
 */
router.delete(
  '/items/:id',
  adminController.deleteItem
);

/**
 * @swagger
 * /api/admin/items/{id}/inventory:
 *   patch:
 *     summary: Update item inventory
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - inventoryCount
 *             properties:
 *               inventoryCount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Inventory updated successfully
 */
router.patch(
  '/items/:id/inventory',
  validate(updateInventorySchema),
  adminController.updateInventory
);

module.exports = router;