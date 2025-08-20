import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ApolloProvider } from "@apollo/client";
import client from "./apollo/client";
import "./index.css";
import "./styles.css";
import App from "./App";

import { loadDevMessages, loadErrorMessages } from "@apollo/client/dev";

if (import.meta.env.DEV) {
  loadDevMessages();
  loadErrorMessages();
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </StrictMode>
);
