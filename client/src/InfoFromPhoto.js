import React, { useState } from 'react';
import Tesseract from 'tesseract.js';
import cv from 'opencv.js';

const OCRUploader = ({ setInfoText }) => {
  const [processing, setProcessing] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    

    setProcessing(true);

    const extractISBN = (text) => {
        const regex = /ISBN\s([\d-]{13,17})/; // Match "ISBN" followed by 13 or 17 characters (digits or dashes)
        const match = text.match(regex);  // Apply regex to the text
        console.log(match);
        return match ? match[1].replace(/-/g, '') : null;   
      };

    Tesseract.recognize( file, 'eng', { logger: (m) => console.log(m), tessedit_char_whitelist: '0123456789', psm: 7, } )
      .then(({ data: { text } }) => {
        // Convert extracted text to JSON
        const result = { extractedText: text };
        console.log(result);
        setInfoText(extractISBN(result.extractedText));
      })
      .catch((err) => { console.error("Error processing image:", err);})
      .finally(() => { setProcessing(false); });
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '10px' }}>
      
      <input
        id="file-input"
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileUpload} />

        <button onClick={() => document.getElementById('file-input').click()}
        disabled={processing}>
          {processing ? "Processing..." : "Scan ISBN From Photo"}
        </button>
    </div>
  );
};

export default OCRUploader;
