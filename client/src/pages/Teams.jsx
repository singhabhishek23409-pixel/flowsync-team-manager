import { useEffect, useState } from "react";

import axios from "axios";

import Sidebar from "../components/Sidebar";

import {
  useNavigate,
} from "react-router-dom";

import {
  FaUsers,
  FaTrash,
  FaPlus,
  FaLayerGroup,
} from "react-icons/fa";

import io from "socket.io-client";


// SOCKET
const socket =
  io("http://localhost:5000");


export default function Teams() {

  const navigate =
    useNavigate();

  const user =
    JSON.parse(
      localStorage.getItem("user")
    );

  const [teams, setTeams] =
    useState([]);

  const [tasks, setTasks] =
    useState([]);

  const [name, setName] =
    useState("");

  const [description,
    setDescription] =
    useState("");

  const [memberName,
    setMemberName] =
    useState("");

  // FETCH TEAMS
  const fetchTeams = async () => {

    try {

      const res =
        await axios.get(
          "http://localhost:5000/teams",
          {

            headers: {

              email:
                user?.email,

              role:
                user?.role,

              name:
                user?.name,

            },

          }
        );

      setTeams(res.data);

    } catch (error) {

      console.log(error);

    }

  };

  // FETCH TASKS
  const fetchTasks = async () => {

    try {

      const res =
        await axios.get(
          "http://localhost:5000/tasks"
        );

      setTasks(res.data);

    } catch (error) {

      console.log(error);

    }

  };

  useEffect(() => {

    fetchTeams();

    fetchTasks();

  }, []);

  // LIVE NOTIFICATIONS
  useEffect(() => {

    const handleGlobalNotification =
      (data) => {

        localStorage.setItem(
          `unread_${data.teamId}`,
          "true"
        );

        localStorage.setItem(
          "global_team_notification",
          "true"
        );

        // FORCE RE-RENDER
        setTeams((prev) => [...prev]);

      };

    socket.on(
      "global_notification",
      handleGlobalNotification
    );

    return () => {

      socket.off(
        "global_notification",
        handleGlobalNotification
      );

    };

  }, []);

  // CREATE TEAM
  const createTeam = async () => {

    if (!name) return;

    try {

      await axios.post(
        "http://localhost:5000/teams",
        {
          name,
          description,
        }
      );

      setName("");

      setDescription("");

      fetchTeams();

    } catch (error) {

      console.log(error);

    }

  };

  // ADD MEMBER
  const addMember = async (teamId) => {

    if (!memberName) return;

    try {

      const usersResponse =
        await axios.get(
          "http://localhost:5000/users"
        );

      const selectedUser =
        usersResponse.data.find(
          (user) =>

            user.name
              .toLowerCase() ===
            memberName.toLowerCase()

            ||

            user.email
              .split("@")[0]
              .toLowerCase() ===
            memberName.toLowerCase()
        );

      if (!selectedUser) {

        alert("User not found");

        return;

      }

      await axios.put(
        `http://localhost:5000/teams/${teamId}/member`,
        {

          name:
            selectedUser.name,

          email:
            selectedUser.email,

          role:
            selectedUser.role,

        }
      );

      setMemberName("");

      fetchTeams();

    } catch (error) {

      console.log(error);

      alert(
        error.response?.data?.message ||
        "Failed to add member"
      );

    }

  };

  // DELETE TEAM
  const deleteTeam = async (id) => {

    try {

      await axios.delete(
        `http://localhost:5000/teams/${id}`
      );

      fetchTeams();

    } catch (error) {

      console.log(error);

    }

  };

  return (
    <div className="flex bg-[#020617] min-h-screen text-white">

      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN */}
      <div className="flex-1 p-8">

        {/* HEADER */}
        <div className="mb-10">

          <h1 className="text-5xl font-bold mb-3">

            Teams Workspace

          </h1>

          <p className="text-gray-400 text-lg">

            Manage collaboration teams and assigned tasks.

          </p>

        </div>

        {/* CREATE TEAM */}
        <div className="bg-[#0f172a] border border-white/10 rounded-3xl p-8 mb-10 shadow-2xl">

          <div className="flex items-center gap-3 mb-6">

            <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-2xl">

              <FaPlus />

            </div>

            <div>

              <h2 className="text-2xl font-bold">

                Create New Team

              </h2>

              <p className="text-gray-400">

                Build and organize your workspace teams

              </p>

            </div>

          </div>

          <div className="grid md:grid-cols-2 gap-5">

            <input
              type="text"
              placeholder="Enter team name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              className="bg-[#020617] border border-white/10 p-4 rounded-2xl outline-none focus:border-blue-500"
            />

            <input
              type="text"
              placeholder="Enter team description"
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              className="bg-[#020617] border border-white/10 p-4 rounded-2xl outline-none focus:border-blue-500"
            />

          </div>

          <button
            onClick={createTeam}
            className="mt-6 bg-blue-600 hover:bg-blue-700 transition-all px-8 py-4 rounded-2xl font-semibold flex items-center gap-3"
          >

            <FaPlus />

            Create Team

          </button>

        </div>

        {/* TEAMS GRID */}
        <div>

          <div className="flex items-center gap-3 mb-6">

            <FaLayerGroup className="text-2xl text-blue-500" />

            <h2 className="text-3xl font-bold">

              Your Teams

            </h2>

          </div>

          {teams.length === 0 ? (

            <div className="bg-[#0f172a] border border-white/10 rounded-3xl p-16 text-center">

              <FaUsers className="text-6xl mx-auto mb-5 text-gray-500" />

              <h2 className="text-3xl font-bold mb-3">

                No Teams Yet

              </h2>

              <p className="text-gray-400">

                Create your first team to start collaborating.

              </p>

            </div>

          ) : (

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

              {teams.map((team) => {

                const teamTasks =
                  tasks.filter(
                    (task) =>

                      task.teamId ===
                      team._id

                      ||

                      task.teamId?._id ===
                      team._id
                  );

                return (

                  <div
                    key={team._id}
                    className="bg-[#0f172a] border border-white/10 rounded-3xl p-6 hover:border-blue-500 transition-all"
                  >

                    <div className="flex justify-between items-start mb-6">

                      <div>

                        <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-3xl mb-4">

                          <FaUsers />

                        </div>

                        <h2 className="text-2xl font-bold mb-2">

                          {team.name}

                        </h2>

                        <p className="text-gray-400">

                          {team.description ||
                            "No description"}

                        </p>

                        <div className="mt-4 flex flex-wrap gap-2">

                          {team.members?.map(
                            (
                              member,
                              index
                            ) => (

                              <div
                                key={index}
                                className="bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-sm"
                              >

                                {member.name}

                              </div>

                            )
                          )}

                        </div>

                      </div>

                    </div>

                    {/* TASKS */}
                    <div className="mt-6">

                      <h3 className="text-lg font-semibold mb-4">

                        Team Tasks

                      </h3>

                      {teamTasks.length === 0 ? (

                        <div className="text-gray-500 text-sm">

                          No tasks assigned

                        </div>

                      ) : (

                        <div className="space-y-3">

                          {teamTasks.map(
                            (task) => (

                              <div
                                key={task._id}
                                className="bg-[#020617] border border-white/10 rounded-2xl p-4"
                              >

                                <div className="flex items-center justify-between gap-3">

                                  <h4 className="font-semibold">

                                    {task.title}

                                  </h4>

                                  <span
                                    className={`text-xs px-3 py-1 rounded-full ${
                                      task.priority ===
                                      "High"
                                        ? "bg-red-500/20 text-red-400"
                                        : task.priority ===
                                          "Medium"
                                        ? "bg-blue-500/20 text-blue-400"
                                        : "bg-green-500/20 text-green-400"
                                    }`}
                                  >

                                    {task.priority}

                                  </span>

                                </div>

                                <p className="text-gray-400 text-sm mt-2">

                                  {task.description}

                                </p>

                              </div>

                            )
                          )}

                        </div>

                      )}

                    </div>

                    {/* ADD MEMBER */}
                    <div className="mt-6">

                      <input
                        type="text"
                        placeholder="Enter registered username"
                        value={memberName}
                        onChange={(e) =>
                          setMemberName(
                            e.target.value
                          )
                        }
                        className="w-full bg-[#020617] border border-white/10 p-3 rounded-xl mb-3 outline-none"
                      />

                      <button
                        onClick={() =>
                          addMember(team._id)
                        }
                        className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded-xl"
                      >

                        Add Member

                      </button>

                    </div>

                    {/* FOOTER */}
                    <div className="flex items-center justify-between mt-8 gap-3">

                      <div>

                        <p className="text-gray-500 text-sm">

                          Team Members

                        </p>

                        <h3 className="text-2xl font-bold">

                          {team.members?.length || 0}

                        </h3>

                      </div>

                      <div className="flex gap-3">

                        {/* CHAT */}
                        <div className="relative">

                          <button
                            onClick={() => {

                              localStorage.removeItem(
                                `unread_${team._id}`
                              );

                              localStorage.removeItem(
                                "global_team_notification"
                              );

                              setTeams((prev) => [...prev]);

                              navigate(
                                `/teams/${team._id}/chat`
                              );

                            }}
                            className="bg-blue-600 hover:bg-blue-700 transition-all px-5 py-3 rounded-2xl text-white font-semibold"
                          >

                            Open Chat

                          </button>

                          {/* RED DOT */}
                          {localStorage.getItem(
                            `unread_${team._id}`
                          ) && (

                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-[#0f172a] animate-pulse" />

                          )}

                        </div>

                        {/* DELETE */}
                        <button
                          onClick={() =>
                            deleteTeam(team._id)
                          }
                          className="bg-red-500/10 hover:bg-red-500 transition-all p-4 rounded-2xl text-red-400 hover:text-white"
                        >

                          <FaTrash />

                        </button>

                      </div>

                    </div>

                  </div>

                );

              })}

            </div>

          )}

        </div>

      </div>

    </div>
  );
}