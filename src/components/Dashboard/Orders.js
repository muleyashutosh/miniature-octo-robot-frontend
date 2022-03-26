import React, {useState, useEffect} from 'react';
// import {Link} from 'react-router-dom';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Title from './Title';
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import { useNavigate, useLocation } from 'react-router-dom'


function preventDefault(event) {
  event.preventDefault();
}

export default function Orders({transactionsUpdated}) {
  const [transactions, setTransactions] = useState([]);
  const axiosPrivate = useAxiosPrivate();
  const navigage = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getTransactions = async () => {
      try {
        const response = await axiosPrivate.get("/transactions", {
          signal: controller.signal
        })
        console.log(response.data);
        isMounted && setTransactions(response.data)
        console.log(response.data);

      } catch (err) {
        console.log(err)
        navigage('/', { state: { from: location }, replace: true })
      }
    }

    getTransactions();

    return () => {
      isMounted = false;
      controller.abort();
    }


  }, [transactionsUpdated])

  return (
    <React.Fragment>
      <Title>Uploaded Documents</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell><b>Document Name</b></TableCell>
            <TableCell><b>Upload Date</b></TableCell>
            <TableCell><b>Hash Of File</b></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.timestamp}</TableCell>
              <TableCell>
                <a href={`https://ipfs.io/ipfs/${row.hash}`} target={"_blank"}>
                  {row.hash.slice(0,32)}
                  </a>
              </TableCell>
              <TableCell><IconButton><DeleteIcon/></IconButton></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {/* <Link color="primary" href="#" onClick={preventDefault} sx={{ mt: 3 }}>
        See more documents
      </Link> */}
    </React.Fragment>
  );
}
