import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://nc-news-vvdv.onrender.com/api";
const TOKEN_KEY = "ncNewsToken";
const AUTH_EXPIRED_EVENT = "nc-news-auth-expired";

const getStoredToken = () =>
  localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);

const clearStoredToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
};

const api = axios.create({ baseURL: API_BASE_URL });

api.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) config.headers.Authorization = "Bearer " + token;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status || 500;
    const serverMessage =
      error.response?.data?.msg || error.response?.data?.message;
    const requestUrl = error.config?.url || "";

    if (
      status === 401 &&
      getStoredToken() &&
      !requestUrl.includes("/users/login")
    ) {
      clearStoredToken();
      window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT));
    }

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
  search,
  limit,
  p,
} = {}) =>
  api
    .get("/articles", {
      params: { sort_by, order, topic, author, search, limit, p },
    })
    .then((response) => response.data.articles);

const fetchArticle = (articleId) =>
  api.get("/articles/" + articleId).then((response) => response.data.article[0]);

const fetchManagedArticle = (articleId) =>
  api
    .get("/articles/" + articleId + "/manage")
    .then((response) => response.data.article);

const fetchArticleRevisions = (articleId) =>
  api
    .get("/articles/" + articleId + "/revisions")
    .then((response) => response.data.revisions);

const createArticle = (article) =>
  api.post("/articles", article).then((response) => response.data.article);

const updateArticleContent = (articleId, updates) =>
  api
    .patch("/articles/" + articleId, updates)
    .then((response) => response.data.article);

const deleteArticle = (articleId) =>
  api.delete("/articles/" + articleId).then(() => true);

const fetchDrafts = () =>
  api.get("/articles/drafts").then((response) => response.data.articles);

const fetchFollowingFeed = ({ limit = 20, p = 1 } = {}) =>
  api
    .get("/articles/feed", { params: { limit, p } })
    .then((response) => response.data.articles);

const saveArticle = (articleId) =>
  api.post("/articles/" + articleId + "/save").then(() => true);

const unsaveArticle = (articleId) =>
  api.delete("/articles/" + articleId + "/save").then(() => true);

const fetchTopics = () =>
  api.get("/topics").then((response) => response.data.topics);

const createTopic = (topic) =>
  api.post("/topics", topic).then((response) => response.data.topic);

const fetchUsers = () =>
  api.get("/users").then((response) => response.data.users);

const fetchUser = (username) =>
  api.get("/users/" + username).then((response) => response.data);

const fetchUserStats = (username) =>
  api
    .get("/users/" + username + "/stats")
    .then((response) => response.data.stats);

const fetchUserComments = (username) =>
  api
    .get("/users/" + username + "/comments")
    .then((response) => response.data.comments);

const fetchActivity = () =>
  api.get("/users/me/activity").then((response) => response.data);

const fetchSavedArticles = () =>
  api.get("/users/me/saved").then((response) => response.data.articles);

const fetchFollowing = () =>
  api.get("/users/me/following").then((response) => response.data.users);

const fetchFollowStatus = (username) =>
  api
    .get("/users/" + username + "/follow-status")
    .then((response) => response.data);

const followUser = (username) =>
  api.post("/users/" + username + "/follow").then(() => true);

const unfollowUser = (username) =>
  api.delete("/users/" + username + "/follow").then(() => true);

const updateVotes = (articleId, voteInfo) =>
  api
    .patch("/articles/" + articleId, voteInfo)
    .then((response) => response.data.article);

const fetchArticleVote = (articleId) =>
  api
    .get("/articles/" + articleId + "/vote")
    .then((response) => response.data);

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

const editComment = (commentId, body) =>
  api
    .patch("/comments/" + commentId, { body })
    .then((response) => response.data.comment);

const fetchCommentVotes = (articleId) =>
  api
    .get("/articles/" + articleId + "/comment-votes")
    .then((response) => response.data.votes);

const updateCommentVote = (commentId, voteInfo) =>
  api
    .patch("/comments/" + commentId + "/vote", voteInfo)
    .then((response) => response.data.comment);

const loginUser = (credentials) =>
  api.post("/users/login", credentials).then((response) => response.data);

const registerUser = (user) =>
  api.post("/users/register", user).then((response) => response.data);

const fetchCurrentUser = () =>
  api.get("/users/me").then((response) => response.data.user);

const updateCurrentUser = (updates) =>
  api.patch("/users/me", updates).then((response) => response.data.user);

const fetchNotifications = ({ unread = false } = {}) =>
  api
    .get("/users/me/notifications", { params: { unread } })
    .then((response) => response.data);

const fetchNotificationCount = () =>
  api
    .get("/users/me/notifications/count")
    .then((response) => response.data.unread_count);

const markNotificationRead = (notificationId) =>
  api
    .patch("/users/me/notifications/" + notificationId + "/read")
    .then((response) => response.data.notification);

const markAllNotificationsRead = () =>
  api.patch("/users/me/notifications/read-all").then(() => true);

export {
  AUTH_EXPIRED_EVENT,
  TOKEN_KEY,
  addComment,
  clearStoredToken,
  createArticle,
  createTopic,
  deleteArticle,
  deleteComment,
  editComment,
  fetchActivity,
  fetchArticle,
  fetchArticleVote,
  fetchArticleRevisions,
  fetchArticles,
  fetchComments,
  fetchCommentVotes,
  fetchCurrentUser,
  fetchDrafts,
  fetchFollowStatus,
  fetchFollowing,
  fetchFollowingFeed,
  fetchManagedArticle,
  fetchNotificationCount,
  fetchNotifications,
  fetchSavedArticles,
  fetchTopics,
  fetchUser,
  fetchUserComments,
  fetchUserStats,
  fetchUsers,
  followUser,
  getStoredToken,
  loginUser,
  markAllNotificationsRead,
  markNotificationRead,
  registerUser,
  saveArticle,
  unfollowUser,
  unsaveArticle,
  updateArticleContent,
  updateCommentVote,
  updateCurrentUser,
  updateVotes,
};
