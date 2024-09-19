// PdfTextExtractor.js
import React, { useState, useEffect } from 'react';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist/build/pdf';
import { version } from 'pdfjs-dist/build/pdf';

const PdfTextExtractor = () => {
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);

  useEffect(() => {
    // Set the worker source
    GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${version}/pdf.worker.min.js`;
  }, []);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const extractText = async () => {
    if (!file) return;

    const fileReader = new FileReader();
    fileReader.onload = async (event) => {
      const typedArray = new Uint8Array(event.target.result);
      const pdf = await getDocument(typedArray).promise;

      let extractedText = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const textItems = content.items.map((item) => item.str);
        extractedText += textItems.join(' ') + '\n';
      }

      setText(extractedText);
    };

    fileReader.readAsArrayBuffer(file);
  };

  return (
    <div>
      <h1>PDF Text Extractor</h1>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      <button onClick={extractText}>Extract Text</button>
      <h2>Extracted Text:</h2>
      <pre>{text}</pre>
    </div>
  );
};

export default PdfTextExtractor;
