import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Typography from "@mui/material/Typography";
import { deleteSession } from "../lib/store";

export default function DeleteSessionDialog({ open, session, onClose }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <Box sx={{ p: 2 }}>
        <Typography variant="h6">Delete Session?</Typography>
        <Typography>Are you sure you want to delete {session.name}?</Typography>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          color="error"
          sx={{ textAlign: "right" }}
          onClick={async () => {
            await deleteSession(session.id);
            onClose();
          }}
        >
          Delete
        </Button>
      </Box>
    </Dialog>
  );
}
