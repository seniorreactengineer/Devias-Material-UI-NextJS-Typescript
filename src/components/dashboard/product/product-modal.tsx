import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 700,
  height: 700,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  overflow: "auto",
};

interface ProductModalProps {
    open: boolean;
    setOpen: (boolean) => void;
    submittedData: any
}

export default function ProductModal({open, setOpen, submittedData}: ProductModalProps) {
  const handleClose = () => setOpen(false);

  return (
    <Box>
      <Modal
        keepMounted
        open={open}
        onClose={handleClose}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <Box sx={style}>
            <pre>
                {JSON.stringify(submittedData, null, 2)}
            </pre>
        </Box>
      </Modal>
    </Box>
  );
}