import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../../Context/userContext";
import {
  fetchNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "../../api/api";
import Avatar from "../UI/Avatar";
import Loading from "../UI/Loading";

function Notifications() {
  const { loggedUser, isAuthLoading } = useContext(UserContext);
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthLoading && !loggedUser) {
      navigate("/login", { replace: true });
    }
  }, [isAuthLoading, loggedUser, navigate]);

  useEffect(() => {
    if (!loggedUser) return;

    fetchNotifications()
      .then((data) => {
        setNotifications(data.notifications);
        setUnreadCount(data.unread_count);
      })
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [loggedUser]);

  if (isAuthLoading || isLoading) return <Loading />;
  if (!loggedUser) return null;

  const labelFor = (notification) => {
    if (notification.type === "follow") return "followed you";
    if (notification.type === "reply") return "replied to your comment";
    if (notification.type === "article_comment") return "commented on your article";
    if (notification.type === "article_agree") return "agreed with your article";
    if (notification.type === "article_disagree") return "disagreed with your article";
    return "interacted with your account";
  };

  const linkFor = (notification) =>
    notification.article_id
      ? "/articles/" + notification.article_id
      : "/users/" + notification.actor_username;

  const markOne = async (notification) => {
    if (notification.read_at) return;

    try {
      await markNotificationRead(notification.notification_id);
      setNotifications((current) =>
        current.map((item) =>
          item.notification_id === notification.notification_id
            ? { ...item, read_at: new Date().toISOString() }
            : item
        )
      );
      setUnreadCount((current) => Math.max(current - 1, 0));
    } catch (err) {
      setError(err.message);
    }
  };

  const markAll = async () => {
    try {
      await markAllNotificationsRead();
      setNotifications((current) =>
        current.map((item) => ({
          ...item,
          read_at: item.read_at || new Date().toISOString(),
        }))
      );
      setUnreadCount(0);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-7 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-indigo-600">
            Inbox
          </p>
          <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">
            Notifications
          </h1>
          <p className="mt-2 text-slate-500">
            {unreadCount} unread {unreadCount === 1 ? "notification" : "notifications"}.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={markAll}
            className="w-fit rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-black text-slate-700 transition hover:bg-slate-50"
          >
            Mark all as read
          </button>
        )}
      </div>

      {error && (
        <p role="alert" className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-800">
          {error}
        </p>
      )}

      <div className="mt-6 space-y-3">
        {notifications.length ? (
          notifications.map((notification) => (
            <Link
              key={notification.notification_id}
              to={linkFor(notification)}
              onClick={() => markOne(notification)}
              className={
                "flex gap-4 rounded-2xl border p-5 transition hover:border-indigo-200 hover:shadow-sm " +
                (notification.read_at
                  ? "border-slate-200 bg-white"
                  : "border-indigo-200 bg-indigo-50/60")
              }
            >
              <Avatar
                user={{
                  username: notification.actor_username,
                  name: notification.actor_name,
                  avatar_url: notification.actor_avatar_url,
                }}
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm leading-6 text-slate-700">
                  <span className="font-black text-slate-950">
                    {notification.actor_name}
                  </span>{" "}
                  {labelFor(notification)}
                </p>
                {notification.article_title && (
                  <p className="mt-1 truncate text-sm font-bold text-indigo-700">
                    {notification.article_title}
                  </p>
                )}
                <p className="mt-2 text-xs text-slate-400">
                  {new Date(notification.created_at).toLocaleString()}
                </p>
              </div>
              {!notification.read_at && (
                <span
                  aria-label="Unread"
                  className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-indigo-600"
                />
              )}
            </Link>
          ))
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
            Nothing new yet.
          </div>
        )}
      </div>
    </section>
  );
}

export default Notifications;
