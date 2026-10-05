import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://nc-news-vvdv.onrender.com/api";
const TOKEN_KEY = "ncNewsToken";

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);

  if (token) {
    config.headers.Authorization = "Bearer " + token;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status || 500;
    const serverMessage =
      error.response?.data?.msg || error.response?.data?.message;

    const fallbackMessages = {
      400: "Please check the information you entered and try again.",
      401: "Please sign in to continue.",
      403: "You do not have permission to do that.",
      404: "We could not find what you were looking for.",
      409: "That account or resource already exists.",
      500: "Something went wrong on the server. Please try again.",
    };

    return Promise.reject({
      status,
      message:
        serverMessage ||
        fallbackMessages[status] ||
        error.message ||
        "Something went wrong. Please try again.",
    });
  }
);

const fetchArticles = ({
  sort_by = "created_at",
  order = "desc",
  topic,
  author,
  limit,
  p,
} = {}) =>
  api
    .get("/articles", {
      params: { sort_by, order, topic, author, limit, p },
    })
    .then((response) => response.data.articles);

const fetchArticle = (articleId) =>
  api
    .get("/articles/" + articleId)
    .then((response) => response.data.article[0]);

const fetchTopics = () =>
  api.get("/topics").then((response) => response.data.topics);

const updateVotes = (articleId, voteInfo) =>
  api
    .patch("/articles/" + articleId, voteInfo)
    .then((response) => response.data.article);

const fetchComments = (articleId) =>
  api
    .get("/articles/" + articleId + "/comments")
    .then((response) => response.data.comments);

const addComment = (articleId, comment) =>
  api
    .post("/articles/" + articleId + "/comments", comment)
    .then((response) => response.data.Comment);

const deleteComment = (commentId) =>
  api.delete("/comments/" + commentId).then(() => true);

const loginUser = (credentials) =>
  api.post("/users/login", credentials).then((response) => response.data);

const registerUser = (user) =>
  api.post("/users/register", user).then((response) => response.data);

const fetchCurrentUser = () =>
  api.get("/users/me").then((response) => response.data.user);

const updateCurrentUser = (updates) =>
  api.patch("/users/me", updates).then((response) => response.data.user);

export {
  addComment,
  deleteComment,
  fetchArticle,
  fetchArticles,
  fetchComments,
  fetchCurrentUser,
  fetchTopics,
  loginUser,
  registerUser,
  updateCurrentUser,
  updateVotes,
};
