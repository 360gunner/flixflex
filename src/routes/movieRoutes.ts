import express from 'express';
import {
    getMovieDetails,
    getMovieTrailer,
    listMoviesWithPagination,
    listTopMoviesOrSeries,
    searchContent
} from '../controllers/movieController';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     ContentType:
 *       type: string
 *       enum:
 *         - movie
 *         - tv
 *       description: Content type can be either 'movie' or 'tv'
 * 
 * /api/movies/details/{id}:
 *   get:
 *     summary: Get details of a specific movie or series by its ID
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The movie or series ID
 *       - in: query
 *         name: type
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/ContentType'
 *         description: Specify 'movie' or 'tv' to filter by type
 *     responses:
 *       200:
 *         description: Details of the movie or series
 *       400:
 *         description: Invalid or missing 'type' query parameter
 *       404:
 *         description: Movie or series not found
 */
router.get('/details/:id', getMovieDetails);

/**
 * @swagger
 * /api/movies/trailer/{id}:
 *   get:
 *     summary: Get the trailer of a specific movie or series by its ID
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The movie or series ID
 *       - in: query
 *         name: type
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/ContentType'
 *         description: Specify 'movie' or 'tv' to filter by type
 *     responses:
 *       200:
 *         description: Trailer of the movie or series
 *       400:
 *         description: Invalid or missing 'type' query parameter
 *       404:
 *         description: Trailer not found
 */
router.get('/trailer/:id', getMovieTrailer);

/**
 * @swagger
 * /api/movies/list:
 *   get:
 *     summary: List movies and series with pagination
 *     tags: [Movies]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         required: false
 *         description: Page number for pagination
 *       - in: query
 *         name: type
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/ContentType'
 *         description: Specify 'movie' or 'tv' to filter by type, leave empty to list both types
 *     responses:
 *       200:
 *         description: A paginated list of movies and series
 */
router.get('/list', listMoviesWithPagination);

/**
 * @swagger
 * /api/movies/top:
 *   get:
 *     summary: Get the top 5 movies or series
 *     tags: [Movies]
 *     parameters:
 *       - in: query
 *         name: type
 *         required: false
 *         schema:
 *           $ref: '#/components/schemas/ContentType'
 *         description: True for movies, false for TV shows, leave empty to list top items regardless of type
 *     responses:
 *       200:
 *         description: Top 5 movies or series
 */
router.get('/top', listTopMoviesOrSeries);

/**
 * @swagger
 * /api/movies/search:
 *   get:
 *     summary: Search for movies and series by title
 *     tags: [Movies]
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         description: The search query for the movie or series title
 *       - in: query
 *         name: type
 *         required: false
 *         schema:
 *           $ref: '#/components/schemas/ContentType'
 *         description: Specify 'movie' or 'tv' to filter by type, leave empty to search all types
 *     responses:
 *       200:
 *         description: Search results matching the query
 */
router.get('/search', searchContent);

export default router;
