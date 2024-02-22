import axios from 'axios';
import dotenv from 'dotenv';
import Movie from '../models/Movie';
import { ContentType } from '../types/types'; 

dotenv.config();

const API_URL = 'https://api.themoviedb.org/3';
const API_TOKEN = process.env.TMDB_API_TOKEN;

const tmdbApi = axios.create({
  baseURL: API_URL,
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_TOKEN}`
  }
});

export const fetchMovieDetails = async (movieApiId: string, type: ContentType, awaitCaching: boolean = false) => {
  const response = await tmdbApi.get(`/${type}/${movieApiId}`);
  const details = response.data;

  const cachingOperation = cacheMovies([details], type === ContentType.Movie);

  if (awaitCaching) {
    await cachingOperation.catch(console.error);
  } else {
    cachingOperation.catch(console.error);
  }

  return details;
};

export const fetchMovieTrailer = async (movieApiId: string, type: ContentType) => {
  let movie = await Movie.findOne({ apiId: movieApiId });
  if (movie && movie.trailer) {
    return { url: movie.trailer };
  }

  const response = await tmdbApi.get(`/${type}/${movieApiId}/videos`);
  const trailer = response.data.results.find((video: any) => video.site === 'YouTube' && video.type === 'Trailer');
  let trailerUrl = trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null;

  if (!trailerUrl) {
    if (movie && movie.details && movie.details.imdb_id) {
      trailerUrl = `https://www.imdb.com/title/${movie.details.imdb_id}`;
    } else {
      const details = await fetchMovieDetails(movieApiId, type, true);
      if (details.imdb_id) {
        trailerUrl = `https://www.imdb.com/title/${details.imdb_id}`;
        movie = await Movie.findOneAndUpdate(
          { apiId: movieApiId },
          { $set: { trailer: trailerUrl, details: details } },
          { new: true, upsert: true }
        );
      }
    }
  } else {
    movie = await Movie.findOneAndUpdate(
      { apiId: movieApiId },
      { $set: { trailer: trailerUrl } },
      { new: true, upsert: true }
    );
  }

  return { url: trailerUrl };
};


const cacheMovies = async (movies: any[], isMovie: boolean) => {
  const operations = movies.map(movie => ({
    updateOne: {
      filter: { apiId: movie.id }, 
      update: { $set: { title: movie.title, isMovie, details: movie } }, 
      upsert: true 
    }
  }));

  try {
    await Movie.bulkWrite(operations);
  } catch (error) {
    console.error('Error caching movies:', error);
  }
};

export const fetchMoviesWithPagination = async (page: number = 1, type: ContentType) => {
  const ITEMS_PER_PAGE = 10;
  const response = await tmdbApi.get(`/${type}/popular?language=en-US&page=${Math.ceil(page / 2)}`);
  cacheMovies(response.data.results, type === ContentType.Movie).catch(console.error);
  const startIndex = (page % 2 === 1) ? 0 : ITEMS_PER_PAGE;
  const results = response.data.results.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  return {
    page: page,
    results: results,
    total_results: response.data.total_results,
    total_pages: Math.ceil(response.data.total_pages * 2)
  };
};

export const fetchTopMoviesOrSeries = async (type?: ContentType) => {
  if (type) {
    const response = await tmdbApi.get(`/${type}/top_rated?page=1`);
    cacheMovies(response.data.results, type === ContentType.Movie).catch(console.error);
    return response.data.results.slice(0, 5);
  } else {
    const movieResponse = await tmdbApi.get(`/movie/top_rated?page=1`);
    const seriesResponse = await tmdbApi.get(`/tv/top_rated?page=1`);
    Promise.allSettled([
      cacheMovies(movieResponse.data.results, true),
      cacheMovies(seriesResponse.data.results, false)
    ]);
    return {
      movies: movieResponse.data.results.slice(0, 5),
      series: seriesResponse.data.results.slice(0, 5),
    };
  }
};

export const generalSearch = async (query: string, type?: ContentType) => {
  if (type) {
    const response = await tmdbApi.get(`/search/${type}?query=${encodeURIComponent(query)}`);
    cacheMovies(response.data.results, type === ContentType.Movie).catch(console.error);
    return response.data.results;
  } else {
    const movieResponse = await tmdbApi.get(`/search/movie?query=${encodeURIComponent(query)}`);
    const seriesResponse = await tmdbApi.get(`/search/tv?query=${encodeURIComponent(query)}`);
    Promise.allSettled([
      cacheMovies(movieResponse.data.results, true),
      cacheMovies(seriesResponse.data.results, false)
    ]);
    return {
      movies: movieResponse.data.results,
      series: seriesResponse.data.results,
    };
  }
};
