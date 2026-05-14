import { useEffect, useState } from "react";
import axios from "axios";

import DashboardLayout from "../layouts/DashboardLayout";
import CreateTaskModal from "../components/CreateTaskModal";

function Tasks() {

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

  const [tasks, setTasks] = useState([]);

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const [selectedTask, setSelectedTask] =
    useState(null);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [priorityFilter, setPriorityFilter] =
    useState("All");

  useEffect(() => {

    fetchTasks();

  }, []);

  // FETCH TASKS
  const fetchTasks = async () => {

    try {

      const response =
        await axios.get(
          "http://localhost:5000/tasks"
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

  // DELETE TASK
  const deleteTask = async (id) => {

    try {

      await axios.delete(
        `http://localhost:5000/tasks/${id}`
      );

      fetchTasks();

    } catch (error) {

      console.log(error);

    }

  };

  // UPDATE STATUS
  const updateTaskStatus = async (
    id,
    status
  ) => {

    try {

      await axios.put(
        `http://localhost:5000/tasks/${id}`,
        {
          status,
        }
      );

      fetchTasks();

    } catch (error) {

      console.log(error);

    }

  };

  // FILTER TASKS
  const filteredTasks = tasks.filter((task) => {

    // ROLE FILTER
    const roleMatch =

      role === "ADMIN"

        ? true

        : (

            task.assignedTo === userName ||

            task.assignedTo ===
              userEmailName

            ||

            !task.assignedTo
          );

    // SEARCH FILTER
    const matchesSearch =

      (task.title || "")
        .toLowerCase()
        .includes(
          searchTerm.toLowerCase()
        )

      ||

      (task.description || "")
        .toLowerCase()
        .includes(
          searchTerm.toLowerCase()
        );

    // STATUS FILTER
    const matchesStatus =

      statusFilter === "All" ||

      task.status === statusFilter;

    // PRIORITY FILTER
    const matchesPriority =

      priorityFilter === "All" ||

      task.priority === priorityFilter;

    return (
      roleMatch &&
      matchesSearch &&
      matchesStatus &&
      matchesPriority
    );

  });

  return (
    <>
      <DashboardLayout>

        {/* HEADER */}
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6 mb-10">

          <div>

            <h1 className="text-5xl font-bold">
              Tasks
            </h1>

            <p className="text-gray-400 mt-2">

              {role === "ADMIN"
                ? "Manage and assign collaborative tasks"
                : "View and update your assigned tasks"}

            </p>

          </div>

          {/* ADMIN ONLY */}
          {role === "ADMIN" && (

            <button
              onClick={() => {
                setSelectedTask(null);
                setIsModalOpen(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 transition-all px-6 py-4 rounded-2xl font-semibold shadow-lg shadow-blue-500/20"
            >

              + Create Task

            </button>

          )}

        </div>

        {/* FILTERS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">

          {/* SEARCH */}
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(
                e.target.value
              )
            }
            className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white"
          />

          {/* STATUS */}
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(
                e.target.value
              )
            }
            className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white"
          >

            <option className="bg-black">
              All
            </option>

            <option className="bg-black">
              Pending
            </option>

            <option className="bg-black">
              In Progress
            </option>

            <option className="bg-black">
              Completed
            </option>

          </select>

          {/* PRIORITY */}
          <select
            value={priorityFilter}
            onChange={(e) =>
              setPriorityFilter(
                e.target.value
              )
            }
            className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white"
          >

            <option className="bg-black">
              All
            </option>

            <option className="bg-black">
              High
            </option>

            <option className="bg-black">
              Medium
            </option>

            <option className="bg-black">
              Low
            </option>

          </select>

        </div>

        {/* TASK GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

          {filteredTasks.map((task) => (

            <div
              key={task._id}
              className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-xl hover:border-blue-500 transition-all"
            >

              {/* TOP */}
              <div className="flex justify-between items-start mb-4 gap-4">

                <h2 className="text-2xl font-bold break-words">
                  {task.title}
                </h2>

                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    task.priority === "High"
                      ? "bg-red-500/20 text-red-400"
                      : task.priority === "Medium"
                      ? "bg-blue-500/20 text-blue-400"
                      : "bg-green-500/20 text-green-400"
                  }`}
                >

                  {task.priority}

                </span>

              </div>

              {/* DESCRIPTION */}
              <p className="text-gray-400 mb-5 leading-relaxed min-h-[60px]">

                {task.description ||
                  "No description"}

              </p>

              {/* TEAM */}
              <div className="mb-4">

                <span className="bg-blue-500/10 text-blue-400 px-4 py-2 rounded-full text-sm">

                  Team:
                  {" "}
                  {task.teamId?.name ||
                    "No Team"}

                </span>

              </div>

              {/* ASSIGNED */}
              <div className="mb-4">

                <span className="bg-purple-500/10 text-purple-400 px-4 py-2 rounded-full text-sm">

                  Assigned To:
                  {" "}

                  {task.assignedTo ||
                    "Entire Team"}

                </span>

              </div>

              {/* DEADLINE */}
              <div className="mb-6">

                <span className="bg-yellow-500/10 text-yellow-400 px-4 py-2 rounded-full text-sm">

                  Deadline:
                  {" "}

                  {task.dueDate
                    ? new Date(
                        task.dueDate
                      ).toLocaleDateString()
                    : "No Deadline"}

                </span>

              </div>

              {/* FOOTER */}
              <div className="flex items-center justify-between mt-8">

                {/* STATUS */}
                <select
                  value={task.status}
                  onChange={(e) =>
                    updateTaskStatus(
                      task._id,
                      e.target.value
                    )
                  }
                  className={`px-4 py-2 rounded-xl text-sm font-semibold border-none outline-none ${
                    task.status ===
                    "Completed"
                      ? "bg-green-500/20 text-green-400"
                      : task.status ===
                        "In Progress"
                      ? "bg-blue-500/20 text-blue-400"
                      : "bg-yellow-500/20 text-yellow-400"
                  }`}
                >

                  <option className="bg-black">
                    Pending
                  </option>

                  <option className="bg-black">
                    In Progress
                  </option>

                  <option className="bg-black">
                    Completed
                  </option>

                </select>

                {/* ADMIN ACTIONS */}
                {role === "ADMIN" && (

                  <div className="flex gap-3">

                    <button
                      onClick={() => {
                        setSelectedTask(task);
                        setIsModalOpen(true);
                      }}
                      className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 px-4 py-2 rounded-xl"
                    >

                      Edit

                    </button>

                    <button
                      onClick={() =>
                        deleteTask(task._id)
                      }
                      className="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-4 py-2 rounded-xl"
                    >

                      Delete

                    </button>

                  </div>

                )}

              </div>

            </div>

          ))}

        </div>

      </DashboardLayout>

      {/* ADMIN ONLY MODAL */}
      {role === "ADMIN" && (

        <CreateTaskModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedTask(null);
          }}
          selectedTask={selectedTask}
          addTask={() => fetchTasks()}
          editTask={() => fetchTasks()}
        />

      )}

    </>
  );
}

export default Tasks;