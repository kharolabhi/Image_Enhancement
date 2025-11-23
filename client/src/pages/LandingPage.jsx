import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './LandingPage.css';

function LandingPage() {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/enhance');
  };

  return (
    <div className="landing-page">
      <motion.div 
        className="landing-content"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          Welcome to Image Enhancer
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          Breathe new life into your images with our AI-powered enhancement tools. 
          Adjust enhancement levels, switch between themes, and enjoy a seamless, 
          animated experience.
        </motion.p>
        <motion.button 
          className="button" 
          onClick={handleStart}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          Get Started
        </motion.button>
      </motion.div>

      <div className="features-section">
        <div className="feature-card">
          <div className="feature-icon ai-powered">✨</div>
          <h3>AI-Powered Enhancement</h3>
          <p>Utilize advanced artificial intelligence to bring out the best in your photos.</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon customizable">🎨</div>
          <h3>Customizable Settings</h3>
          <p>Fine-tune enhancement levels and apply unique filters to match your vision.</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon fast-processing">🚀</div>
          <h3>Blazing Fast Processing</h3>
          <p>Experience quick results with our optimized image processing engine.</p>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;