import AddPapersDialog from "@/components/AddPapersDialog";
import PaperTitlePopover, {
  getAuthorName,
} from "@/components/PaperTitlePopover";
import AddIcon from "@mui/icons-material/Add";
import DownIcon from "@mui/icons-material/ArrowDropDown";
import UpIcon from "@mui/icons-material/ArrowDropUp";
import CloseIcon from "@mui/icons-material/Close";
import SubtractIcon from "@mui/icons-material/Remove";
import DesktopDateTimePicker from "@mui/lab/DesktopDateTimePicker";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import MuiIconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import _ from "lodash";
import * as moment from "moment";
import { useRouter } from "next/router";
import { useState } from "react";
import {
  deleteAssignment,
  Direction,
  Paper,
  reorderAssignment,
  setPresentationLength,
  updateSession,
} from "../../lib/store";

const filter = createFilterOptions();

function SessionDetails({ session, locations, chairs, sessionGroups }) {
  const [name, setName] = useState(session.name);
  const [location, setLocation] = useState(session.location);
  const [chair, setChair] = useState(session.chair);
  const [sessionGroup, setSessionGroup] = useState(session.session_group);
  const [noPaper, setNoPaper] = useState(session.no_paper);
  const [locationInput, setLocationInput] = useState("");
  const [chairInput, setChairInput] = useState("");
  const [sessionGroupInput, setSessionGroupInput] = useState("");
  const [start, setStart] = useState(session.start_time);
  const [end, setEnd] = useState(session.end_time);
  const changed =
    name !== session.name ||
    location !== session.location ||
    chair !== session.chair ||
    sessionGroup !== session.session_group ||
    start !== session.start_time ||
    noPaper !== session.no_paper ||
    end !== session.end_time;

  return (
    <>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Session Details
      </Typography>
      <Grid container spacing={2}>
        <Grid item sm={12}>
          <TextField
            id="name"
            label="Session Name"
            variant="outlined"
            fullWidth
            value={name}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setName(event.target.value)
            }
          />
        </Grid>
        <Grid item sm={4}>
          <Autocomplete
            fullWidth
            filterSelectedOptions
            inputValue={locationInput}
            onInputChange={(_event, value) => {
              setLocationInput(value);
            }}
            value={location}
            filterOptions={(options, params) => {
              const filtered = filter(options, params);
              const { inputValue } = params;
              const isExisting = options.some(
                (option) => inputValue === option
              );
              if (inputValue !== "" && !isExisting) {
                filtered.push(inputValue);
              }
              return filtered;
            }}
            clearOnBlur={false}
            options={locations}
            onChange={(_event, location) => {
              if (location) {
                setLocation(location);
              }
            }}
            renderInput={(params) => (
              <TextField {...params} label="Session Location" />
            )}
          />
        </Grid>
        <Grid item sm={4}>
          <Autocomplete
            fullWidth
            filterSelectedOptions
            inputValue={chairInput}
            onInputChange={(_event, value) => {
              setChairInput(value);
            }}
            value={chair}
            filterOptions={(options, params) => {
              const filtered = filter(options, params);
              const { inputValue } = params;
              const isExisting = options.some(
                (option) => inputValue === option
              );
              if (inputValue !== "" && !isExisting) {
                filtered.push(inputValue);
              }
              return filtered;
            }}
            clearOnBlur={false}
            options={chairs}
            onChange={(_event, chair) => {
              if (chair) {
                setChair(chair);
              }
            }}
            renderInput={(params) => (
              <TextField {...params} label="Session Chair" />
            )}
          />
        </Grid>
        <Grid item sm={4}>
          <Autocomplete
            fullWidth
            filterSelectedOptions
            inputValue={sessionGroupInput}
            onInputChange={(_event, value) => {
              setSessionGroupInput(value);
            }}
            value={sessionGroup}
            filterOptions={(options, params) => {
              const filtered = filter(options, params);
              const { inputValue } = params;
              const isExisting = options.some(
                (option) => inputValue === option
              );
              if (inputValue !== "" && !isExisting) {
                filtered.push(inputValue);
              }
              return filtered;
            }}
            clearOnBlur={false}
            options={sessionGroups}
            onChange={(_event, sessionGroup) => {
              if (sessionGroup) {
                setSessionGroup(sessionGroup);
              }
            }}
            renderInput={(params) => (
              <TextField {...params} label="Parallel Session" />
            )}
          />
        </Grid>
        <Grid item sm={4}>
          <DesktopDateTimePicker
            ampm={false}
            value={start}
            label="Starts"
            onChange={(newValue) => {
              if (newValue) {
                setStart(moment(newValue).format("YYYY-MM-DDTHH:mm:ss"));
              }
            }}
            renderInput={(params) => <TextField fullWidth {...params} />}
          />
        </Grid>
        <Grid item sm={4}>
          <DesktopDateTimePicker
            ampm={false}
            value={end}
            label="Ends"
            onChange={(newValue) => {
              if (newValue) {
                setEnd(moment(newValue).format("YYYY-MM-DDTHH:mm:ss"));
              }
            }}
            renderInput={(params) => <TextField fullWidth {...params} />}
          />
        </Grid>
        <Grid item sm={4}>
          <FormControlLabel
            control={
              <Checkbox
                checked={noPaper}
                onChange={() => setNoPaper(!noPaper)}
              />
            }
            label="Does Not Contain Paper Presentations"
          />
        </Grid>
        <Grid item sm={12}>
          <Button
            disabled={!changed}
            onClick={() =>
              updateSession(session.id, {
                name,
                location,
                chair,
                no_paper: noPaper,
                session_group: sessionGroup,
                start_time: start,
                end_time: end,
              })
            }
          >
            Save
          </Button>
        </Grid>
      </Grid>
    </>
  );
}

