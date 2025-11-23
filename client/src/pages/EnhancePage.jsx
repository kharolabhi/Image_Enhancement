import React, { useState, useEffect } from 'react';
import { Download, Upload, Wand2, X, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';
import './EnhancePage.css';

const EnhancePage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [jobId, setJobId] = useState(null);
  const [processedImageUrl, setProcessedImageUrl] = useState(null);
  const [error, setError] = useState(null);
  const [enhancementLevel, setEnhancementLevel] = useState(50);
  const [psnr, setPsnr] = useState(null);
  const [mse, setMse] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setProcessedImageUrl(null);
      setError(null);
      setProgress(0);
      setJobId(null);
      setPsnr(null);
      setMse(null);
    }
  };

  const processImage = async () => {
    if (!selectedFile) {
      setError("Please upload an image first.");
      return;
    }

    setProcessing(true);
    setError(null);
    setPsnr(null);
    setMse(null);
    
    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('enhancementLevel', enhancementLevel);

    try {
      const response = await fetch('http://localhost:3001/start-processing', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to start processing');
      }

      const data = await response.json();
      setJobId(data.jobId);
    } catch (err) {
      setError('Failed to upload image: ' + err.message);
      setProcessing(false);
    }
  };

  const downloadImage = () => {
    if (!processedImageUrl) return;
    const link = document.createElement('a');
    link.href = processedImageUrl;
    link.download = 'enhanced-image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setProcessedImageUrl(null);
    setError(null);
    setProgress(0);
    setJobId(null);
    setPsnr(null);
    setMse(null);
  };

  useEffect(() => {
    let pollInterval;

    const checkProgress = async () => {
      if (!jobId) return;

      try {
        const progressResponse = await fetch(`http://localhost:3001/progress/${jobId}`);
        const progressData = await progressResponse.json();

        if (progressData.error) {
          setError(progressData.error);
          setProcessing(false);
          clearInterval(pollInterval);
          return;
        }

        setProgress(progressData.progress);

        if (progressData.status === 'completed') {
          setProcessing(false);
          clearInterval(pollInterval);
          
          const resultResponse = await fetch(`http://localhost:3001/result/${jobId}`);
          const resultData = await resultResponse.json();

          setProcessedImageUrl(`http://localhost:3001${resultData.imageUrl}`);
          setPsnr(resultData.psnr);
          setMse(resultData.mse);

        } else if (progressData.status === 'failed') {
          setError(progressData.error || 'Processing failed');
          setProcessing(false);
          clearInterval(pollInterval);
        }
      } catch (err) {
        setError('Failed to check progress: ' + err.message);
        setProcessing(false);
        clearInterval(pollInterval);
      }
    };

    if (jobId && processing) {
      checkProgress();
      pollInterval = setInterval(checkProgress, 1000);
    }

    return () => {
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, [jobId, processing]);

  return (
    <motion.div
      className="enhance-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="dashboard">
        <motion.div 
          className="controls-panel"
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div className="panel-header">
            <h3>Controls</h3>
          </div>
          <div className="panel-content">
            <div className="upload-controls">
              <label htmlFor="file-upload" className="button">
                <Upload size={20} />
                <span>Select Image</span>
              </label>
              <input 
                id="file-upload"
                type="file" 
                onChange={handleImageUpload} 
                accept="image/*"
                disabled={processing}
                style={{ display: 'none' }}
              />
              {selectedFile && (
                <button 
                  className="button clear-button" 
                  onClick={clearSelection}
                  disabled={processing}
                >
                  <X size={20} />
                  <span>Clear</span>
                </button>
              )}
            </div>

            <AnimatePresence>
              {selectedFile && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                >
                  <div className="enhancement-slider">
                    <label>Enhancement Level: {enhancementLevel}%</label>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={enhancementLevel}
                      onChange={(e) => setEnhancementLevel(e.target.value)}
                      disabled={processing}
                    />
                  </div>
                  <button 
                    className="button process-button" 
                    onClick={processImage}
                    disabled={!selectedFile || processing}
                  >
                    <Wand2 size={20} />
                    <span>{processing ? 'Processing...' : 'Enhance Image'}</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {error && (
              <motion.div 
                className="error-message"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {error}
              </motion.div>
            )}
          </div>
        </motion.div>

        <motion.div 
          className="image-panel"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
        >
          <AnimatePresence>
            {!previewUrl ? (
              <motion.div 
                className="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <ImageIcon size={64} strokeWidth={1} />
                <p>Your enhanced image will appear here</p>
              </motion.div>
            ) : (
              <motion.div 
                className="image-display"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {processedImageUrl ? (
                  <>
                    <ReactCompareSlider
                      itemOne={<ReactCompareSliderImage src={previewUrl} alt="Original" />}
                      itemTwo={<ReactCompareSliderImage src={processedImageUrl} alt="Processed" />}
                    />
                    <motion.div 
                      className="metrics-panel"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <div className="metric-item">
                        <h4>PSNR</h4>
                        <p>{psnr ? psnr.toFixed(2) : 'N/A'} dB</p>
                      </div>
                      <div className="metric-item">
                        <h4>MSE</h4>
                        <p>{mse ? mse.toFixed(2) : 'N/A'}</p>
                      </div>
                    </motion.div>
                  </>
                ) : (
                  <div className="image-holder">
                    <img src={previewUrl} alt="Original" />
                  </div>
                )}

                {processing && (
                  <div className="progress-overlay">
                    <div className="progress-bar">
                      <motion.div 
                        className="progress-fill"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                    <span className="progress-text">{progress}%</span>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
          {processedImageUrl && (
            <motion.div
              className="download-fab"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={downloadImage}
            >
              <Download size={24} />
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default EnhancePage;