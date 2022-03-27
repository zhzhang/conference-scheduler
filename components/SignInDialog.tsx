// Taken from:
// https://github.com/mui/material-ui/blob/82f2a3fc40c458213df450c178855168b7c6de17/docs/data/material/getting-started/templates/sign-in/SignIn.tsx
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Alert from "@mui/material/Alert";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { supabase } from "../lib/store";

export default function SignInDialog({ open, onClose }) {
  const [message, setMessage] = useState();
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const { error } = await supabase.auth.signIn({
      email: data.get("email"),
    });
    if (error) {
      setMessage({ type: "error", body: error.message });
    } else {
      setMessage({
        type: "success",
        body: "Log in link successfully sent, please check your email.",
      });
    }
  };

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
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <Typography>
            {"A sign-in link will be sent to your email address."}
          </Typography>
        </Box>
        {message && <Alert severity={message.type}>{message.body}</Alert>}
      </Box>
    </Dialog>
  );
}
