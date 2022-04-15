import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import MuiPaper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { deletePaper, Paper, renderAuthorName } from "../lib/store";

const StyledPaper = styled(MuiPaper, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, selected }) => ({
  borderWidth: selected ? 3 : 1,
  borderStyle: "solid",
  borderColor: selected ? theme.palette.primary.main : theme.palette.divider,
  "&:hover": {
    borderWidth: 3,
    borderColor: theme.palette.common.black,
  },
}));

function DeletePaperDialog({ open, paper, onClose }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <Box sx={{ p: 2 }}>
        <Typography variant="h6">Delete Paper?</Typography>
        <Typography>Are you sure you want to delete:</Typography>
        <Typography>{paper.title}</Typography>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          color="error"
          sx={{ textAlign: "right" }}
          onClick={async () => {
            await deletePaper(paper.id);
            onClose();
          }}
        >
          Delete
        </Button>
      </Box>
    </Dialog>
  );
}

export default function PaperCard({
  paper,
  selected,
  onSelect,
  onDeselect,
}: {
  paper: Paper;
  selected: boolean;
}) {
  const { id, title, abstract, authors, attributes } = paper;
  const [showAbstract, setShowAbstract] = useState(false);
  const [deleteDialogOpen, toggleDeleteDialogOpen] = useState(false);
  const handleClick = () => {
    if (selected) {
      onDeselect(paper);
    } else {
      onSelect(paper);
    }
  };
  return (
    <StyledPaper
      sx={{ mt: 1 }}
      elevation={0}
      selected={selected}
      onClick={handleClick}
    >
      <Box sx={{ p: 1 }}>
        <Box sx={{ display: "flex" }}>
          <Typography variant="subtitle2" sx={{ mr: 0.5 }}>
            {id}
          </Typography>
          <Typography sx={{ fontWeight: "bold", flex: 1 }}>{title}</Typography>
          <IconButton
            sx={{ height: 24, width: 24 }}
            onClick={() => toggleDeleteDialogOpen(true)}
          >
            <CloseIcon sx={{ height: 16, width: 16 }} />
          </IconButton>
          <DeletePaperDialog
            open={deleteDialogOpen}
            paper={paper}
            onClose={() => toggleDeleteDialogOpen(false)}
          />
        </Box>
        <Typography>
          {authors.map((author) => renderAuthorName(author)).join(", ")}
        </Typography>
        <Box sx={{ display: "flex" }}>
          <Button
            size="small"
            sx={{ padding: 0, mr: 0.5 }}
            onClick={(event) => {
              event.stopPropagation();
              setShowAbstract(!showAbstract);
            }}
          >
            {showAbstract ? "Hide Abstract" : "Show Abstract"}
          </Button>
          {Object.entries(attributes).map(([key, value]) => (
            <Chip
              key={key}
              label={`${key}: ${value}`}
              variant="outlined"
              sx={{ mr: 0.5 }}
            />
          ))}
        </Box>
        {showAbstract && <Typography>{abstract}</Typography>}
      </Box>
    </StyledPaper>
  );
}
