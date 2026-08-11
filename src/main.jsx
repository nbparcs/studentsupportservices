import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ResultsProvider } from "./Context/ResultsContext.jsx";

import { BrowserRouter } from "react-router-dom";
import { StudyProvider } from "./Context/StudyContext.jsx";
import { TaskProvider } from "./Context/TaskContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <StudyProvider>
        <TaskProvider>
          <ResultsProvider>
            <App />
          </ResultsProvider>
        </TaskProvider>
      </StudyProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
