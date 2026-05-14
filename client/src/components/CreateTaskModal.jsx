import React, {
  useEffect,
  useState,
} from "react";

import axios from "axios";

function CreateTaskModal({
  isOpen,
  onClose,
  addTask,
  editTask,
  selectedTask,
}) {

  const [teams, setTeams] = useState([]);

  const [selectedTeamMembers,
    setSelectedTeamMembers] =
    useState([]);

  const [taskData, setTaskData] =
    useState({
      title: "",
      description: "",
      priority: "High",
      assignedTo: "",
      dueDate: "",
      teamId: "",
    });

  // FETCH TEAMS
  const fetchTeams = async () => {

    try {

      const response = await axios.get(
        "http://localhost:5000/teams"
      );

      setTeams(
        Array.isArray(response.data)
          ? response.data
          : []
      );

    } catch (error) {

      console.log(error);

    }

  };

  useEffect(() => {

    fetchTeams();

    if (selectedTask) {

      setTaskData({
        title:
          selectedTask.title || "",

        description:
          selectedTask.description || "",

        priority:
          selectedTask.priority || "High",

        assignedTo:
          selectedTask.assignedTo || "",

        dueDate:
          selectedTask.dueDate || "",

        teamId:
          selectedTask.teamId?._id ||
          selectedTask.teamId ||
          "",
      });

    }

  }, [selectedTask]);

  // UPDATE TEAM MEMBERS
  useEffect(() => {

    const selectedTeam =
      teams.find(
        (team) =>
          team._id === taskData.teamId
      );

    if (selectedTeam) {

      setSelectedTeamMembers(
        selectedTeam.members || []
      );

    } else {

      setSelectedTeamMembers([]);

    }

  }, [taskData.teamId, teams]);

  const handleSubmit = async () => {

    try {

      // EDIT TASK
      if (selectedTask) {

        const response = await axios.put(
          `http://localhost:5000/tasks/${selectedTask._id}`,
          taskData
        );

        editTask(response.data);

      }

      // CREATE TASK
      else {

        const response = await axios.post(
          "http://localhost:5000/tasks",
          taskData
        );

        addTask(response.data);

      }

      // RESET
      setTaskData({
        title: "",
        description: "",
        priority: "High",
        assignedTo: "",
        dueDate: "",
        teamId: "",
      });

      setSelectedTeamMembers([]);

      onClose();

    } catch (error) {

      console.log(error);

    }

  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">

      <div className="w-full max-w-2xl bg-[#0f172a] border border-white/10 rounded-3xl shadow-2xl overflow-hidden">

        {/* HEADER */}
        <div className="flex justify-between items-center p-7 border-b border-white/10">

          <div>

            <h2 className="text-3xl font-bold text-white">

              {selectedTask
                ? "Edit Task"
                : "Create New Task"}

            </h2>

            <p className="text-gray-400 mt-1">

              {selectedTask
                ? "Update task details"
                : "Assign and manage workflow"}

            </p>

          </div>

          <button
            onClick={onClose}
            className="w-12 h-12 rounded-xl bg-white/5 hover:bg-red-500/20 transition-all text-white text-xl"
          >
            ✕
          </button>

        </div>

        {/* BODY */}
        <div className="p-7 space-y-6">

          {/* TASK TITLE */}
          <div>

            <label className="block text-gray-300 mb-2">
              Task Title
            </label>

            <input
              type="text"
              placeholder="Enter task title"
              value={taskData.title}
              onChange={(e) =>
                setTaskData({
                  ...taskData,
                  title: e.target.value,
                })
              }
              className="w-full bg-[#020617] border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-blue-500"
            />

          </div>

          {/* DESCRIPTION */}
          <div>

            <label className="block text-gray-300 mb-2">
              Description
            </label>

            <textarea
              rows="4"
              placeholder="Describe task..."
              value={taskData.description}
              onChange={(e) =>
                setTaskData({
                  ...taskData,
                  description: e.target.value,
                })
              }
              className="w-full bg-[#020617] border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-blue-500"
            ></textarea>

          </div>

          {/* PRIORITY + TEAM */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* PRIORITY */}
            <div>

              <label className="block text-gray-300 mb-2">
                Priority
              </label>

              <select
                value={taskData.priority}
                onChange={(e) =>
                  setTaskData({
                    ...taskData,
                    priority: e.target.value,
                  })
                }
                className="w-full bg-[#020617] border border-white/10 rounded-2xl p-4 text-white"
              >

                <option>High</option>
                <option>Medium</option>
                <option>Low</option>

              </select>

            </div>

            {/* TEAM */}
            <div>

              <label className="block text-gray-300 mb-2">
                Assign Team
              </label>

              <select
                value={taskData.teamId}
                onChange={(e) =>
                  setTaskData({
                    ...taskData,
                    teamId: e.target.value,
                    assignedTo: "",
                  })
                }
                className="w-full bg-[#020617] border border-white/10 rounded-2xl p-4 text-white"
              >

                <option value="">
                  Select Team
                </option>

                {teams.map((team) => (

                  <option
                    key={team._id}
                    value={team._id}
                  >
                    {team.name}
                  </option>

                ))}

              </select>

            </div>

          </div>

          {/* ASSIGN MEMBER */}
          <div>

            <label className="block text-gray-300 mb-2">
              Assign Specific Member
              {" "}
              <span className="text-gray-500">
                (Optional)
              </span>
            </label>

            <select
              value={taskData.assignedTo}
              onChange={(e) =>
                setTaskData({
                  ...taskData,
                  assignedTo: e.target.value,
                })
              }
              className="w-full bg-[#020617] border border-white/10 rounded-2xl p-4 text-white"
            >

              <option value="">
                Entire Team
              </option>

              {selectedTeamMembers.map(
                (member, index) => (

                  <option
                    key={index}
                    value={member.name}
                  >
                    {member.name}
                  </option>

                )
              )}

            </select>

          </div>

          {/* DUE DATE */}
          <div>

            <label className="block text-gray-300 mb-2">
              Due Date
            </label>

            <input
              type="date"
              value={taskData.dueDate}
              onChange={(e) =>
                setTaskData({
                  ...taskData,
                  dueDate: e.target.value,
                })
              }
              className="w-full bg-[#020617] border border-white/10 rounded-2xl p-4 text-white"
            />

          </div>

        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-4 p-7 border-t border-white/10">

          <button
            onClick={onClose}
            className="px-6 py-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all text-white"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-6 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 transition-all text-white font-semibold"
          >

            {selectedTask
              ? "Update Task"
              : "Create Task"}

          </button>

        </div>

      </div>

    </div>
  );
}

export default CreateTaskModal;