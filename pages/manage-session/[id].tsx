import AddPapersDialog from "@/components/AddPapersDialog";
import AddIcon from "@mui/icons-material/Add";
import DownIcon from "@mui/icons-material/ArrowDropDown";
import UpIcon from "@mui/icons-material/ArrowDropUp";
import CloseIcon from "@mui/icons-material/Close";
import ErrorIcon from "@mui/icons-material/Error";
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
import Popover from "@mui/material/Popover";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import _ from "lodash";
import * as moment from "moment";
import { useRouter } from "next/router";
import { useState } from "react";
import {
  deleteAssignment,
  Direction,
  getAuthorId,
  Paper,
  renderAuthorName,
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
  const [poster, setPoster] = useState(session.poster);
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
    poster !== session.poster ||
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
        <Grid item sm={3}>
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
        <Grid item sm={3}>
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
        <Grid item sm={3}>
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
        <Grid item sm={3}>
          <FormControlLabel
            control={
              <Checkbox checked={poster} onChange={() => setPoster(!poster)} />
            }
            label="Poster Session"
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
                poster,
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

function ConflictPopover({ authors, session, authorToSessions }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const conflicts = [];
  const author = authors[0];
  const sessions = authorToSessions[getAuthorId(author)];
  if (sessions) {
    for (const assignedSession of sessions) {
      if (
        session.session_group === assignedSession.session_group &&
        session.id !== assignedSession.id
      ) {
        conflicts.push(
          `${author.first_name} ${author.last_name} has another paper assigned to ${assignedSession.name} in the same parallel session, ${session.session_group}`
        );
      }
    }
  }
  if (conflicts.length > 0) {
    return (
      <>
        <ErrorIcon
          onMouseEnter={handlePopoverOpen}
          onMouseLeave={handlePopoverClose}
          sx={{ width: 32, height: 32 }}
          color="error"
        />
        <Popover
          id="mouse-over-popover"
          sx={{
            pointerEvents: "none",
          }}
          open={open}
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          onClose={handlePopoverClose}
          disableRestoreFocus
        >
          {conflicts.map((line) => (
            <Typography key={line} sx={{ p: 1 }}>
              {line}
            </Typography>
          ))}
        </Popover>
      </>
    );
  }
  return null;
}

function PaperEntry({
  session,
  assignment,
  assignments,
  papers,
  authorToSessions,
}: {
  paper: Paper;
}) {
  const [removeDialogOpen, toggleRemoveDialogOpen] = useState(false);
  const paper = papers[assignment.paper_id];
  if (!paper) {
    return null;
  }
  return (
    <>
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
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: "flex" }}>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: "flex" }}>
              <Typography sx={{ mr: 0.5 }} variant="caption">
                {paper.id}
              </Typography>
              <Typography>{paper.title}</Typography>
            </Box>
            <Typography variant="subtitle2">
              {paper.authors
                .map((author) => renderAuthorName(author))
                .join(", ")}
            </Typography>
          </Box>
          <Box sx={{ display: "flex" }}>
            {!session.poster && (
              <>
                <IconButton
                  Icon={SubtractIcon}
                  onClick={() =>
                    setPresentationLength(assignment.id, assignment.minutes - 5)
                  }
                />
                <Typography sx={{ height: 24, p: 0.5 }}>
                  {assignment.minutes} min
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
                  onClick={() =>
                    reorderAssignment(assignment, Direction.UP, assignments)
                  }
                />
                <IconButton
                  Icon={DownIcon}
                  onClick={() =>
                    reorderAssignment(assignment, Direction.DOWN, assignments)
                  }
                />
              </>
            )}
            <IconButton
              Icon={CloseIcon}
              onClick={() => toggleRemoveDialogOpen(true)}
            />
          </Box>
        </Box>
        <Box display="flex">
          {session.session_group && (
            <ConflictPopover
              authorToSessions={authorToSessions}
              session={session}
              authors={paper.authors}
            />
          )}
          {Object.entries(paper.attributes).map(([key, value]) => (
            <Chip
              key={key}
              label={`${key}: ${value}`}
              variant="outlined"
              sx={{ mr: 0.5 }}
            />
          ))}
        </Box>
      </Box>
    </>
  );
}

function ManageSession({
  session,
  papers,
  paperToAssignments,
  sessionToAssignments,
  authorToSessions,
  sessions,
  sessionGroups,
  locations,
  chairs,
}) {
  const [addPapersOpen, setAddPapersOpen] = useState(false);
  const assignments = sessionToAssignments[session.id] || [];
  const orderedAssignments = _.sortBy(assignments, "slot_number");

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
              session={session}
              assignments={assignments}
              assignment={assignment}
              papers={papers}
              authorToSessions={authorToSessions}
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
