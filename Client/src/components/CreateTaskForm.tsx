import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_TASK } from "../graphql/mutations";
import { GET_TASKS } from "../graphql/queries";

interface Props {
  projectId: string;
  onCreated?: () => void;
}

const CreateTaskForm: React.FC<Props> = ({ projectId, onCreated }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("TODO");
  const [assigneeEmail, setAssigneeEmail] = useState("");
  const [dueDate, setDueDate] = useState("");

  const [createTask, { loading, error }] = useMutation(CREATE_TASK, {
    refetchQueries: [
      { query: GET_TASKS, variables: { projectId: parseInt(projectId, 10) } },
    ],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createTask({
      variables: {
        projectId: parseInt(projectId, 10),
        title,
        description,
        status,
        assigneeEmail: assigneeEmail || null,
        dueDate: dueDate || null,
      },
    });
    setTitle("");
    setDescription("");
    setStatus("TODO");
    setAssigneeEmail("");
    setDueDate("");
    if (onCreated) onCreated();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto p-6 border rounded bg-white shadow"
    >
      <h2 className="text-xl font-semibold mb-4">Create New Task</h2>
      <input
        className="w-full mb-4 p-2 border rounded"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
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
        <option value="TODO">To Do</option>
        <option value="IN_PROGRESS">In Progress</option>
        <option value="DONE">Done</option>
      </select>
      <input
        type="email"
        className="w-full mb-4 p-2 border rounded"
        placeholder="Assignee Email"
        value={assigneeEmail}
        onChange={(e) => setAssigneeEmail(e.target.value)}
      />
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
        className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700 disabled:opacity-50"
      >
        {loading ? "Creating..." : "Create Task"}
      </button>
    </form>
  );
};

export default CreateTaskForm;
