import React, { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import Box from "@mui/material/Box";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import RefreshIcon from "@mui/icons-material/Refresh";
import Title from "./Dashboard/Title";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import LinearProgress from "@mui/material/LinearProgress";
import Paper from "@mui/material/Paper";
import MuiAlert from '@mui/material/Alert'
import DownloadIcon from "@mui/icons-material/Download";
import download from 'downloadjs'

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Received = () => {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const [updating, setUpdating] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [documentsUpdated, setDocumentsUpdated] = useState(false);


   const handleClose = (event, reason) => {
     if (reason === "clickaway") {
       return;
     }

     setOpen(false);
   };

   const downloadDocument = async (hash, name) => {
     try {
      //  let isMounted = true;
       const controller = new AbortController();
       const response = await axiosPrivate.get(`/transactions/${hash}`, {
         signal: controller.signal,
         responseType: "blob",
       });
       console.log(response.data);
       download(response.data, name)
      //  isMounted && setDocumentsUpdated(!documentsUpdated);
     } catch (err) {
       console.log(err);
     }
   };


  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    setUpdating(true);
    const getTransactions = async () => {
      try {
        const response = await axiosPrivate.get("/shared", {
          signal: controller.signal,
        });
        console.log(response.data);
        isMounted && setDocuments(response.data);
      } catch (err) {
        console.log(err);
        navigate("/", { state: { from: location }, replace: true });
      } finally {
        setUpdating(false);
      }
    };

    getTransactions();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [documentsUpdated, axiosPrivate, location, navigate]);

  return (
    <React.Fragment>
      <Box sx={{ width: "100%" }}>{updating ? <LinearProgress /> : null}</Box>
      <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
            Server Error Occurred
          </Alert>
        </Snackbar>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Title>Received Documents</Title>
          <IconButton
            color="inherit"
            onClick={() => {
              setDocumentsUpdated(!documentsUpdated);
            }}
          >
            <RefreshIcon />
          </IconButton>
        </Box>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>
                <b>Document Name</b>
              </TableCell>
              <TableCell>
                <b>Upload Date</b>
              </TableCell>
              <TableCell>
                <b>Hash Of File</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {documents.map((row, id) => (
              <TableRow key={id}>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.timestamp}</TableCell>
                <TableCell>
                  <a
                    href={`https://ipfs.io/ipfs/${row.hash}`}
                    target={"_blank"}
                    rel={`noreferrer`}
                  >
                    {row.hash.slice(0, 32)}
                  </a>
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => {
                      downloadDocument(row.hash, row.name);
                    }}
                  >
                    <DownloadIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </React.Fragment>
  );
};

export default Received;
