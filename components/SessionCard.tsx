import ErrorIcon from "@mui/icons-material/Error";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import { format } from "date-fns";
import * as moment from "moment";
import { useRouter } from "next/router";
import { useState } from "react";
import { getAuthorId, Session } from "../lib/store";
import DeleteSessionDialog from "./DeleteSessionDialog";

function formatDate(start: Date, end: Date): string {
  return `${format(new Date(start), "iii, MMM do H:mm")} - ${format(
    new Date(end),
    "H:mm"
  )}`;
}

function ConflictPopover({ open }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handlePopoverClose = () => {
    setAnchorEl(null);
  };
  if (open) {
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
          open={Boolean(anchorEl)}
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
          <Box sx={{ m: 1, maxWidth: 300 }}>
            This session has conflicting assignments with another session it is
            parallel session group. Please click the Edit button to resolve.
          </Box>
        </Popover>
      </>
    );
  }
  return null;
}

export default function SessionCard({
  session,
  papers,
  locations,
  authorToSessions,
  assignments = [],
}: {
  session: Session;
}) {
  const router = useRouter();
  const { id, name, start_time, end_time, no_paper, location, session_group } =
    session;
  const [deleteDialogOpen, toggleDeleteDialogOpen] = useState(false);
  let sessionLength;
  if (start_time && end_time && assignments.length > 0) {
    sessionLength = moment(end_time).diff(moment(start_time), "minutes");
  }

  let conflict = false;
  if (session.session_group) {
    for (let assignment of assignments) {
      const paper = papers[assignment.paper_id];
      if (!paper) {
        continue;
      }
      for (let author of paper.authors) {
        const sessions = authorToSessions[getAuthorId(author)];
        if (sessions) {
          for (let otherSession of sessions) {
            if (
              otherSession.id !== session.id &&
              otherSession.session_group === session.session_group
            ) {
              conflict = true;
              break;
            }
          }
        }
      }
    }
  }

  return (
    <Card sx={{ mb: 1 }}>
      <Box sx={{ p: 1 }}>
        <Box sx={{ display: "flex", flex: 1 }}>
          <Typography variant="h6" sx={{ flex: 1 }}>
            {name}
          </Typography>
          <ConflictPopover open={conflict} />
        </Box>
        <Typography color={location ? "text" : "error"}>
          {location || "No Location Set"}
        </Typography>
        <Typography color={start_time && end_time ? "text" : "error"}>
          {start_time && end_time
            ? `${formatDate(start_time, end_time)}, ${sessionLength} minutes`
            : "No Times Set"}
        </Typography>
        {session_group && <Typography>{session_group}</Typography>}
        <Button
          onClick={() =>
            router.push(`/manage-session/${id}`, undefined, {
              shallow: true,
            })
          }
        >
          Edit Session
        </Button>
        <Button color="error" onClick={() => toggleDeleteDialogOpen(true)}>
          Delete Session
        </Button>
        <DeleteSessionDialog
          open={deleteDialogOpen}
          session={session}
          onClose={() => toggleDeleteDialogOpen(false)}
        />
        {!no_paper && (
          <Box sx={{ mt: 1, display: "flex" }}>
            <Typography variant="subtitle2">
              {assignments.length} Papers Assigned
            </Typography>
          </Box>
        )}
      </Box>
    </Card>
  );
}
