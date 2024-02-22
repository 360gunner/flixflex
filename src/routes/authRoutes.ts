import express from 'express';
import { registerUser, loginUser, getCurrentUserProfile } from '../controllers/authController';
import authMiddleware from '../middleware/authMiddleware';

const router = express.Router();

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Registers a new user
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User registered successfully
 *       400:
 *         description: Error occurred during registration
 */

router.post('/signup', registerUser);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Logs in an existing user
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       400:
 *         description: Invalid username or password
 */

router.post('/login', loginUser);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current user's profile
 *     tags: [User]
 *     responses:
 *       200:
 *         description: User profile data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 username:
 *                   type: string
 *                   example: johndoe
 *                 favorites:
 *                   type: array
 *                   example: []
 *       401:
 *         description: Unauthorized, token missing or invalid
 *       404:
 *         description: User not found
 */
router.get('/me', authMiddleware, getCurrentUserProfile);

export default router;
