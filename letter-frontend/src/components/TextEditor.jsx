"use client";

import { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const TextEditor = () => {
  const [letter, setLetter] = useState('');

  const handleSaveDraft = () => {
    // Save draft to the database (implement later)
    console.log('Draft saved:', letter);
  };

  return (
    <div>
      <ReactQuill value={letter} onChange={setLetter} />
      <button onClick={handleSaveDraft}>Save Draft</button>
    </div>
  );
};

export default TextEditor;
