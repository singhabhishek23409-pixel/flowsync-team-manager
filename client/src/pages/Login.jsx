import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { loginUser } from "../services/authService";

function Login() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const data =
        await loginUser(formData);

      // SAVE TOKEN
      localStorage.setItem(
        "token",
        data.token
      );

      // SAVE USER
      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      alert("Login successful");

      // FORCE FULL REFRESH
      window.location.href =
        "/dashboard";

    } catch (error) {

      alert(
        error.response?.data?.message ||
        "Login failed"
      );

    }

  };

  return (
    <div className="min-h-screen flex bg-[#0f172a] text-white overflow-hidden">

      {/* LEFT SECTION */}
      <div className="hidden lg:flex w-1/2 relative items-center justify-center bg-gradient-to-br from-[#111827] via-[#0f172a] to-black">

        {/* GLOW EFFECTS */}
        <div className="absolute w-72 h-72 bg-blue-500/20 rounded-full blur-3xl top-20 left-20"></div>

        <div className="absolute w-72 h-72 bg-purple-500/20 rounded-full blur-3xl bottom-10 right-10"></div>

        <div className="relative z-10 px-16">

          {/* BRAND */}
          <div className="flex items-center gap-4 mb-12">

            <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-2xl font-bold shadow-lg shadow-blue-500/30">

              F

            </div>

            <div>

              <h1 className="text-3xl font-bold tracking-wide">
                FlowSync
              </h1>

              <p className="text-gray-400 text-sm">
                Smart Team Collaboration
              </p>

            </div>

          </div>

          {/* HERO */}
          <div className="mb-8">

            <h1 className="text-6xl font-extrabold leading-tight">

              Manage Work
              <br />
              Smarter

            </h1>

          </div>

          <p className="text-gray-300 text-xl leading-relaxed max-w-lg">

            Organize tasks, manage deadlines,
            collaborate with teams, and track progress
            efficiently.

          </p>

          {/* STATS */}
          <div className="flex gap-6 mt-12">

            <div className="bg-white/5 border border-white/10 backdrop-blur-lg rounded-2xl p-6 w-44">

              <h2 className="text-3xl font-bold">
                10K+
              </h2>

              <p className="text-gray-400 mt-2">
                Tasks Managed
              </p>

            </div>

            <div className="bg-white/5 border border-white/10 backdrop-blur-lg rounded-2xl p-6 w-44">

              <h2 className="text-3xl font-bold">
                500+
              </h2>

              <p className="text-gray-400 mt-2">
                Teams Active
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* RIGHT SECTION */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 bg-[#020617]">

        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-10 shadow-2xl"
        >

          {/* MOBILE BRAND */}
          <div className="flex items-center justify-center gap-3 mb-10 lg:hidden">

            <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-xl font-bold">

              F

            </div>

            <div>

              <h1 className="text-2xl font-bold">
                FlowSync
              </h1>

              <p className="text-xs text-gray-400">
                Smart Team Collaboration
              </p>

            </div>

          </div>

          {/* TITLE */}
          <div className="mb-10 text-center">

            <h2 className="text-4xl font-bold mb-3">
              Welcome Back
            </h2>

            <p className="text-gray-400">
              Login to continue managing your workspace
            </p>

          </div>

          {/* EMAIL */}
          <div className="mb-5">

            <label className="block mb-2 text-sm text-gray-300">
              Email
            </label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              onChange={handleChange}
              required
              className="w-full bg-[#0f172a] border border-gray-700 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>

          {/* PASSWORD */}
          <div className="mb-3">

            <label className="block mb-2 text-sm text-gray-300">
              Password
            </label>

            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              onChange={handleChange}
              required
              className="w-full bg-[#0f172a] border border-gray-700 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>

          {/* OPTIONS */}
          <div className="flex justify-between items-center mb-8 text-sm">

            <label className="flex items-center gap-2 text-gray-400">

              <input type="checkbox" />

              Remember me

            </label>

            <span className="text-blue-400 cursor-pointer hover:text-blue-300">

              Forgot Password?

            </span>

          </div>

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 transition-all duration-300 p-4 rounded-xl text-lg font-semibold shadow-lg shadow-blue-500/20"
          >

            Login

          </button>

          {/* SIGNUP */}
          <p className="text-center text-gray-400 mt-8">

            Don’t have an account?

            <span
              onClick={() =>
                navigate("/signup")
              }
              className="text-blue-400 font-semibold ml-2 cursor-pointer hover:text-blue-300"
            >

              Signup

            </span>

          </p>

        </form>

      </div>

    </div>
  );
}

export default Login;