import { useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import Button from '@mui/material/Button';
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import CircularProgress from '@mui/material/CircularProgress';



import "./styles.css";
import Title from "./Title";

const fileTypes = ["JPG", "JPEG", "PNG", "GIF", "PDF"];

export default function Dnd(props) {
  const axiosPrivate = useAxiosPrivate();
  // console.log(props)
  const { transactionsUpdated, setTransactionsUpdated } = props.transactionsUpdated
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false)

  const handleChange = (file) => {
    console.log(file)
    if (file)
      setFile(file);
  };

  const uploadDocument = async () => {

    const formData = new FormData()
    console.log(file)
    formData.append("doc", file)
    const controller = new AbortController();
    setUploading(true)
    try {
      const response = await axiosPrivate.post("/transactions", formData, {
        signal: controller.signal,
        headers: {
          "Content-Type": 'multipart/form-data'
        },
      })
      console.log(response.data);
      setTransactionsUpdated(response.data ? !transactionsUpdated : !transactionsUpdated);
      setFile(null);
      

    } catch (err) {
      console.log(err)
    } finally {
      setUploading(false)
    }
  }
  return (
    <div className="App">
      <Title>Upload new document</Title>
      <div className="dndBody">
        <div className="uploaderBody">
          <FileUploader
            handleChange={handleChange}
            name="file"
            types={fileTypes}
          />
          <span>{file ? `File name: ${file.name}` : "no files uploaded yet"}</span>
        </div>
        <div className="uploadButton">
          {uploading ? (<CircularProgress />) : (<Button variant="contained" onClick={uploadDocument} disabled={!file ? true : false}>Upload</Button>)}
        </div>
      </div>
    </div>
  );
}
