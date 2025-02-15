import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      <div className="flex gap-8 mb-8">
        <a
          href="https://vite.dev"
          target="_blank"
          className="hover:scale-110 transition-transform"
        >
          <img src={viteLogo} className="h-24 w-24" alt="Vite logo" />
        </a>
        <a
          href="https://react.dev"
          target="_blank"
          className="hover:scale-110 transition-transform"
        >
          <img
            src={reactLogo}
            className="h-24 w-24 animate-spin-slow"
            alt="React logo"
          />
        </a>
      </div>

      <h1 className="text-4xl font-bold text-white mb-8">
        Vite + React + Tailwind
      </h1>

      <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
        <button
          onClick={() => setCount((count) => count + 1)}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg
                     transition-colors mb-4"
        >
          count is {count}
        </button>

        <p className="text-gray-300 text-center">
          Edit{" "}
          <code className="bg-gray-700 px-2 py-1 rounded">src/App.tsx</code>
          and save to test HMR
        </p>
      </div>

      <p className="text-gray-400 mt-8 text-sm">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  );
}

export default App;
