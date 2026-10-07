import { useContext, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { UserContext } from "../../../Context/userContext";
import { fetchNotificationCount } from "../../api/api";
import Avatar from "../UI/Avatar";

function NavBar() {
  const { loggedUser, isAuthLoading, logout } = useContext(UserContext);
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!loggedUser) {
      setUnreadCount(0);
      return;
    }

    let active = true;

    const refreshCount = () => {
      fetchNotificationCount()
        .then((count) => {
          if (active) setUnreadCount(count);
        })
        .catch(() => {
          if (active) setUnreadCount(0);
        });
    };

    refreshCount();
    const interval = window.setInterval(refreshCount, 60000);

    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, [loggedUser]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const linkClass = ({ isActive }) =>
    "rounded-lg px-3 py-2 text-sm font-semibold transition " +
    (isActive
      ? "bg-slate-900 text-white"
      : "text-slate-600 hover:bg-slate-100 hover:text-slate-950");

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <div className="flex flex-wrap items-center gap-1 sm:gap-2">
          <NavLink
            to="/"
            className="mr-2 text-lg font-black tracking-tight text-slate-950"
          >
            NC<span className="text-indigo-600">News</span>
          </NavLink>

          <NavLink to="/articles" className={linkClass}>
            Articles
          </NavLink>
          <NavLink to="/users" className={linkClass}>
            Community
          </NavLink>

          {loggedUser && (
            <>
              <NavLink to="/following" className={linkClass}>
                Following
              </NavLink>
              <NavLink to="/dashboard" className={linkClass}>
                Dashboard
              </NavLink>
              {loggedUser.role === "moderator" && (
                <NavLink to="/moderation" className={linkClass}>
                  Moderate
                </NavLink>
              )}
              <NavLink
                to="/articles/new"
                className="hidden rounded-lg bg-indigo-50 px-3 py-2 text-sm font-black text-indigo-700 transition hover:bg-indigo-100 md:inline-flex"
              >
                + Write
              </NavLink>
            </>
          )}
        </div>

        {!isAuthLoading && (
          <div className="flex items-center gap-2">
            {loggedUser ? (
              <>
                <NavLink
                  to="/notifications"
                  aria-label={
                    unreadCount
                      ? unreadCount + " unread notifications"
                      : "Notifications"
                  }
                  className="relative rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-black text-slate-700 transition hover:bg-slate-50"
                >
                  <span aria-hidden="true">🔔</span>
                  {unreadCount > 0 && (
                    <span className="absolute -right-1.5 -top-1.5 min-w-5 rounded-full bg-indigo-600 px-1.5 py-0.5 text-center text-[10px] font-black leading-4 text-white">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </NavLink>

                <NavLink
                  to="/userProfile"
                  className="flex items-center gap-2 rounded-xl px-2 py-1.5 text-sm font-bold text-slate-700 transition hover:bg-slate-100"
                >
                  <Avatar user={loggedUser} size="sm" />
                  <span className="hidden sm:inline">{loggedUser.username}</span>
                </NavLink>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={linkClass}>
                  Log in
                </NavLink>
                <NavLink
                  to="/signup"
                  className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
                >
                  Sign up
                </NavLink>
              </>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}

export default NavBar;
