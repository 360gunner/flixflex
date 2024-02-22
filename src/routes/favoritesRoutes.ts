import express from 'express';
import { addFavorite, removeFavorite, listFavorites } from '../controllers/favoritesController';

const router = express.Router();

/**
 * @swagger
 * /api/favorites/add:
 *   post:
 *     summary: Adds a movie or series to the user's favorites list
 *     tags: [Favorites]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - movieApiId
 *               - type
 *             properties:
 *               movieApiId:
 *                 type: string
 *                 description: The API ID of the movie or series to add to favorites
 *               type:
 *                 $ref: '#/components/schemas/ContentType'
 *                 description: Specify 'movie' or 'tv' to filter by type
 *     responses:
 *       200:
 *         description: Successfully added to favorites
 *       400:
 *         description: Bad request
 *       404:
 *         description: Movie not found
 */
router.post('/add', addFavorite);

/**
 * @swagger
 * /api/favorites/remove:
 *   post:
 *     summary: Removes a movie or series from the user's favorites list
 *     tags: [Favorites]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - movieApiId
 *             properties:
 *               movieApiId:
 *                 type: string
 *                 description: The API ID of the movie or series to remove from favorites
 *     responses:
 *       200:
 *         description: Successfully removed from favorites
 *       400:
 *         description: Bad request
 */

router.post('/remove', removeFavorite);

/**
 * @swagger
 * /api/favorites/list:
 *   get:
 *     summary: Lists all movies and series in the user's favorites list
 *     tags: [Favorites]
 *     responses:
 *       200:
 *         description: Successfully retrieved the favorites list
 *       400:
 *         description: Bad request
 */

router.get('/list', listFavorites);

export default router;
