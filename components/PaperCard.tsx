import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import MuiPaper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { Paper } from "../lib/store";

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

export default function PaperCard({
  paper,
  sessions,
  selected,
  onSelect,
  onDeselect,
}: {
  paper: Paper;
  selected: boolean;
}) {
  const { id, title, abstract, authors, attributes } = paper;
  const [showAbstract, setShowAbstract] = useState(false);
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
        <Typography sx={{ fontWeight: "bold" }}>{title}</Typography>
        <Typography>
          {authors
            .map(({ first_name, middle_name, last_name }) => {
              let name = first_name;
              if (middle_name) {
                name += ` ${middle_name}`;
              }
              name += ` ${last_name}`;
              return name;
            })
            .join(", ")}
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
