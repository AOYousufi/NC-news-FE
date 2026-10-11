import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../../Context/userContext";
import {
  createCollection,
  deleteCollection,
  fetchCollection,
  fetchCollections,
  removeArticleFromCollection,
  updateCollection,
} from "../../api/api";
import ArticleCard from "../Main/Articles/ArticleCard";
import Loading from "../UI/Loading";

function Collections() {
  const { loggedUser, isAuthLoading } = useContext(UserContext);
  const navigate = useNavigate();
  const [collections, setCollections] = useState([]);
  const [activeCollection, setActiveCollection] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const loadCollections = async () => {
    const data = await fetchCollections();
    setCollections(data);
    return data;
  };

  useEffect(() => {
    if (!isAuthLoading && !loggedUser) {
      navigate("/login", { replace: true });
    }
  }, [isAuthLoading, loggedUser, navigate]);

  useEffect(() => {
    if (!loggedUser) return;

    loadCollections()
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [loggedUser]);

  const create = async (event) => {
    event.preventDefault();
    if (!name.trim()) return;

    setError("");
    setIsSaving(true);

    try {
      const created = await createCollection({
        name: name.trim(),
        description: description.trim(),
      });
      setCollections((current) => [created, ...current]);
      setName("");
      setDescription("");
      setActiveCollection({ ...created, articles: [] });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const openCollection = async (collectionId) => {
    setError("");

    try {
      const collection = await fetchCollection(collectionId);
      setActiveCollection(collection);
    } catch (err) {
      setError(err.message);
    }
  };

  const rename = async (collectionId) => {
    if (!editingName.trim()) return;

    try {
      const updated = await updateCollection(collectionId, {
        name: editingName.trim(),
      });
      setCollections((current) =>
        current.map((item) =>
          item.collection_id === collectionId
            ? { ...item, ...updated }
            : item
        )
      );
      setActiveCollection((current) =>
        current?.collection_id === collectionId
          ? { ...current, ...updated }
          : current
      );
      setEditingId(null);
      setEditingName("");
    } catch (err) {
      setError(err.message);
    }
  };

  const removeCollection = async (collectionId) => {
    try {
      await deleteCollection(collectionId);
      setCollections((current) =>
        current.filter((item) => item.collection_id !== collectionId)
      );
      if (activeCollection?.collection_id === collectionId) {
        setActiveCollection(null);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const removeArticle = async (articleId) => {
    if (!activeCollection) return;

    try {
      await removeArticleFromCollection(activeCollection.collection_id, articleId);
      setActiveCollection((current) => ({
        ...current,
        articles: current.articles.filter(
          (article) => article.article_id !== articleId
        ),
      }));
      setCollections((current) =>
        current.map((item) =>
          item.collection_id === activeCollection.collection_id
            ? { ...item, article_count: Math.max(item.article_count - 1, 0) }
            : item
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  if (isAuthLoading || isLoading) return <Loading />;
  if (!loggedUser) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="border-b border-slate-200 pb-7">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-indigo-600">
          Reading lists
        </p>
        <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">
          Collections
        </h1>
        <p className="mt-2 max-w-2xl text-slate-500">
          Organise stories into private lists instead of keeping everything in
          one Saved bucket.
        </p>
      </div>

      {error && (
        <p role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {error}
        </p>
      )}

      <form
        onSubmit={create}
        className="mt-6 grid gap-3 rounded-2xl border border-slate-200 bg-white p-5 sm:grid-cols-[1fr_1.5fr_auto] sm:items-end"
      >
        <label className="text-sm font-bold text-slate-700">
          Collection name
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            maxLength={80}
            placeholder="Backend deep dives"
            className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
          />
        </label>

        <label className="text-sm font-bold text-slate-700">
          Description <span className="font-medium text-slate-400">(optional)</span>
          <input
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            maxLength={300}
            placeholder="Articles I want to revisit"
            className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
          />
        </label>

        <button
          type="submit"
          disabled={isSaving || !name.trim()}
          className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-black text-white disabled:opacity-50"
        >
          {isSaving ? "Creating..." : "Create"}
        </button>
      </form>

      <div className="mt-8 grid gap-8 lg:grid-cols-[320px_1fr]">
        <aside>
          <h2 className="text-xl font-black text-slate-950">Your lists</h2>
          <div className="mt-3 space-y-2">
            {collections.length ? (
              collections.map((collection) => (
                <div
                  key={collection.collection_id}
                  className={
                    "rounded-2xl border bg-white p-4 transition " +
                    (activeCollection?.collection_id === collection.collection_id
                      ? "border-indigo-300 shadow-sm"
                      : "border-slate-200")
                  }
                >
                  {editingId === collection.collection_id ? (
                    <div className="flex gap-2">
                      <input
                        value={editingName}
                        onChange={(event) => setEditingName(event.target.value)}
                        className="min-w-0 flex-1 rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => rename(collection.collection_id)}
                        className="text-xs font-black text-indigo-600"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => openCollection(collection.collection_id)}
                      className="w-full text-left"
                    >
                      <p className="font-black text-slate-950">{collection.name}</p>
                      <p className="mt-1 text-xs font-semibold text-slate-400">
                        {collection.article_count} articles
                      </p>
                    </button>
                  )}

                  <div className="mt-3 flex gap-3 text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(collection.collection_id);
                        setEditingName(collection.name);
                      }}
                      className="text-slate-500 hover:text-indigo-700"
                    >
                      Rename
                    </button>
                    <button
                      type="button"
                      onClick={() => removeCollection(collection.collection_id)}
                      className="text-rose-600 hover:text-rose-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-5 text-sm text-slate-500">
                Create your first collection above.
              </p>
            )}
          </div>
        </aside>

        <div>
          {activeCollection ? (
            <>
              <div className="flex items-end justify-between gap-3">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.16em] text-indigo-600">
                    Collection
                  </p>
                  <h2 className="mt-1 text-2xl font-black text-slate-950">
                    {activeCollection.name}
                  </h2>
                  {activeCollection.description && (
                    <p className="mt-1 text-slate-500">
                      {activeCollection.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-5 space-y-4">
                {activeCollection.articles.length ? (
                  activeCollection.articles.map((article) => (
                    <div key={article.article_id}>
                      <ArticleCard
                        {...article}
                        img_url={article.article_img_url}
                      />
                      <button
                        type="button"
                        onClick={() => removeArticle(article.article_id)}
                        className="mt-2 text-xs font-black text-rose-600"
                      >
                        Remove from collection
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
                    This collection is empty. Add stories from an article page.
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
              <p className="font-black text-slate-900">Choose a collection</p>
              <p className="mt-2 text-sm text-slate-500">
                Or open any article and use “Add to collection”.
              </p>
              <Link
                to="/articles"
                className="mt-5 inline-block rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-black text-white"
              >
                Browse articles
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default Collections;
