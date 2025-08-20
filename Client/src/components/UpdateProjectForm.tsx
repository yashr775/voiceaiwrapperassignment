import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { UPDATE_PROJECT } from "../graphql/mutations";

interface Props {
  project: {
    id: string;
    name: string;
    description: string;
    status: string;
    dueDate?: string | null;
  };
  onUpdated: () => void;
  onCancel: () => void;
}

const UpdateProjectForm: React.FC<Props> = ({
  project,
  onUpdated,
  onCancel,
}) => {
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description);
  const [status, setStatus] = useState(project.status);
  const [dueDate, setDueDate] = useState(
    project.dueDate ? project.dueDate.split("T")[0] : ""
  );

  const [updateProject, { loading, error }] = useMutation(UPDATE_PROJECT);

  useEffect(() => {
    setName(project.name);
    setDescription(project.description);
    setStatus(project.status);
    setDueDate(project.dueDate ? project.dueDate.split("T") : "");
  }, [project]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProject({
      variables: {
        projectId: parseInt(project.id, 10),
        name,
        description,
        status,
        dueDate: dueDate || null,
      },
    });
    onUpdated();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3 max-w-md mx-auto p-4 border rounded bg-white shadow"
    >
      <input
        type="text"
        className="w-full p-2 border rounded"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <textarea
        className="w-full p-2 border rounded"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <select
        className="w-full p-2 border rounded"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        required
      >
        <option value="ACTIVE">Active</option>
        <option value="COMPLETED">Completed</option>
        <option value="ON_HOLD">On Hold</option>
      </select>
      <input
        type="date"
        className="w-full p-2 border rounded"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />
      {error && <p className="text-red-600">{error.message}</p>}
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
};

export default UpdateProjectForm;
