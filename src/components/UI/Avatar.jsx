import { useEffect, useState } from "react";

function Avatar({ user, size = "md", className = "" }) {
  const [imageFailed, setImageFailed] = useState(false);

  const dimensions = {
    sm: "h-9 w-9 text-sm rounded-xl",
    md: "h-12 w-12 text-base rounded-2xl",
    lg: "h-24 w-24 text-3xl rounded-3xl",
  };

  const label = user?.name || user?.username || "User";
  const initial = label.charAt(0).toUpperCase();

  useEffect(() => {
    setImageFailed(false);
  }, [user?.avatar_url]);

  if (user?.avatar_url && !imageFailed) {
    return (
      <img
        src={user.avatar_url}
        alt={label + " avatar"}
        onError={() => setImageFailed(true)}
        className={
          dimensions[size] +
          " shrink-0 border border-slate-200 bg-slate-100 object-cover " +
          className
        }
      />
    );
  }

  return (
    <div
      role="img"
      aria-label={label + " avatar"}
      className={
        dimensions[size] +
        " flex shrink-0 items-center justify-center bg-gradient-to-br from-indigo-500 to-violet-700 font-black text-white " +
        className
      }
    >
      {initial}
    </div>
  );
}

export default Avatar;
