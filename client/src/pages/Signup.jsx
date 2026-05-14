import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { registerUser } from "../services/authService";

function Signup() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "MEMBER",
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
        await registerUser(formData);

      alert(data.message);

      navigate("/login");

    } catch (error) {

      alert(
        error.response?.data?.message ||
        "Something went wrong"
      );

    }

  };

  return (
    <div className="min-h-screen flex bg-[#0f172a] text-white overflow-hidden">

      {/* LEFT SECTION */}
      <div className="hidden lg:flex w-1/2 relative items-center justify-center bg-gradient-to-br from-[#111827] via-[#0f172a] to-black">

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

              Build Better
              <br />
              Teams

            </h1>

          </div>

          <p className="text-gray-300 text-xl leading-relaxed max-w-lg">

            Collaborate seamlessly with projects,
            task tracking, and workflow management.

          </p>

        </div>

      </div>

      {/* RIGHT SECTION */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 bg-[#020617]">

        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-10 shadow-2xl"
        >

          {/* TITLE */}
          <div className="mb-10 text-center">

            <h2 className="text-4xl font-bold mb-3">
              Create Account
            </h2>

            <p className="text-gray-400">
              Start managing your team smarter
            </p>

          </div>

          {/* NAME */}
          <div className="mb-5">

            <label className="block mb-2 text-sm text-gray-300">
              Full Name
            </label>

            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              onChange={handleChange}
              required
              className="w-full bg-[#0f172a] border border-gray-700 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

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
          <div className="mb-5">

            <label className="block mb-2 text-sm text-gray-300">
              Password
            </label>

            <input
              type="password"
              name="password"
              placeholder="Create password"
              onChange={handleChange}
              required
              className="w-full bg-[#0f172a] border border-gray-700 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>

          {/* ROLE */}
          <div className="mb-8">

            <label className="block mb-2 text-sm text-gray-300">
              Select Role
            </label>

            <select
              name="role"
              onChange={handleChange}
              className="w-full bg-[#0f172a] border border-gray-700 rounded-xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >

              <option>
                MEMBER
              </option>

              <option>
                ADMIN
              </option>

            </select>

          </div>

          {/* BUTTON */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 transition-all duration-300 p-4 rounded-xl text-lg font-semibold shadow-lg shadow-blue-500/20"
          >

            Create Account

          </button>

          {/* LOGIN */}
          <p className="text-center text-gray-400 mt-8">

            Already have an account?

            <span
              onClick={() =>
                navigate("/login")
              }
              className="text-blue-400 font-semibold ml-2 cursor-pointer hover:text-blue-300"
            >

              Login

            </span>

          </p>

        </form>

      </div>

    </div>
  );
}

export default Signup;