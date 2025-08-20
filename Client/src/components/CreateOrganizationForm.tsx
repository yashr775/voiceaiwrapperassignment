/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_ORGANIZATION } from "../graphql/mutations";

interface Props {
  onCreated?: () => void;
}

const CreateOrganizationForm: React.FC<Props> = ({ onCreated }) => {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [createOrg, { loading, error }] = useMutation(CREATE_ORGANIZATION);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createOrg({
        variables: { name, slug, contactEmail },
      });
      setName("");
      setSlug("");
      setContactEmail("");
      if (onCreated) onCreated();
    } catch (err: any) {
      alert(`Error creating organization: ${err.message || "Unknown error"}`);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-6 border rounded bg-white shadow"
    >
      <h2 className="text-xl font-semibold mb-4">Create Organization</h2>
      <input
        className="w-full mb-3 p-2 border rounded"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        className="w-full mb-3 p-2 border rounded"
        placeholder="Slug (lowercase, numbers, hyphens)"
        value={slug}
        onChange={(e) => setSlug(e.target.value)}
        pattern="^[a-z0-9\-]+$"
        title="Lowercase letters, numbers and hyphens only"
        required
      />
      <input
        type="email"
        className="w-full mb-3 p-2 border rounded"
        placeholder="Contact Email"
        value={contactEmail}
        onChange={(e) => setContactEmail(e.target.value)}
        required
      />
      {error && <p className="mb-3 text-red-600">{error.message}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50"
      >
        {loading ? "Creating..." : "Create Organization"}
      </button>
    </form>
  );
};

export default CreateOrganizationForm;
