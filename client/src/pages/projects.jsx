import DashboardLayout from "../layouts/DashboardLayout";

function Projects() {
  return (
    <DashboardLayout>

      <div className="flex justify-between items-center mb-10">

        <div>

          <h1 className="text-5xl font-bold">
            Projects
          </h1>

          <p className="text-gray-400 mt-2">
            Track and organize all active projects
          </p>

        </div>

        <button className="bg-blue-600 hover:bg-blue-700 transition-all px-6 py-4 rounded-2xl font-semibold">
          + New Project
        </button>

      </div>

    </DashboardLayout>
  );
}

export default Projects;