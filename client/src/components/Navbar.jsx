function Navbar() {

  const user =
    JSON.parse(
      localStorage.getItem("user")
    );

  const email =
    user?.email || "user@example.com";

  const role =
    user?.role || "MEMBER";

  const firstLetter =
    email.charAt(0).toUpperCase();

  return (
    <div className="bg-[#0f172a]/80 backdrop-blur-xl border-b border-white/10 p-6 flex justify-between items-center sticky top-0 z-50">

      {/* LEFT */}
      <div>

        <h1 className="text-4xl font-bold text-white">
          Dashboard
        </h1>

        <p className="text-gray-400 mt-1">
          Manage your team workflow efficiently
        </p>

      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-5">

        <div className="text-right">

          <h2 className="text-white font-semibold text-lg">
            {email}
          </h2>

          <p
            className={`text-sm font-medium ${
              role === "ADMIN"
                ? "text-red-400"
                : "text-blue-400"
            }`}
          >

            {role}

          </p>

        </div>

        {/* AVATAR */}
        <div
          className={`w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg ${
            role === "ADMIN"
              ? "bg-gradient-to-br from-red-500 to-pink-700 shadow-red-500/30"
              : "bg-gradient-to-br from-blue-500 to-indigo-700 shadow-blue-500/30"
          }`}
        >

          {firstLetter}

        </div>

      </div>

    </div>
  );
}

export default Navbar;