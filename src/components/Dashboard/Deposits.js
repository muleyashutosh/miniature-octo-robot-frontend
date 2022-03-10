import * as React from 'react';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Title from './Title';
import Button from '@mui/material/Button';

function preventDefault(event) {
  event.preventDefault();
}

export default function Deposits() {
  return (
    <div>
      <Button variant="contained">Send File</Button>
      </div>
  );
}
