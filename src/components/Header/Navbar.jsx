import { useContext, useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../../../Context/userContext";
import { fetchNotificationCount } from "../../api/api";
import Avatar from "../UI/Avatar";

function NavBar() {
  const { loggedUser, isAuthLoading, logout } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

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
    setIsMenuOpen(false);
    navigate("/");
  };

  const linkClass = ({ isActive }) =>
    "rounded-lg px-3 py-2 text-sm font-semibold transition " +
    (isActive
      ? "bg-slate-900 text-white"
      : "text-slate-600 hover:bg-slate-100 hover:text-slate-950");

  const mobileLinkClass = ({ isActive }) =>
    "block rounded-xl px-4 py-3 text-sm font-bold transition " +
    (isActive
      ? "bg-slate-900 text-white"
      : "text-slate-700 hover:bg-slate-100");

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <nav
        className="mx-auto max-w-6xl px-4 py-3 sm:px-6"
        aria-label="Primary navigation"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <NavLink
              to="/"
              className="shrink-0 text-lg font-black tracking-tight text-slate-950"
            >
              NC<span className="text-indigo-600">News</span>
            </NavLink>

            <div className="hidden items-center gap-1 md:flex">
              <NavLink to="/articles" className={linkClass}>
                Articles
              </NavLink>
              <NavLink to="/trending" className={linkClass}>
                Trending
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
                  <NavLink to="/collections" className={linkClass}>
                    Collections
                  </NavLink>
                  {loggedUser.role === "moderator" && (
                    <NavLink to="/moderation" className={linkClass}>
                      Moderate
                    </NavLink>
                  )}
                  <NavLink
                    to="/articles/new"
                    className="rounded-lg bg-indigo-50 px-3 py-2 text-sm font-black text-indigo-700 transition hover:bg-indigo-100"
                  >
                    + Write
                  </NavLink>
                </>
              )}
            </div>
          </div>

          {!isAuthLoading && (
            <div className="flex shrink-0 items-center gap-2">
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
                    className="hidden items-center gap-2 rounded-xl px-2 py-1.5 text-sm font-bold text-slate-700 transition hover:bg-slate-100 sm:flex"
                  >
                    <Avatar user={loggedUser} size="sm" />
                    <span className="hidden lg:inline">{loggedUser.username}</span>
                  </NavLink>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="hidden rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 md:inline-flex"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <div className="hidden items-center gap-2 sm:flex">
                  <NavLink to="/login" className={linkClass}>
                    Log in
                  </NavLink>
                  <NavLink
                    to="/signup"
                    className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
                  >
                    Sign up
                  </NavLink>
                </div>
              )}

              <button
                type="button"
                aria-expanded={isMenuOpen}
                aria-controls="mobile-navigation"
                aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                onClick={() => setIsMenuOpen((current) => !current)}
                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-slate-300 bg-white text-xl font-black text-slate-700 transition hover:bg-slate-50 md:hidden"
              >
                <span aria-hidden="true">{isMenuOpen ? "×" : "☰"}</span>
              </button>
            </div>
          )}
        </div>

        {!isAuthLoading && isMenuOpen && (
          <div
            id="mobile-navigation"
            className="mt-3 border-t border-slate-200 pt-3 md:hidden"
          >
            <div className="grid gap-1">
              <NavLink to="/articles" className={mobileLinkClass}>
                Articles
              </NavLink>
              <NavLink to="/trending" className={mobileLinkClass}>
                Trending
              </NavLink>
              <NavLink to="/users" className={mobileLinkClass}>
                Community
              </NavLink>

              {loggedUser ? (
                <>
                  <NavLink to="/following" className={mobileLinkClass}>
                    Following
                  </NavLink>
                  <NavLink to="/dashboard" className={mobileLinkClass}>
                    Dashboard
                  </NavLink>
                  <NavLink to="/collections" className={mobileLinkClass}>
                    Collections
                  </NavLink>
                  <NavLink to="/articles/new" className={mobileLinkClass}>
                    Write article
                  </NavLink>
                  <NavLink to="/userProfile" className={mobileLinkClass}>
                    Profile
                  </NavLink>
                  <NavLink to="/settings" className={mobileLinkClass}>
                    Account settings
                  </NavLink>
                  {loggedUser.role === "moderator" && (
                    <NavLink to="/moderation" className={mobileLinkClass}>
                      Moderation
                    </NavLink>
                  )}
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="mt-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-left text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <NavLink to="/login" className={mobileLinkClass}>
                    Log in
                  </NavLink>
                  <NavLink
                    to="/signup"
                    className="mt-1 block rounded-xl bg-indigo-600 px-4 py-3 text-sm font-black text-white transition hover:bg-indigo-700"
                  >
                    Sign up
                  </NavLink>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

export default NavBar;
