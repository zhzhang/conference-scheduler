import Initialize from "@/components/Initialize";
import PaperCard from "@/components/PaperCard";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Dialog from "@mui/material/Dialog";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import InputLabel from "@mui/material/InputLabel";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import InfiniteScroll from "react-infinite-scroller";
import { assignPapers, Session } from "../lib/store";

function AssignSessionDialog({
  sessions,
  papers,
  sessionToAssignments,
  onClose,
  onSubmit,
}) {
  const [session, setSession] = useState();
  return (
    <Box sx={{ p: 1, width: 500 }}>
      <Typography>Assign {papers.length} Paper(s)</Typography>
      <Autocomplete
        options={Object.values(sessions)}
        onChange={(_event, session) => setSession(session)}
        getOptionLabel={(option: Session) => option?.name}
        filterSelectedOptions
        sx={{ mt: 1 }}
        renderInput={(params) => (
          <TextField {...params} label="Select a session." />
        )}
      />
      <Button
        onClick={async () => {
          const newPapers = [];
          // Filter papers that are already assigned to the session.
          const sessionAssignments = sessionToAssignments[session.id] || [];
          for (let paper of papers) {
            if (
              !sessionAssignments.find(
                (assignment) => assignment.paper_id === paper.id
              )
            ) {
              newPapers.push(paper);
            }
          }
          await assignPapers(newPapers, session);
          onSubmit();
          onClose();
        }}
      >
        Assign
      </Button>
      <Button color="error" onClick={() => onClose()}>
        Cancel
      </Button>
    </Box>
  );
}

function FilteredPapers({ papers, sessions, sessionToAssignments }) {
  const [limit, setLimit] = useState(20);
  const [selection, setSelection] = useState([]);
  const [assignDialogOpen, toggleAssignDialogOpen] = useState(false);
  return (
    <Box>
      <Button
        disabled={selection.length === 0}
        onClick={() => toggleAssignDialogOpen(true)}
      >
        Assign To Session
      </Button>
      <Box sx={{ height: "calc(100vh - 170px)", overflowY: "scroll" }}>
        <Dialog open={assignDialogOpen}>
          <AssignSessionDialog
            sessions={Object.values(sessions)}
            papers={selection}
            onSubmit={() => setSelection([])}
            onClose={() => toggleAssignDialogOpen(false)}
            sessionToAssignments={sessionToAssignments}
          />
        </Dialog>
        <InfiniteScroll
          pageStart={0}
          loadMore={() => setLimit(limit + 20)}
          hasMore={limit < papers.length}
          loader={
            <div className="loader" key={0}>
              Loading ...
            </div>
          }
          useWindow={false}
        >
          {papers.slice(0, limit).map((paper) => (
            <PaperCard
              key={paper.id}
              paper={paper}
              selected={selection.includes(paper)}
              setSelection={setSelection}
              onSelect={(paper) => setSelection([...selection, paper])}
              onDeselect={(paper) =>
                setSelection(selection.filter((p) => p !== paper))
              }
            />
          ))}
        </InfiniteScroll>
      </Box>
    </Box>
  );
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
    },
  },
};

function PaperList({
  papers,
  sessions,
  sessionToAssignments,
  paperToAssignments,
}) {
  const [attributeFilters, setAttributeFilters] = useState({});
  const attributes = {};
  const [showUnassigned, toggleShowUnassigned] = useState(false);
  Object.values(papers).map((paper) => {
    Object.keys(paper.attributes).map((key) => {
      const value = paper.attributes[key];
      const existingValues = attributes[key];
      if (existingValues) {
        existingValues[value] = true;
      } else {
        attributes[key] = { [value]: true };
      }
    });
  });

  let filteredPapers = [];
  let paperList = Object.values(papers);
  if (showUnassigned) {
    paperList = paperList.filter((paper) => !paperToAssignments[paper.id]);
  }
  for (let paper of paperList) {
    let include = true;
    for (let [key, values] of Object.entries(attributeFilters)) {
      if (!values || values.length === 0) {
        continue;
      }
      if (!values.includes(paper.attributes[key])) {
        include = false;
        break;
      }
    }
    if (include) {
      filteredPapers.push(paper);
    }
  }

  return (
    <>
      {Object.entries(attributes).map(([key, values]) => (
        <FormControl key={key} sx={{ mr: 1, width: 300 }}>
          <InputLabel>{key}</InputLabel>
          <Select
            multiple
            value={attributeFilters[key] || []}
            onChange={({ target: value }) =>
              setAttributeFilters({
                ...attributeFilters,
                [key]: value.value,
              })
            }
            input={<OutlinedInput label="Tag" />}
            renderValue={(selected) => selected.join(", ")}
            MenuProps={MenuProps}
          >
            {Object.keys(values).map((name) => (
              <MenuItem key={name} value={name}>
                <Checkbox
                  checked={attributeFilters[key]?.includes(name) || false}
                />
                <ListItemText primary={name} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ))}
      <FormControlLabel
        sx={{ ml: 1 }}
        control={
          <Checkbox
            checked={showUnassigned}
            onChange={() => toggleShowUnassigned(!showUnassigned)}
          />
        }
        label="Show Unassigned"
      />
      <Button
        size="large"
        onClick={() => {
          setAttributeFilters({});
          toggleShowUnassigned(false);
        }}
      >
        Clear Filters
      </Button>
      <FilteredPapers
        papers={filteredPapers}
        sessions={sessions}
        sessionToAssignments={sessionToAssignments}
      />
    </>
  );
}

export default function Papers({ ...props }) {
  if (Object.keys(props.papers).length === 0) {
    return (
      <Box sx={{ ml: 1 }}>
        <Typography variant="h4">Papers</Typography>
        <Initialize />
      </Box>
    );
  }
  return (
    <Box sx={{ ml: 1 }}>
      <Typography variant="h4">Papers</Typography>
      <PaperList {...props} />
    </Box>
  );
}
