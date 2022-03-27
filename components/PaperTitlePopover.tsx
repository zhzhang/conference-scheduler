import Box from "@mui/material/Box";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import { useState } from "react";

export function getAuthorName(author) {
  let name = author.first_name;
  if (author.middle_name) {
    name += " " + author.middle_name;
  }
  name += " " + author.last_name;
  return name;
}

export default function PaperTitlePopover({ paper }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <Box onMouseEnter={handlePopoverOpen} onMouseLeave={handlePopoverClose}>
      <Typography>{paper.title}</Typography>
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
        <Box sx={{ p: 2, width: 700 }}>
          <Typography sx={{ fontWeight: "bold" }}>{paper.title}</Typography>
          <Typography>{paper.authors.map(getAuthorName).join(", ")}</Typography>
          <Typography>{paper.abstract}</Typography>
        </Box>
      </Popover>
    </Box>
  );
}
