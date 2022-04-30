import PaperTitlePopover, {
  getAuthorName,
} from "@/components/PaperTitlePopover";
import { assignPapers } from "@/lib/store";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Typography from "@mui/material/Typography";
import { DataGrid } from "@mui/x-data-grid";
import { useState } from "react";

export default function AddPapersDialog({
  open,
  session,
  sessions,
  papers,
  paperToAssignments,
  onBlur,
}) {
  const [selection, setSelection] = useState([]);
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
    {
      field: "authors",
      headerName: "Authors",
      width: 300,
      renderCell: ({ row }) => {
        return row.authors.map(getAuthorName).join(", ");
      },
    },
  ];
  return (
    <Dialog open={open} fullWidth maxWidth="80vw">
      <Box sx={{ p: 2 }}>
        <Typography variant="h6">Select Papers for {session.name}</Typography>
        <DataGrid
          sx={{ height: "calc(100vh - 200px)" }}
          rows={Object.values(papers)}
          columns={columns}
          onSelectionModelChange={(newSelection) => {
            setSelection(newSelection);
          }}
          selectionModel={selection}
          checkboxSelection
        />
        <Button
          onClick={async () => {
            const selectedPapers = selection.map((id) => papers[id]);
            await assignPapers(selectedPapers, session);
            onBlur();
          }}
        >
          Assign
        </Button>
        <Button color="error" onClick={() => onBlur()}>
          Cancel
        </Button>
      </Box>
    </Dialog>
  );
}
