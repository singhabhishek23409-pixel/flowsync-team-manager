import { useEffect, useState } from "react";
import axios from "axios";

import CreateTaskModal from "../components/CreateTaskModal";
import DashboardLayout from "../layouts/DashboardLayout";
import StatCard from "../components/StatCard";

function Dashboard() {

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const [tasks, setTasks] = useState([]);

  // USER
  const user =
    JSON.parse(
      localStorage.getItem("user")
    );

  const role =
    user?.role || "MEMBER";

  const userName =
    user?.name || "";

  const userEmailName =
    user?.email?.split("@")[0] || "";

  const displayName =
    userEmailName || "User";

  useEffect(() => {

    fetchTasks();

  }, []);

  // FETCH TASKS
  const fetchTasks = async () => {

    try {

      const response =
        await axios.get(
          "https://daring-youth-production-230b.up.railway.app/tasks"
        );

      setTasks(
        Array.isArray(response.data)
          ? response.data
          : []
      );

    } catch (error) {

      console.log(error);

    }

  };

  // ROLE FILTER
  const visibleTasks = tasks.filter((task) => {

    if (role === "ADMIN") {

      return true;

    }

    return (

      task.assignedTo === userName ||

      task.assignedTo ===
        userEmailName

      ||

      !task.assignedTo

    );

  });

  // OVERDUE
  const overdueTasks =
    visibleTasks.filter((task) => {

      if (!task.dueDate)
        return false;

      return (
        new Date(task.dueDate) <
          new Date() &&
        task.status !==
          "Completed"
      );

    });

  // DUE SOON
  const dueSoonTasks =
    visibleTasks.filter((task) => {

      if (!task.dueDate)
        return false;

      const today =
        new Date();

      const dueDate =
        new Date(task.dueDate);

      const diffTime =
        dueDate - today;

      const diffDays =
        diffTime /
        (
          1000 *
          60 *
          60 *
          24
        );

      return (
        diffDays > 0 &&
        diffDays <= 2 &&
        task.status !==
          "Completed"
      );

    });

  return (
    <>
      <DashboardLayout>

        {/* HERO */}
        <div className="mb-10">

          <h1 className="text-5xl font-bold mb-3 leading-tight">

            Welcome back,
            {" "}
            {displayName}
            {" "}
            👋

          </h1>

          <p className="text-gray-400 text-lg">

            {role === "ADMIN"
              ? "Manage your entire team workflow efficiently."
              : "Track your assigned tasks and deadlines."}

          </p>

        </div>

        {/* ADMIN ONLY */}
        {role === "ADMIN" && (

          <div className="flex flex-wrap gap-4 mb-10">

            <button
              onClick={() =>
                setIsModalOpen(true)
              }
              className="bg-blue-600 hover:bg-blue-700 hover:scale-105 transition-all duration-300 px-6 py-4 rounded-2xl font-semibold shadow-lg shadow-blue-500/20"
            >

              + Create Task

            </button>

          </div>

        )}

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">

          <StatCard
            title="Total Tasks"
            value={visibleTasks.length}
          />

          <StatCard
            title="Completed Tasks"
            value={
              visibleTasks.filter(
                (task) =>
                  task.status ===
                  "Completed"
              ).length
            }
          />

          <StatCard
            title="Overdue Tasks"
            value={
              overdueTasks.length
            }
          />

          <StatCard
            title="Due Soon"
            value={
              dueSoonTasks.length
            }
          />

        </div>

        {/* ALERTS */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-10">

          {/* OVERDUE */}
          <div className="bg-red-500/10 border border-red-500/20 rounded-3xl p-7">

            <h2 className="text-2xl font-bold text-red-400 mb-5">

              ⚠ Overdue Tasks

            </h2>

            {overdueTasks.length === 0 ? (

              <p className="text-gray-400">
                No overdue tasks.
              </p>

            ) : (

              <div className="space-y-4">

                {overdueTasks.map((task) => (

                  <div
                    key={task._id}
                    className="bg-black/20 rounded-2xl p-4"
                  >

                    <h3 className="font-semibold">
                      {task.title}
                    </h3>

                    <p className="text-gray-400 text-sm mt-1">

                      Deadline:
                      {" "}

                      {new Date(
                        task.dueDate
                      ).toLocaleDateString()}

                    </p>

                  </div>

                ))}

              </div>

            )}

          </div>

          {/* DUE SOON */}
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-3xl p-7">

            <h2 className="text-2xl font-bold text-yellow-400 mb-5">

              ⏳ Due Soon

            </h2>

            {dueSoonTasks.length === 0 ? (

              <p className="text-gray-400">
                No upcoming deadlines.
              </p>

            ) : (

              <div className="space-y-4">

                {dueSoonTasks.map((task) => (

                  <div
                    key={task._id}
                    className="bg-black/20 rounded-2xl p-4"
                  >

                    <h3 className="font-semibold">
                      {task.title}
                    </h3>

                    <p className="text-gray-400 text-sm mt-1">

                      Deadline:
                      {" "}

                      {new Date(
                        task.dueDate
                      ).toLocaleDateString()}

                    </p>

                  </div>

                ))}

              </div>

            )}

          </div>

        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* TABLE */}
          <div className="xl:col-span-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">

            <div className="p-7 border-b border-white/10">

              <h2 className="text-3xl font-bold">
                Recent Tasks
              </h2>

              <p className="text-gray-400 mt-1">

                {role === "ADMIN"
                  ? "Track the latest updates from your workspace"
                  : "Your assigned work overview"}

              </p>

            </div>

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-black/20 text-gray-400 text-left">

                  <tr>

                    <th className="p-6">
                      Task
                    </th>

                    <th className="p-6">
                      Team
                    </th>

                    <th className="p-6">
                      Deadline
                    </th>

                    <th className="p-6">
                      Status
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {visibleTasks.map((task, index) => (

                    <tr
                      key={index}
                      className="border-t border-white/5 hover:bg-white/5 transition-all"
                    >

                      <td className="p-6">

                        <h3 className="font-semibold">
                          {task.title}
                        </h3>

                        <p className="text-gray-400 text-sm mt-1">
                          {task.description}
                        </p>

                      </td>

                      <td className="p-6 text-gray-300">

                        {task.teamId?.name ||
                          "No Team"}

                      </td>

                      <td className="p-6 text-gray-300">

                        {task.dueDate
                          ? new Date(
                              task.dueDate
                            ).toLocaleDateString()
                          : "No Deadline"}

                      </td>

                      <td className="p-6">

                        <span
                          className={`px-4 py-2 rounded-full text-sm ${
                            task.status ===
                            "Completed"
                              ? "bg-green-500/20 text-green-400"
                              : task.status ===
                                "In Progress"
                              ? "bg-blue-500/20 text-blue-400"
                              : "bg-yellow-500/20 text-yellow-400"
                          }`}
                        >

                          {task.status}

                        </span>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </div>

          {/* PRODUCTIVITY */}
          <div className="space-y-6">

            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 shadow-2xl">

              <p className="text-blue-100 mb-2">

                Team Productivity

              </p>

              <h2 className="text-5xl font-bold mb-4">

                {visibleTasks.length === 0

                  ? "0%"

                  : `${Math.round(

                      (
                        visibleTasks.filter(
                          (task) =>
                            task.status ===
                            "Completed"
                        ).length /

                        visibleTasks.length

                      ) * 100

                    )}%`}

              </h2>

              <p className="text-blue-100 leading-relaxed">

                Productivity based on completed tasks.

              </p>

            </div>

          </div>

        </div>

      </DashboardLayout>

      {/* ADMIN ONLY MODAL */}
      {role === "ADMIN" && (

        <CreateTaskModal
          isOpen={isModalOpen}
          onClose={() =>
            setIsModalOpen(false)
          }
          addTask={(newTask) =>
            setTasks([
              ...tasks,
              {
                ...newTask,
                status: "Pending",
              },
            ])
          }
        />

      )}

    </>
  );
}

export default Dashboard;