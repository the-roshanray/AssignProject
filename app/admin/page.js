"use client";
import { useEffect, useState } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";

export default function AdminPanel() {
  const [expandedProjectId, setExpandedProjectId] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    deadline: "",
  });

  const toggleDescription = (projectId) => {
    setExpandedProjectId(expandedProjectId === projectId ? null : projectId);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/projects");
      const data = await response.json();

      if (response.ok) {
        setProjects(Array.isArray(data) ? data : data.projects || []);
      } else {
        console.error("Unexpected API response:", data);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.deadline) {
      alert("All fields are required!");
      return;
    }

    try {
      const method = editMode ? "PUT" : "POST";
      const endpoint = "/api/projects";
      const body = editMode
        ? { id: editingProject._id, ...formData }
        : formData;

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        alert(editMode ? "Project updated successfully!" : "Project added successfully!");
        setFormData({ title: "", description: "", deadline: "" });
        setEditMode(false);
        setEditingProject(null);
        await fetchProjects();
      } else {
        const error = await response.json();
        console.error("Error saving project:", error);
        alert(error.message || "Failed to save project.");
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  const handleEditClick = (project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      deadline: project.deadline.split("T")[0],
    });
    setEditMode(true);
  };

  const cancelEdit = () => {
    setEditMode(false);
    setEditingProject(null);
    setFormData({ title: "", description: "", deadline: "" });
  };

  const deleteProject = async (projectId) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;

    try {
      const response = await fetch("/api/projects", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: projectId }),
      });

      if (response.ok) {
        alert("Project deleted successfully!");
        setProjects((prevProjects) =>
          prevProjects.filter((project) => project._id !== projectId)
        );
      } else {
        const error = await response.json();
        console.error("Error deleting project:", error);
        alert(error.message || "Failed to delete project.");
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8">Admin Panel</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        <div className="p-6 border rounded-lg shadow-lg bg-white">
          <h2 className="text-2xl font-semibold mb-4">
            {editMode ? "Edit Project" : "Add a New Project"}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Project Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                placeholder="Enter project title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Project Description
              </label>
              <textarea
                id="description"
                name="description"
                placeholder="Enter project description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="4"
                className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="deadline" className="block text-sm font-medium text-gray-700">
                Deadline
              </label>
              <input
                type="date"
                id="deadline"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                required
                className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 mt-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {editMode ? "Update Project" : "Add Project"}
            </button>

            {editMode && (
              <button
                type="button"
                onClick={cancelEdit}
                className="w-full py-3 mt-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
            )}
          </form>
        </div>

        <div className="p-6 border rounded-lg shadow-lg bg-gradient-to-br from-white to-gray-100">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">📋 Assigned Projects</h2>
          {loading ? (
            <p className="text-gray-600 animate-pulse">Loading...</p>
          ) : projects.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {projects.map((project) => (
                <li
                  key={project._id}
                  className="py-4 px-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow mb-4"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-lg text-gray-800">{project.title}</h3>
                    <div className="flex items-center space-x-4">
                      <FaEdit
                        className="text-green-500 cursor-pointer"
                        title="Edit Project"
                        onClick={() => handleEditClick(project)}
                      />
                      <FaTrashAlt
                        onClick={() => deleteProject(project._id)}
                        className="text-red-500 hover:text-red-700 cursor-pointer"
                        title="Delete Project"
                      />
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    🕒 Deadline: <span className="font-semibold text-gray-700">{new Date(project.deadline).toLocaleDateString()}</span>
                  </p>
                  {expandedProjectId === project._id ? (
                    <>
                      <p className="text-gray-700 mt-4 whitespace-pre-line">{project.description}</p>
                      <button
                        className="mt-2 text-blue-600 hover:underline"
                        onClick={() => toggleDescription(project._id)}
                      >
                        View Less
                      </button>
                    </>
                  ) : (
                    <button
                      className="mt-2 text-blue-600 hover:underline"
                      onClick={() => toggleDescription(project._id)}
                    >
                      See Details
                    </button>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600 text-center">No projects assigned yet. 🚀</p>
          )}
        </div>
      </div>
    </div>
  );
}
