import { gql } from "@apollo/client";

export const GET_ORGANIZATIONS = gql`
  query {
    organizations {  # You will need to add this query in your backend if missing
      id
      name
      slug
      contactEmail
    }
  }
`;

export const GET_PROJECTS = gql`
  query OrganizationProjects($orgSlug: String!) {
    organizationProjects(orgSlug: $orgSlug) {
      id
      name
      description
      status
      dueDate
      taskCount
      completedTasks
    }
  }
`;

export const GET_TASKS = gql`
  query ProjectTasks($projectId: Int!) {
    projectTasks(projectId: $projectId) {
      id
      title
      description
      status
      assigneeEmail
      dueDate
      comments {
        id
        content
        authorEmail
        timestamp
      }
    }
  }
`;
