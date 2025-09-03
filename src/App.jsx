import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import TextAnalysis from "./pages/TextAnalysis";
import ImageAnalysis from "./pages/ImageAnalysis";
import VideoAnalysis from "./pages/VideoAnalysis";
import DocumentAnalysis from "./pages/DocumentAnalysis";
import ContentVerification from "./pages/ContentVerification";
import ModelTraining from "./pages/ModelTraining";
import Dashboard from "./pages/Dashboard";
import Privacy from "./pages/Privacy";
import About from "./pages/About";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="texto" element={<TextAnalysis />} />
        <Route path="imagen" element={<ImageAnalysis />} />
        <Route path="video" element={<VideoAnalysis />} />
        <Route path="documento" element={<DocumentAnalysis />} />
        <Route path="content-verification" element={<ContentVerification />} />
        <Route path="model-training" element={<ModelTraining />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="privacidad" element={<Privacy />} />
        <Route path="acerca-de" element={<About />} />
      </Route>
    </Routes>
  );
}

export default App;