function IconButton({ Icon, onClick, sx = null }) {
  return (
    <Box sx={sx}>
      <MuiIconButton sx={{ height: 32, width: 32 }} onClick={onClick}>
        <Icon sx={{ height: 24, width: 24 }} />
      </MuiIconButton>
    </Box>
  );
}

function PaperEntry({ assignment, assignments, papers }: { paper: Paper }) {
  const [removeDialogOpen, toggleRemoveDialogOpen] = useState(false);
  const paper = papers[assignment.paper_id];
  if (!paper) {
    return null;
  }
  return (
    <Box sx={{ display: "flex", mt: 1 }}>
      <Dialog
        open={removeDialogOpen}
        onBlur={() => toggleRemoveDialogOpen(false)}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6">Remove Paper?</Typography>
          <Typography>
            Are you sure you want to remove &quot;{paper.title}&quot; from this
            session?
          </Typography>
          <Button onClick={() => toggleRemoveDialogOpen(false)}>Cancel</Button>
          <Button
            color="error"
            sx={{ textAlign: "right" }}
            onClick={async () => {
              await deleteAssignment(assignment.id);
              toggleRemoveDialogOpen(false);
            }}
          >
            Delete
          </Button>
        </Box>
      </Dialog>
      <Box sx={{ mb: 2, flex: 1 }}>
        <Typography>{paper.title}</Typography>
        {Object.entries(paper.attributes).map(([key, value]) => (
          <Chip
            key={key}
            label={`${key}: ${value}`}
            variant="outlined"
            sx={{ mr: 0.5 }}
          />
        ))}
      </Box>
      <IconButton
        Icon={SubtractIcon}
        onClick={() =>
          setPresentationLength(assignment.id, assignment.minutes - 5)
        }
      />
      <Typography sx={{ height: 24, p: 0.5 }}>
        {assignment.minutes} minutes
      </Typography>
      <IconButton
        sx={{ mr: 1 }}
        Icon={AddIcon}
        onClick={() =>
          setPresentationLength(assignment.id, assignment.minutes + 5)
        }
      />
      <IconButton
        Icon={UpIcon}
        onClick={() => reorderAssignment(assignment, Direction.UP, assignments)}
      />
      <IconButton
        Icon={DownIcon}
        onClick={() =>
          reorderAssignment(assignment, Direction.DOWN, assignments)
        }
      />
      <IconButton
        Icon={CloseIcon}
        onClick={() => toggleRemoveDialogOpen(true)}
      />
    </Box>
  );
}

function ManageSession({
  session,
  papers,
  paperToAssignments,
  sessionToAssignments,
  sessions,
  sessionGroups,
  locations,
  chairs,
}) {
  const [addPapersOpen, setAddPapersOpen] = useState(false);
  const assignments = sessionToAssignments[session.id] || [];
  const orderedAssignments = _.sortBy(assignments, "slot_number");
  const columns = [
    {
      field: "title",
      headerName: "Title",
      width: 900,
      renderCell: ({ row }) => {
        return <PaperTitlePopover paper={row} />;
      },
    },
    {
      field: "authors",
      headerName: "Authors",
      width: 300,
      renderCell: ({ row }) => {
        return row.authors.map(getAuthorName).join(", ");
      },
    },
    {
      field: "sessions",
      headerName: "Sessions",
      width: 300,
      renderCell: ({ row }) => {
        const assignments = paperToAssignments[row.id] || [];
        return assignments
          .map((assignment) => sessions[assignment.session_id]?.name)
          .join(", ");
      },
    },
  ];
  return (
    <Box sx={{ maxWidth: 1200 }}>
      <SessionDetails
        session={session}
        locations={locations}
        chairs={chairs}
        sessionGroups={sessionGroups}
      />
      {!session.no_paper && (
        <>
          <Typography variant="h4">Papers</Typography>
          {orderedAssignments.map((assignment) => (
            <PaperEntry
              key={assignment.id}
              assignments={assignments}
              assignment={assignment}
              papers={papers}
            />
          ))}
          <AddPapersDialog
            open={addPapersOpen}
            onBlur={() => setAddPapersOpen(false)}
            papers={papers}
            session={session}
            sessions={sessions}
            paperToAssignments={paperToAssignments}
          />
          <Button onClick={() => setAddPapersOpen(true)}>Add Papers</Button>
        </>
      )}
    </Box>
  );
}

export default function ManageSessionRoot({ ...props }) {
  const { sessions } = props;
  const router = useRouter();
  const session = sessions[router.query.id];
  if (!session) {
    return null;
  }
  return <ManageSession session={session} {...props} />;
}
