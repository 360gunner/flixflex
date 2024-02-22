import { Request, Response } from 'express';
import * as movieService from '../services/movieService';
import { ContentType } from '../types/types';

export const getMovieDetails = async (req: Request, res: Response) => {
  const { id } = req.params;
  const type = req.query.type as ContentType | undefined;

  if (!type || !Object.values(ContentType).includes(type)) {
    return res.status(400).json({ message: "Invalid 'type' query parameter. Must be 'movie' or 'tv'." });
  }

  try {
    const movieDetails = await movieService.fetchMovieDetails(id, type);
    res.json(movieDetails);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching movie details' });
  }
};

export const getMovieTrailer = async (req: Request, res: Response) => {
  const { id } = req.params;
  const type = req.query.type as ContentType;

  if (!type || !Object.values(ContentType).includes(type)) {
    return res.status(400).json({ message: "Invalid 'type' query parameter. Must be 'movie' or 'tv'." });
  }

  try {
    const trailer = await movieService.fetchMovieTrailer(id, type);
    res.json(trailer);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching movie trailer' });
  }
};

export const listMoviesWithPagination = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string, 10) || 1;
  const type = req.query.type as ContentType;
  if (!type || !Object.values(ContentType).includes(type)) {
    return res.status(400).json({ message: "Invalid 'type' query parameter. Must be 'movie' or 'tv'." });
  }
  try {
    const movies = await movieService.fetchMoviesWithPagination(page, type);
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching movies/series list' });
  }
};

export const listTopMoviesOrSeries = async (req: Request, res: Response) => {
  const type = req.query.type as ContentType | undefined;
  try {
    const topMoviesOrSeries = await movieService.fetchTopMoviesOrSeries(type);
    res.json(topMoviesOrSeries);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching top movies/series' });
  }
};

export const searchContent = async (req: Request, res: Response) => {
  const { query } = req.query;
  const type = req.query.type as ContentType | undefined;
  if (!query || typeof query !== 'string') {
    return res.status(400).json({ message: 'Search query is required and must be a string.' });
  }
  try {
    const results = await movieService.generalSearch(query, type);
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Error performing search' });
  }
};
