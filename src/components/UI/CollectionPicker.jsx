import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  addArticleToCollection,
  fetchCollections,
} from "../../api/api";

function CollectionPicker({ articleId }) {
  const [collections, setCollections] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [addingId, setAddingId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen || collections.length) return;

    setIsLoading(true);
    fetchCollections()
      .then(setCollections)
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [collections.length, isOpen]);

  const add = async (collection) => {
    setAddingId(collection.collection_id);
    setMessage("");
    setError("");

    try {
      await addArticleToCollection(collection.collection_id, articleId);
      setMessage("Added to " + collection.name + ".");
    } catch (err) {
      setError(err.message);
    } finally {
      setAddingId(null);
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => {
          setIsOpen((current) => !current);
          setMessage("");
          setError("");
        }}
        className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-black text-slate-700 transition hover:border-indigo-300 hover:text-indigo-700"
      >
        + Add to collection
      </button>

      {isOpen && (
        <div className="absolute right-0 z-30 mt-2 w-72 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl">
          <p className="font-black text-slate-950">Choose a collection</p>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            Adding the same story twice is safe—it will only appear once.
          </p>

          {isLoading ? (
            <p className="mt-4 text-sm text-slate-500">Loading lists...</p>
          ) : collections.length ? (
            <div className="mt-4 space-y-2">
              {collections.map((collection) => (
                <button
                  key={collection.collection_id}
                  type="button"
                  onClick={() => add(collection)}
                  disabled={addingId === collection.collection_id}
                  className="flex w-full items-center justify-between rounded-xl border border-slate-200 px-3 py-2.5 text-left text-sm transition hover:border-indigo-300 hover:bg-indigo-50 disabled:opacity-60"
                >
                  <span className="min-w-0">
                    <span className="block truncate font-black text-slate-900">
                      {collection.name}
                    </span>
                    <span className="text-xs text-slate-600">
                      {collection.article_count} articles
                    </span>
                  </span>
                  <span className="text-indigo-600">＋</span>
                </button>
              ))}
            </div>
          ) : (
            <Link
              to="/collections"
              className="mt-4 block rounded-xl bg-slate-900 px-4 py-2.5 text-center text-sm font-black text-white"
            >
              Create a collection
            </Link>
          )}

          {message && (
            <p className="mt-3 text-xs font-bold text-emerald-700">{message}</p>
          )}
          {error && (
            <p role="alert" className="mt-3 text-xs font-bold text-rose-700">
              {error}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default CollectionPicker;
