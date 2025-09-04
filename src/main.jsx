import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { DatabaseService } from "./config/firebase.js";

// Inicializar Firebase (con manejo de errores)
try {
  DatabaseService.initializeAuth();
} catch (error) {
  console.warn('Firebase initialization warning:', error);
  // Continuar sin Firebase para que la app funcione
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#363636",
            color: "#fff",
          },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
);
