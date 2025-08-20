import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { UPDATE_TASK } from "../graphql/mutations";

interface Props {
  task: {
    id: string;
    title: string;
    description: string;
    status: string;
    assigneeEmail?: string | null;
    dueDate?: string | null;
  };
  onUpdated: () => void;
  onCancel: () => void;
}

const UpdateTaskForm: React.FC<Props> = ({ task, onUpdated, onCancel }) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [status, setStatus] = useState(task.status);
  const [assigneeEmail, setAssigneeEmail] = useState(task.assigneeEmail || "");
  const [dueDate, setDueDate] = useState(
    task.dueDate ? task.dueDate.split("T")[0] : ""
  );

  const [updateTask, { loading, error }] = useMutation(UPDATE_TASK);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateTask({
      variables: {
        taskId: parseInt(task.id, 10),
        title,
        description,
        status,
        assigneeEmail: assigneeEmail || null,
        dueDate: dueDate || null,
      },
    });
    onUpdated();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="text"
        className="w-full p-2 border rounded"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
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
        <option value="TODO">To Do</option>
        <option value="IN_PROGRESS">In Progress</option>
        <option value="DONE">Done</option>
      </select>
      <input
        type="email"
        className="w-full p-2 border rounded"
        placeholder="Assignee Email"
        value={assigneeEmail}
        onChange={(e) => setAssigneeEmail(e.target.value)}
      />
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
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
};

export default UpdateTaskForm;
