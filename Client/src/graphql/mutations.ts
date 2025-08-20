import { gql } from "@apollo/client";

export const CREATE_ORGANIZATION = gql`
  mutation CreateOrganization($name: String!, $slug: String!, $contactEmail: String!) {
    createOrganization(name: $name, slug: $slug, contactEmail: $contactEmail) {
      organization {
        id
        name
        slug
      }
    }
  }
`;

export const CREATE_PROJECT = gql`
  mutation CreateProject(
    $orgSlug: String!
    $name: String!
    $description: String
    $status: String!
    $dueDate: Date
  ) {
    createProject(
      orgSlug: $orgSlug
      name: $name
      description: $description
      status: $status
      dueDate: $dueDate
    ) {
      project {
        id
        name
        status
      }
    }
  }
`;

export const UPDATE_PROJECT = gql`
  mutation UpdateProject(
    $projectId: Int!
    $name: String!
    $description: String
    $status: String!
    $dueDate: Date
  ) {
    updateProject(
      projectId: $projectId
      name: $name
      description: $description
      status: $status
      dueDate: $dueDate
    ) {
      project {
        id
        name
        status
        description
        dueDate
      }
    }
  }
`;

export const CREATE_TASK = gql`
  mutation CreateTask(
    $projectId: Int!
    $title: String!
    $description: String
    $status: String!
    $assigneeEmail: String
    $dueDate: DateTime
  ) {
    createTask(
      projectId: $projectId
      title: $title
      description: $description
      status: $status
      assigneeEmail: $assigneeEmail
      dueDate: $dueDate
    ) {
      task {
        id
        title
        status
      }
    }
  }
`;

export const UPDATE_TASK = gql`
  mutation UpdateTask(
    $taskId: Int!
    $title: String!
    $description: String
    $status: String!
    $assigneeEmail: String
    $dueDate: DateTime
  ) {
    updateTask(
      taskId: $taskId
      title: $title
      description: $description
      status: $status
      assigneeEmail: $assigneeEmail
      dueDate: $dueDate
    ) {
      task {
        id
        title
        status
        description
        assigneeEmail
        dueDate
      }
    }
  }
`;

export const ADD_COMMENT = gql`
  mutation AddComment($taskId: Int!, $content: String!, $authorEmail: String!) {
    addComment(taskId: $taskId, content: $content, authorEmail: $authorEmail) {
      comment {
        id
        content
        authorEmail
        timestamp
      }
    }
  }
`;
