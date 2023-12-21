const axios = require("axios").default;
import { TMDB_BASE_URL, TMDB_API_KEY, TMDB_IMAGE_BASE_URL, ENDPOINTS, YOUTUBE_BASE_URL } from "../constants/Urls";

const TMDB_HTTP_REQUEST = axios.create({
  baseURL: TMDB_BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
  },
});

const getMovies = (genreId) => {
  const params = {};
  if (genreId) {
    params["with_genres"] = genreId;
  }
  params["language"] = "id-ID";
  //jika genre id != null
  return TMDB_HTTP_REQUEST.get(ENDPOINTS.MOVIES, { params: params });
};

const getUpcomingMovies = () => TMDB_HTTP_REQUEST.get(ENDPOINTS.UPCOMING_MOVIES);

const getNowplayingMovies = () => TMDB_HTTP_REQUEST.get(ENDPOINTS.NOWPLAYING_MOVIES);

const getMovieById = (movieId, append_to_response = "") => TMDB_HTTP_REQUEST.get(`${ENDPOINTS.MOVIE}/${movieId}`, append_to_response ? { params: { append_to_response, language: "en-EN" } } : null);

const getAllGenres = () => TMDB_HTTP_REQUEST.get(ENDPOINTS.GENRES);

const getPoster = (path) => `${TMDB_IMAGE_BASE_URL}/original${path}`;

const getVideo = (videoKey) => {
  return `${YOUTUBE_BASE_URL}?v=${videoKey}`;
};
export { getMovies, getNowplayingMovies, getUpcomingMovies, getAllGenres, getMovieById, getPoster, getVideo };
