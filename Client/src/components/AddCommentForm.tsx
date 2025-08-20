import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { ADD_COMMENT } from "../graphql/mutations";

interface Props {
  taskId: string;
  onCommentAdded: () => void;
}

const AddCommentForm: React.FC<Props> = ({ taskId, onCommentAdded }) => {
  const [content, setContent] = useState("");
  const [authorEmail, setAuthorEmail] = useState("");
  const [addComment, { loading, error }] = useMutation(ADD_COMMENT);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !authorEmail.trim()) return;
    await addComment({
      variables: { taskId: parseInt(taskId, 10), content, authorEmail },
    });
    setContent("");
    setAuthorEmail("");
    onCommentAdded();
  };

  return (
    <form onSubmit={handleSubmit} className="mt-3 space-y-2">
      <textarea
        className="w-full p-2 border rounded resize-none"
        rows={2}
        placeholder="Add a comment..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />
      <input
        type="email"
        className="w-full p-2 border rounded"
        placeholder="Your email"
        value={authorEmail}
        onChange={(e) => setAuthorEmail(e.target.value)}
        required
      />
      {error && <p className="text-red-600">{error.message}</p>}
      <button
        type="submit"
        disabled={loading}
        className="bg-indigo-600 text-white px-4 py-1 rounded hover:bg-indigo-700 disabled:opacity-50"
      >
        {loading ? "Adding..." : "Add Comment"}
      </button>
    </form>
  );
};

export default AddCommentForm;
