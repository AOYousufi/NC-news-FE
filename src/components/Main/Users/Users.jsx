import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { fetchUsers } from "../../../api/api";
import Avatar from "../../UI/Avatar";
import Error from "../../UI/error";
import Loading from "../../UI/Loading";

function Users() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUsers()
      .then((data) =>
        setUsers(
          [...data].sort((a, b) => a.username.localeCompare(b.username))
        )
      )
      .catch(setError)
      .finally(() => setIsLoading(false));
  }, []);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return users;

    return users.filter(
      (user) =>
        user.username.toLowerCase().includes(query) ||
        user.name.toLowerCase().includes(query)
    );
  }, [search, users]);

  if (error) return <Error error={error} />;

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="grid gap-8 border-b border-slate-200 pb-8 lg:grid-cols-[1fr_360px] lg:items-end">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-indigo-600">
            Community
          </p>
          <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">
            Meet the people behind the discussion
          </h1>
          <p className="mt-3 max-w-2xl text-slate-500">
            Browse public profiles and jump straight into the articles written
            by each member.
          </p>
        </div>

        <label className="block">
          <span className="sr-only">Search users</span>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name or username"
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
          />
        </label>
      </div>

      {isLoading ? (
        <Loading />
      ) : filteredUsers.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
          No community members match that search.
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredUsers.map((user) => (
            <Link
              key={user.username}
              to={"/users/" + user.username}
              className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-lg"
            >
              <div className="flex items-center gap-4">
                <Avatar user={user} />
                <div className="min-w-0">
                  <h2 className="truncate font-black text-slate-950 group-hover:text-indigo-700">
                    {user.name}
                  </h2>
                  <p className="truncate text-sm font-medium text-slate-500">
                    @{user.username}
                  </p>
                </div>
              </div>
              <p className="mt-5 text-sm font-bold text-indigo-600">
                View profile →
              </p>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

export default Users;
