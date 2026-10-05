import { useId, useState } from "react";
import {
  AVATAR_PLAYGROUND_URL,
  generateRandomAvatarUrl,
} from "../../utils/avatar";
import Avatar from "./Avatar";

function AvatarPicker({
  value,
  onChange,
  name = "",
  username = "",
  disabled = false,
}) {
  const inputId = useId();
  const helpId = inputId + "-help";
  const statusId = inputId + "-status";
  const [status, setStatus] = useState("");

  const previewUser = {
    name: name || username || "Avatar preview",
    username,
    avatar_url: value,
  };

  const handleGenerate = () => {
    const nextAvatar = generateRandomAvatarUrl(username || name);
    onChange(nextAvatar);
    setStatus("Generated a new avatar. You can keep it or generate another.");
  };

  const handleClear = () => {
    onChange("");
    setStatus("Avatar removed. Your initials will be used instead.");
  };

  const handleUrlChange = (event) => {
    onChange(event.target.value);
    setStatus("");
  };

  return (
    <fieldset className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5">
      <legend className="px-2 text-sm font-black text-slate-900">
        Profile picture
      </legend>

      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <div className="relative w-fit">
          <Avatar
            user={previewUser}
            size="lg"
            className="border-4 border-white shadow-md"
          />
          <span
            aria-hidden="true"
            className="absolute -bottom-1 -right-1 rounded-full border-2 border-white bg-emerald-500 p-1.5 shadow-sm"
          />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-slate-900">
            Pick something that feels like you
          </p>
          <p id={helpId} className="mt-1 text-sm leading-6 text-slate-600">
            Generate one instantly, paste a direct image URL, or make your own
            in DiceBear.
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleGenerate}
              disabled={disabled}
              className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              ✨ Surprise me
            </button>

            <a
              href={AVATAR_PLAYGROUND_URL}
              target="_blank"
              rel="noreferrer"
              className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:border-indigo-300 hover:text-indigo-700"
            >
              Make your own ↗
            </a>

            {value && (
              <button
                type="button"
                onClick={handleClear}
                disabled={disabled}
                className="rounded-xl px-3 py-2.5 text-sm font-bold text-slate-500 transition hover:bg-slate-200 hover:text-slate-800 disabled:opacity-60"
              >
                Remove
              </button>
            )}
          </div>
        </div>
      </div>

      <label htmlFor={inputId} className="mt-5 block">
        <span className="text-sm font-semibold text-slate-700">
          Or paste an image URL
        </span>
        <input
          id={inputId}
          type="url"
          value={value}
          onChange={handleUrlChange}
          disabled={disabled}
          placeholder="https://example.com/avatar.jpg"
          aria-describedby={helpId + " " + statusId}
          className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:bg-slate-100"
        />
      </label>

      <p
        id={statusId}
        aria-live="polite"
        className="mt-2 min-h-5 text-sm font-medium text-emerald-700"
      >
        {status}
      </p>
    </fieldset>
  );
}

export default AvatarPicker;
