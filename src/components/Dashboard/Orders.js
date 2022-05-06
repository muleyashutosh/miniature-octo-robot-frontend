import React, { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import Box from '@mui/material/Box';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import Title from './Title';
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import { useNavigate, useLocation } from 'react-router-dom'
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import LinearProgress from '@mui/material/LinearProgress';
import Paper from '@mui/material/Paper';



function preventDefault(event) {
  event.preventDefault();
}

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Orders(props) {
  const { transactionsUpdated, setTransactionsUpdated } = props.transactionsUpdated
  const [transactions, setTransactions] = useState([]);
  const [open, setOpen] = React.useState(false);
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const [updating, setUpdating] = useState(false)

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const deleteDocument = async (hash) => {

    try {
      let isMounted = true;
      const controller = new AbortController();
      const response = await axiosPrivate.delete(`/transactions/${hash}`, {
        signal: controller.signal,
      })
      console.log(response.data);
      isMounted && setTransactionsUpdated(!transactionsUpdated)
    } catch (err) {
      console.log(err)
      setOpen(true);
    }

  }

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    setUpdating(true)
    const getTransactions = async () => {
      try {
        const response = await axiosPrivate.get("/transactions", {
          signal: controller.signal
        })
        console.log(response.data);
        isMounted && setTransactions(response.data)

      } catch (err) {
        console.log(err)
        navigate('/', { state: { from: location }, replace: true })
      } finally {
        setUpdating(false)
      }
    }

    getTransactions();

    return () => {
      isMounted = false;
      controller.abort();
    }


  }, [transactionsUpdated, axiosPrivate, location, navigate])

  return (
    <React.Fragment>
      <Box sx={{ width: "100%" }}>
        {updating ? <LinearProgress /> : null}
      </Box>
      <Paper sx= {{ p: 2, display: 'flex', flexDirection: 'column' }}>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
            Server Error Occurred
          </Alert>
        </Snackbar>
        <Box sx={{ display: 'flex', justifyContent: "space-between" }}>
          <Title>Uploaded Documents</Title>
          <IconButton color="inherit" onClick={() => { setTransactionsUpdated(!transactionsUpdated) }}>
            <RefreshIcon />
          </IconButton>
        </Box>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell><b>Document Name</b></TableCell>
              <TableCell><b>Upload Date</b></TableCell>
              <TableCell><b>Hash Of File</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((row, id) => (
              <TableRow key={id}>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.timestamp}</TableCell>
                <TableCell>
                  <a href={`https://ipfs.io/ipfs/${row.hash}`} target={"_blank"}>
                    {row.hash.slice(0, 32)}
                  </a>
                </TableCell>
                <TableCell><IconButton onClick={() => { deleteDocument(row.hash) }}><DeleteIcon /></IconButton></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </React.Fragment>
  );
}
