import * as React from 'react';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Title from './Title';

// Generate Order Data
function createData(id,name, date, hash) {
  return { id,name, date, hash };
}

const rows = [
  createData(
    0,
    'My Profile',
    '17|08|2021',
    '1#tpkc6smj08ygeihcwiojow9u20397eyqwd',

  ),
];

function preventDefault(event) {
  event.preventDefault();
}

export default function Orders() {
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
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.date}</TableCell>
              <TableCell>{row.hash}</TableCell>
              <TableCell><IconButton><DeleteIcon/></IconButton></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Link color="primary" href="#" onClick={preventDefault} sx={{ mt: 3 }}>
        See more documents
      </Link>
    </React.Fragment>
  );
}
