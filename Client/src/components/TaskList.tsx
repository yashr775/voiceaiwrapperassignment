import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_TASKS } from "../graphql/queries";
import UpdateTaskForm from "./UpdateTaskForm";
import AddCommentForm from "./AddCommentForm";
import type { Task, Comment } from "../interfaces/types";

interface TaskListProps {
  projectId: string;
}

const TaskList: React.FC<TaskListProps> = ({ projectId }) => {
  const { loading, error, data, refetch } = useQuery(GET_TASKS, {
    variables: { projectId: parseInt(projectId, 10) },
    fetchPolicy: "cache-and-network",
  });

  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  if (loading) return <p>Loading tasks...</p>;
  if (error) return <p className="text-red-600">Error: {error.message}</p>;

  const tasks: Task[] = data.projectTasks;

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-6">Tasks</h2>
      {tasks.length === 0 && <p>No tasks found.</p>}

      <ul className="space-y-6">
        {tasks.map((task) => (
          <li key={task.id} className="border p-4 rounded shadow-sm">
            {editingTaskId === task.id ? (
              <UpdateTaskForm
                task={task}
                onUpdated={() => {
                  setEditingTaskId(null);
                  refetch();
                }}
                onCancel={() => setEditingTaskId(null)}
              />
            ) : (
              <>
                <h3 className="text-xl font-semibold">{task.title}</h3>
                <p className="text-gray-700">{task.description}</p>
                <p className="mt-1 text-sm">
                  Status: <span className="font-bold">{task.status}</span> |
                  Assignee: {task.assigneeEmail ?? "N/A"} | Due:{" "}
                  {task.dueDate ?? "N/A"}
                </p>
                <button
                  className="mt-2 px-3 py-1 bg-yellow-400 rounded hover:bg-yellow-500"
                  onClick={() => setEditingTaskId(task.id)}
                >
                  Edit Task
                </button>
              </>
            )}

            <div className="mt-4 border-t pt-3">
              <h4 className="font-semibold mb-2">Comments</h4>
              {task.comments.length === 0 ? (
                <p className="text-gray-500">No comments yet.</p>
              ) : (
                <ul className="space-y-2 max-h-48 overflow-y-auto">
                  {task.comments.map((comment: Comment) => (
                    <li key={comment.id} className="bg-gray-100 rounded p-2">
                      <p>{comment.content}</p>
                      <p className="text-xs text-gray-500">
                        {comment.authorEmail} -{" "}
                        {new Date(comment.timestamp).toLocaleString()}
                      </p>
                    </li>
                  ))}
                </ul>
              )}

              <AddCommentForm
                taskId={task.id}
                onCommentAdded={() => refetch()}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
