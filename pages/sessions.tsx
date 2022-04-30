import SessionCard from "@/components/SessionCard";
import exportToYaml from "@/lib/export";
import {
  addSession,
  AuthorToSessions,
  PapersMap,
  SessionsMap,
  SessionToAssignments,
} from "@/lib/store";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import _ from "lodash";
import { useState } from "react";

export default function SessionList({
  sessions,
  papers,
  sessionToAssignments,
  presenterToSessions,
}: {
  sessions: SessionsMap;
  papers: PapersMap;
  sessionToAssignments: SessionToAssignments;
  presenterToSessions: AuthorToSessions;
}) {
  const [name, setName] = useState("");
  const [orderBy, setOrderBy] = useState("None");
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  let orderedSessions = Object.values(sessions);
  if (orderBy === "Name") {
    orderedSessions = _.sortBy(orderedSessions, (session) => session.name);
  } else if (orderBy === "Location") {
    orderedSessions = _.sortBy(orderedSessions, (session) => session.location);
  } else if (orderBy === "Start Time") {
    orderedSessions = _.sortBy(
      orderedSessions,
      (session) => session.start_time
    );
  } else if (orderBy === "Parallel Session") {
    orderedSessions = _.sortBy(
      orderedSessions,
      (session) => session.session_group
    );
  }

  return (
    <Box>
      <Box sx={{ display: "flex", mb: 1 }}>
        <Typography variant="h4" sx={{ flex: 1 }}>
          Sessions
        </Typography>
        <Button
          onClick={() =>
            exportToYaml(Object.values(sessions), sessionToAssignments, papers)
          }
        >
          Export
        </Button>
      </Box>
      <Box sx={{ display: "flex" }}>
        <FormControl fullWidth sx={{ width: 250, mr: 1 }}>
          <InputLabel id="demo-simple-select-label">Sort By</InputLabel>
          <Select
            value={orderBy}
            label="Sort By"
            onChange={(event) => {
              setOrderBy(event.target.value);
            }}
          >
            {["None", "Name", "Start Time", "Parallel Session"].map((name) => (
              <MenuItem key={name} value={name}>
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          id="name"
          label="New Session Name"
          variant="outlined"
          fullWidth
          value={name}
          onChange={handleChange}
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
      <Box sx={{ height: "calc(100vh - 130px)", overflowY: "scroll", pr: 2 }}>
        <Grid container spacing={2}>
          {orderedSessions.map((session) => (
            <Grid item md={6} key={session.id}>
              <SessionCard
                session={session}
                papers={papers}
                assignments={sessionToAssignments[session.id]}
                presenterToSessions={presenterToSessions}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}
