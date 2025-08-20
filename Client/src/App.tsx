import React, { useState } from "react";
import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  HttpLink,
} from "@apollo/client";
import CreateOrganizationForm from "./components/CreateOrganizationForm";
import ProjectList from "./components/ProjectList";
import CreateProjectForm from "./components/CreateProjectForm";
import TaskList from "./components/TaskList";
import CreateTaskForm from "./components/CreateTaskForm";
import type { Organization } from "./interfaces/types";

const client = new ApolloClient({
  link: new HttpLink({
    uri: "http://localhost:8000/graphql/", // Adjust to your backend URL
    credentials: "include", // Important if using cookies, CSRF, etc.
  }),
  cache: new InMemoryCache(),
});

const App: React.FC = () => {
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );
  const [refreshOrgs, setRefreshOrgs] = useState(0);
  const [refreshProjects, setRefreshProjects] = useState(0);

  return (
    <ApolloProvider client={client}>
      <div className="min-h-screen bg-gray-100 p-6">
        <h1 className="text-4xl font-bold mb-6 text-center">
          Mini Project Management
        </h1>

        {/* Create Organization */}
        <section className="mb-8 max-w-md mx-auto">
          <CreateOrganizationForm
            onCreated={() => {
              setSelectedOrg(null);
              setSelectedProjectId(null);
              setRefreshOrgs((c) => c + 1);
            }}
          />
        </section>

        {/* List Organizations */}
        <section className="mb-8 max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4">Organizations</h2>
          {/* Simple org fetch and selection */}
          <OrganizationsList
            refreshCounter={refreshOrgs}
            onSelectOrg={(org) => {
              setSelectedOrg(org);
              setSelectedProjectId(null);
              setRefreshProjects((c) => c + 1);
            }}
            selectedOrgSlug={selectedOrg?.slug}
          />
        </section>

        {selectedOrg && (
          <>
            {/* Create Project Form */}
            <section className="mb-8 max-w-lg mx-auto">
              <CreateProjectForm
                orgSlug={selectedOrg.slug}
                onCreated={() => setRefreshProjects((c) => c + 1)}
              />
            </section>

            {/* Project List */}
            <section className="mb-8 max-w-4xl mx-auto">
              <ProjectList
                orgSlug={selectedOrg.slug}
                onSelectProject={(projectId) => setSelectedProjectId(projectId)}
                key={refreshProjects} // re-query projects on refresh
              />
            </section>
          </>
        )}

        {selectedProjectId && (
          <>
            {/* Task Creation */}
            <section className="mb-8 max-w-lg mx-auto">
              <CreateTaskForm
                projectId={selectedProjectId}
                onCreated={
                  () => {} /* optionally trigger a refetch or state update */
                }
              />
            </section>

            {/* Task List */}
            <section className="max-w-4xl mx-auto">
              <TaskList projectId={selectedProjectId} />
            </section>
          </>
        )}
      </div>
    </ApolloProvider>
  );
};

export default App;

// Helper component to fetch and show organizations with selection
import { useQuery } from "@apollo/client";
import { GET_ORGANIZATIONS } from "./graphql/queries";

interface OrganizationsListProps {
  refreshCounter: number;
  onSelectOrg: (org: Organization) => void;
  selectedOrgSlug?: string | null;
}

const OrganizationsList: React.FC<OrganizationsListProps> = ({
  refreshCounter,
  onSelectOrg,
  selectedOrgSlug,
}) => {
  const { loading, error, data, refetch } = useQuery(GET_ORGANIZATIONS, {
    fetchPolicy: "network-only",
  });

  React.useEffect(() => {
    refetch();
  }, [refreshCounter, refetch]);

  if (loading) return <p>Loading organizations...</p>;
  if (error)
    return (
      <p className="text-red-600">
        Error loading organizations: {error.message}
      </p>
    );

  const organizations: Organization[] = data.organizations || [];

  return (
    <ul className="max-w-md mx-auto space-y-2">
      {organizations.length === 0 && <p>No organizations found.</p>}
      {organizations.map((org) => (
        <li
          key={org.id}
          className={`cursor-pointer p-3 rounded border ${
            org.slug === selectedOrgSlug
              ? "bg-blue-200 border-blue-400"
              : "hover:bg-gray-200"
          }`}
          onClick={() => onSelectOrg(org)}
        >
          <strong>{org.name}</strong> ({org.slug}) — {org.contactEmail}
        </li>
      ))}
    </ul>
  );
};
