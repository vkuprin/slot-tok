import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import MainContent from "./components/MainContent";
import Providers from "./components/Providers";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Providers>
      <MainContent />
    </Providers>
  </StrictMode>,
);
