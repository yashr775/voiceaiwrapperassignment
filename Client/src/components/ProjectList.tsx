import React from "react";
import { useQuery } from "@apollo/client";
import { GET_PROJECTS } from "../graphql/queries";
import type { Project } from "../interfaces/types";

interface ProjectListProps {
  orgSlug: string;
  onSelectProject: (id: string) => void;
}

const ProjectList: React.FC<ProjectListProps> = ({
  orgSlug,
  onSelectProject,
}) => {
  const { loading, error, data } = useQuery(GET_PROJECTS, {
    variables: { orgSlug },
    fetchPolicy: "cache-and-network",
  });

  if (loading) return <p className="text-center py-5">Loading projects...</p>;
  if (error)
    return (
      <p className="text-center py-5 text-red-600">Error: {error.message}</p>
    );

  const projects: Project[] = data.organizationProjects || [];

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-3xl font-semibold mb-6">Projects</h2>
      {projects.length === 0 && <p>No projects found.</p>}
      <ul className="space-y-4">
        {projects.map((project) => (
          <li
            key={project.id}
            className="cursor-pointer border p-4 rounded shadow hover:bg-blue-50 transition"
            onClick={() => onSelectProject(project.id)}
          >
            <h3 className="text-xl font-bold">{project.name}</h3>
            <p className="text-gray-600">{project.description}</p>
            <p className="mt-2 text-sm">
              Status: <span className="font-semibold">{project.status}</span> |
              Due: {project.dueDate ?? "N/A"}
            </p>
            <p className="text-sm">
              Tasks: {project.completedTasks} / {project.taskCount} completed
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectList;
