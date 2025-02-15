import React from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UseGameProvider } from "./hooks/game/useGameProvider";
import MainContent from "./components/layout/MainContent";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import "./globals.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <UseGameProvider>
        <QueryErrorResetBoundary>
          {({ reset }) => (
            <ErrorBoundary
              fallback={
                <div className="min-h-screen flex items-center justify-center bg-gray-900">
                  <div className="text-center p-8 bg-gray-800 rounded-lg">
                    <h1 className="text-xl text-red-500 mb-4">
                      Something went wrong
                    </h1>
                    <button
                      className="px-4 py-2 bg-blue-500 text-white rounded"
                      onClick={reset}
                    >
                      Try again
                    </button>
                  </div>
                </div>
              }
            >
              <MainContent />
            </ErrorBoundary>
          )}
        </QueryErrorResetBoundary>
      </UseGameProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
