// import Days from "./Days";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import { useStore } from "../lib/store";
import Initialize from "./Initialize";
import PaperList from "./PaperList";
import SessionList from "./SessionList";

export default function App() {
  const {
    papers,
    attributeValues,
    sessions,
    locations,
    paperToAssignments,
    sessionToAssignments,
  } = useStore();
  if (papers === null) {
    return (
      <CircularProgress
        sx={{
          position: "fixed",
          left: "calc(50% - 20px)",
          top: "calc(50% - 20px)",
        }}
      />
    );
  }
  if (Object.keys(papers).length === 0) {
    return <Initialize />;
  }
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Grid container sx={{ display: "flex" }} spacing={2}>
        <Grid item xs={12} md={6}>
          <PaperList
            papers={papers}
            attributeValues={attributeValues}
            sessions={sessions}
            paperToAssignments={paperToAssignments}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <SessionList
            sessions={sessions}
            locations={locations}
            papers={papers}
            sessionToAssignments={sessionToAssignments}
          />
        </Grid>
        {/* <Grid item xs={12} md={5}>
           <Days />
        </Grid> */}
      </Grid>
    </LocalizationProvider>
  );
}
