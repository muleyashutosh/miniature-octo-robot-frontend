import { useState } from "react";
import { FileUploader } from "react-drag-drop-files";

import "./styles.css";

const fileTypes = ["JPEG", "PNG", "GIF"];

export default function Dnd() {
  const [file, setFile] = useState(null);
  const handleChange = (file) => {
    setFile(file);
  };
  return (
    <div className="App">
      <h1>Upload new document</h1>
      <FileUploader
        multiple={true}
        handleChange={handleChange}
        name="file"
        types={fileTypes}
      />
      <p>{file ? `File name: ${file.name}` : "no files uploaded yet"}</p>
    </div>
  );
}
