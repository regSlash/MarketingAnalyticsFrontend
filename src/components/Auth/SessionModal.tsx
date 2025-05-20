import { useEffect } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

export default function SessionModal({ onConfirm }: { onConfirm: () => void }) {
  return (
    <Dialog open={true}>
      <DialogTitle>Session Timeout</DialogTitle>
      <DialogContent>
        Your session is about to expire. Do you want to stay logged in?
      </DialogContent>
      <DialogActions>
        <Button onClick={onConfirm} color="primary">
          Stay Logged In
        </Button>
      </DialogActions>
    </Dialog>
  );
}
