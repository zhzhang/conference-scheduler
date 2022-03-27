import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import { format } from "date-fns";
import * as moment from "moment";
import { useRouter } from "next/router";
import { useState } from "react";
import { Session } from "../lib/store";
import DeleteSessionDialog from "./DeleteSessionDialog";

function formatDate(start: Date, end: Date): string {
  return `${format(new Date(start), "iii, MMM do H:mm")} - ${format(
    new Date(end),
    "H:mm"
  )}`;
}

export default function SessionCard({
  session,
  papers,
  locations,
  assignments = [],
}: {
  session: Session;
}) {
  const router = useRouter();
  const { id, name, start_time, end_time, no_paper, location } = session;
  const [deleteDialogOpen, toggleDeleteDialogOpen] = useState(false);
  let sessionLength;
  if (start_time && end_time && assignments.length > 0) {
    sessionLength = moment(end_time).diff(moment(start_time), "minutes");
  }

  return (
    <Card sx={{ mb: 1 }}>
      <Box sx={{ p: 1 }}>
        <Typography variant="h6" sx={{ flex: 1 }}>
          {name}
        </Typography>
        <Typography sx={{ flex: 1 }}>
          {location || "No Location Set"}
        </Typography>
        <Typography sx={{ flex: 1 }}>
          {start_time && end_time
            ? `${formatDate(start_time, end_time)}, ${sessionLength} minutes`
            : "No Times Set"}
        </Typography>
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
