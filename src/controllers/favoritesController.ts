import { Request, Response } from 'express';
import User from '../models/User';
import Movie from '../models/Movie';
import { fetchMovieDetails } from '../services/movieService';
import { ContentType } from '../types/types';

export const addFavorite = async (req: Request, res: Response) => {
  const userId = req.userData.id;
  const { movieApiId, type } = req.body;

  if (!type || !Object.values(ContentType).includes(type)) {
    return res.status(400).json({ message: "Invalid 'type' query parameter. Must be 'movie' or 'tv'." });
  }

  try {
    let movie = await Movie.findOne({ apiId: movieApiId });

    if (!movie) {
      await fetchMovieDetails(movieApiId, type, true);
      movie = await Movie.findOne({ apiId: movieApiId });
    }

    if (!movie) {
      return res.status(404).json({ message: 'Movie not found after attempting to fetch and cache.' });
    }

    await User.findByIdAndUpdate(userId, { $addToSet: { favorites: movie._id } });
    res.status(200).json({ message: 'Favorite added successfully.' });
  } catch (error) {
    console.error('Error adding favorite:', error);
    res.status(500).json({ message: 'Error adding favorite.' });
  }
};


export const removeFavorite = async (req: Request, res: Response) => {
  const userId = req.userData.id;
  const { movieApiId } = req.body;
  try {
    const movie = await Movie.findOne({ apiId: movieApiId });
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    await User.findByIdAndUpdate(userId, { $pull: { favorites: movie._id } });
    res.status(200).json({ message: 'Favorite removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error removing favorite' });
  }
};

export const listFavorites = async (req: Request, res: Response) => {
  const userId = req.userData.id;
  try {
    const user = await User.findById(userId).populate({
      path: 'favorites',
      select: '-_id'
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user.favorites);
  } catch (error) {
    res.status(500).json({ message: 'Error listing favorites' });
  }
};
