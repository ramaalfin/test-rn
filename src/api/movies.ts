import apiClient from './client';
import type {
  Movie,
  PaginatedResponse,
  MovieDetail,
  Credits,
  ReviewsResponse,
} from '../types/api.types';

// Get popular movies with pagination
export const getPopularMovies = async (
  page: number = 1,
): Promise<PaginatedResponse<Movie>> => {
  const response = await apiClient.get<PaginatedResponse<Movie>>(
    '/movie/popular',
    {
      params: { page },
    },
  );
  return response.data;
};

// Get movie detail
export const getMovieDetail = async (
  movieId: number,
): Promise<MovieDetail> => {
  const response = await apiClient.get<MovieDetail>(`/movie/${movieId}`);
  return response.data;
};

// Get movie credits (cast & crew)
export const getMovieCredits = async (movieId: number): Promise<Credits> => {
  const response = await apiClient.get<Credits>(`/movie/${movieId}/credits`);
  return response.data;
};

// Get movie reviews
export const getMovieReviews = async (
  movieId: number,
): Promise<ReviewsResponse> => {
  const response = await apiClient.get<ReviewsResponse>(
    `/movie/${movieId}/reviews`,
  );
  return response.data;
};

// Search movies
export const searchMovies = async (
  query: string,
  page: number = 1,
): Promise<PaginatedResponse<Movie>> => {
  const response = await apiClient.get<PaginatedResponse<Movie>>(
    '/search/movie',
    {
      params: { query, page },
    },
  );
  return response.data;
};
