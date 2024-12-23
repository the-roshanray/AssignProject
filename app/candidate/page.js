"use client";
import { useState, useEffect } from "react";
import { FaTrashAlt } from "react-icons/fa";

export default function CandidatePanel() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedProjectId, setExpandedProjectId] = useState(null); // Add state for expanding/collapsing project descriptions

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

  const toggleDescription = (projectId) => {
    setExpandedProjectId((prevId) =>
      prevId === projectId ? null : projectId
    );
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <header className=" mb-6">
        <h1 className="text-4xl font-bold">Candidate Panel</h1>
        <p className="text-lg text-gray-600 mt-2">
          Manage your projects and track your progress efficiently.
        </p>
      </header>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Assigned Projects</h2>
        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : projects.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {projects.map((project) => (
              <li
                key={project._id}
                className="py-4 px-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow mb-4"
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-lg text-gray-800">{project.title}</h3>
                  <button className="bg-blue-500 text-white p-2 rounded-md px-4 font-bold">Accept</button>
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
          <p className="text-gray-600">No projects assigned.</p>
        )}
      </section>

      <section className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Progress Tracker</h2>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <ProgressTracker completed={5} total={10} />
        </div>
      </section>
    </div>
  );
}

function ProgressTracker({ completed, total }) {
  const percentage = Math.round((completed / total) * 100);

  return (
    <div className="p-4">
      <h3 className="font-bold text-lg">Progress</h3>
      <p>
        {completed} out of {total} tasks completed.
      </p>
      <div className="mt-2 w-full bg-gray-200 rounded-full h-4">
        <div
          className="bg-blue-500 h-4 rounded-full"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <p className="mt-2 text-blue-600 font-semibold">{percentage}% Completed</p>
    </div>
  );
}
