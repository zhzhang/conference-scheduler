import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Typography from "@mui/material/Typography";
import { supabase } from "../lib/store";

export default function SignOutDialog({ open, onClose }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <Box
        sx={{
          m: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Are you sure you want to sign out?
        </Typography>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          onClick={async () => {
            await supabase.auth.signOut();
            onClose();
          }}
          sx={{ mt: 3, mb: 2 }}
        >
          Sign Out
        </Button>
        <Button
          type="submit"
          fullWidth
          variant="outlined"
          onClick={() => onClose()}
          sx={{ mt: 1, mb: 2 }}
        >
          Cancel
        </Button>
      </Box>
    </Dialog>
  );
}
