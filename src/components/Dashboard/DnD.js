import { useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import Button from '@mui/material/Button';
import useAxiosPrivate from '../../hooks/useAxiosPrivate'


import "./styles.css";

const fileTypes = ["JPEG", "PNG", "GIF"];

export default function Dnd(props) {
  const axiosPrivate = useAxiosPrivate();
  // console.log(props)
  const { transactionsUpdated, setTransactionsUpdated } = props.transactionsUpdated
  const [file, setFile] = useState(null);

  const handleChange = (file) => {
    setFile(file);
  };

  const uploadDocument = async () => {

    const formData = new FormData()
    console.log(file)
    formData.append("doc", file)
    const controller = new AbortController();

    try {
      const response = await axiosPrivate.post("/transactions", formData, {
        signal: controller.signal,
        headers: {
          "Content-Type": 'multipart/form-data'
        },
      })
      console.log(response.data);
      setTransactionsUpdated(!transactionsUpdated);
      // setFile(null);

    } catch (err) {
      console.log(err)

    }
  }
  return (
    <div className="App">
      <h1>Upload new document</h1>
      <FileUploader
        handleChange={handleChange}
        name="file"
        types={fileTypes}
      />
      <span>{file ? `File name: ${file.name}` : "no files uploaded yet"}</span>
      <Button variant="contained" onClick={uploadDocument}>Upload</Button>
    </div>
  );
}
