import React from "react";
import ReactDOM from "react-dom/client";
import { AuthContexProvider } from "./context/authContext";

import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ChakraProvider>
        <AuthContexProvider>
          <App />
        </AuthContexProvider>
      </ChakraProvider>
    </BrowserRouter>
  </React.StrictMode>
);
