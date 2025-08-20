import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_PROJECT } from "../graphql/mutations";
import { GET_PROJECTS } from "../graphql/queries";

interface Props {
  orgSlug: string;
  onCreated?: () => void;
}

const CreateProjectForm: React.FC<Props> = ({ orgSlug, onCreated }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("ACTIVE");
  const [dueDate, setDueDate] = useState("");

  const [createProject, { loading, error }] = useMutation(CREATE_PROJECT, {
    refetchQueries: [{ query: GET_PROJECTS, variables: { orgSlug } }],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createProject({
      variables: {
        orgSlug,
        name,
        description,
        status,
        dueDate: dueDate || null,
      },
    });
    setName("");
    setDescription("");
    setStatus("ACTIVE");
    setDueDate("");
    if (onCreated) onCreated();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto mb-10 p-6 border rounded bg-white shadow"
    >
      <h2 className="text-2xl font-semibold mb-5">Create New Project</h2>
      <input
        className="w-full mb-4 p-2 border rounded"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <textarea
        className="w-full mb-4 p-2 border rounded resize-none"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <select
        className="w-full mb-4 p-2 border rounded"
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
        className="w-full mb-4 p-2 border rounded"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />
      {error && <p className="mb-4 text-red-600">{error.message}</p>}
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Creating..." : "Create Project"}
      </button>
    </form>
  );
};

export default CreateProjectForm;
