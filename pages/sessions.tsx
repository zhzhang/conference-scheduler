import exportToYaml from "@/lib/export";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import SessionCard from "../components/SessionCard";
import { addSession } from "../lib/store";

export default function SessionList({
  sessions,
  papers,
  locations,
  sessionToAssignments,
}) {
  const [name, setName] = useState("");
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  return (
    <Box>
      <Box sx={{ display: "flex", mb: 1 }}>
        <Typography variant="h4" sx={{ flex: 1 }}>
          Sessions
        </Typography>
        <Button onClick={() => exportToYaml(Object.values(sessions))}>
          Export
        </Button>
      </Box>
      <Box sx={{ display: "flex" }}>
        <TextField
          id="name"
          label="New Session Name"
          variant="outlined"
          fullWidth
          value={name}
          onChange={handleChange}
          sx={{ mt: 1 }}
        />
        <Button
          disabled={name.length === 0}
          onClick={async () => {
            await addSession({
              name,
            });
            setName("");
          }}
        >
          Add Session
        </Button>
      </Box>
      {/* <Box sx={{ display: "flex" }}>
        <Typography>Show</Typography>
      </Box> */}
      <Box sx={{ height: "calc(100vh - 165px)", overflowY: "scroll", pr: 2 }}>
        <Grid container spacing={2}>
          {Object.entries(sessions).map(([id, session]) => (
            <Grid item md={6} key={id}>
              <SessionCard
                session={session}
                locations={locations}
                papers={papers}
                assignments={sessionToAssignments[id]}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}
