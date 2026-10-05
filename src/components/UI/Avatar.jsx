function Avatar({ user, size = "md", className = "" }) {
  const dimensions = {
    sm: "h-9 w-9 text-sm rounded-xl",
    md: "h-12 w-12 text-base rounded-2xl",
    lg: "h-24 w-24 text-3xl rounded-3xl",
  };

  const label = user?.name || user?.username || "User";
  const initial = label.charAt(0).toUpperCase();

  if (user?.avatar_url) {
    return (
      <img
        src={user.avatar_url}
        alt={label + " avatar"}
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
