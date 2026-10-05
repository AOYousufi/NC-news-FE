import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { fetchTopics } from "../../../api/api";

function Topics({ setError }) {
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    fetchTopics().then(setTopics).catch(setError);
  }, [setError]);

  const className = ({ isActive }) =>
    "whitespace-nowrap rounded-full px-3.5 py-2 text-sm font-bold transition " +
    (isActive
      ? "bg-indigo-600 text-white"
      : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-950");

  return (
    <nav
      aria-label="Article topics"
      className="flex gap-2 overflow-x-auto pb-1"
    >
      <NavLink to="/articles" end className={className}>
        All
      </NavLink>
      {topics.map((topic) => (
        <NavLink
          to={"/articles/topics/" + topic.slug}
          key={topic.slug}
          className={className}
        >
          {topic.slug}
        </NavLink>
      ))}
    </nav>
  );
}

export default Topics;
