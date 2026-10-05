import { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { UserContext } from "../../../Context/userContext";

function NavBar() {
  const { loggedUser, isAuthLoading, logout } = useContext(UserContext);
  const navigate = useNavigate();

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
        <div className="flex items-center gap-2 sm:gap-4">
          <NavLink
            to="/"
            className="text-lg font-black tracking-tight text-slate-950"
          >
            NC<span className="text-indigo-600">News</span>
          </NavLink>
          <NavLink to="/articles" className={linkClass}>
            Articles
          </NavLink>
        </div>

        {!isAuthLoading && (
          <div className="flex items-center gap-2">
            {loggedUser ? (
              <>
                <NavLink to="/userProfile" className={linkClass}>
                  {loggedUser.username}
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
