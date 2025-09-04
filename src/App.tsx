import { Routes, Route } from "react-router-dom";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import TextAnalysis from "@/pages/TextAnalysis";
import ImageAnalysis from "@/pages/ImageAnalysis";
import VideoAnalysis from "@/pages/VideoAnalysis";
import DocumentAnalysis from "@/pages/DocumentAnalysis";
import Dashboard from "@/pages/Dashboard";
import Privacy from "@/pages/Privacy";
import About from "@/pages/About";
import NotFound from "@/pages/NotFound";

function App() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-50"
    >
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/text" element={<TextAnalysis />} />
          <Route path="/image" element={<ImageAnalysis />} />
          <Route path="/video" element={<VideoAnalysis />} />
          <Route path="/document" element={<DocumentAnalysis />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </motion.div>
  );
}

export default App;
