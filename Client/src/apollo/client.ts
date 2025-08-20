import { ApolloClient, InMemoryCache, HttpLink, from, ApolloLink } from "@apollo/client";

function getCookie(name: string) {
  let cookieValue: string | null = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.startsWith(name + "=")) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

const csrfMiddleware = new ApolloLink((operation, forward) => {
  const csrfToken = getCookie("csrftoken");
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      "X-CSRFToken": csrfToken || "",
    },
  }));
  return forward(operation);
});

const httpLink = new HttpLink({
  uri: import.meta.env.VITE_GRAPHQL_ENDPOINT || "http://localhost:8000/graphql/",
  credentials: "include", // Send cookies with requests
});

const client = new ApolloClient({
  link: from([csrfMiddleware, httpLink]),
  cache: new InMemoryCache(),
});

export default client;
