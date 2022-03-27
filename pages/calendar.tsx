import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import moment from "moment";
import { useRouter } from "next/router";
import { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Session } from "../lib/store";

const localizer = momentLocalizer(moment);

function getEarliestDay(sessions: Array<Session>): string | undefined {
  if (sessions.length === 0) {
    return undefined;
  }
  const starts = sessions.map((s) => s.start_time);
  const earliest = starts.reduce((earliest, date) => {
    if (!earliest) {
      return date;
    } else if (!date) {
      return earliest;
    } else {
      return earliest < date ? earliest : date;
    }
  });
  return earliest;
}

export default function Days({ sessions }) {
  const router = useRouter();
  const sessionList = Object.values(sessions);
  const calendarEvents = [];
  const [date, setDate] = useState();
  for (let session of sessionList) {
    if (session.start_time && session.end_time) {
      calendarEvents.push({
        title: session.name,
        start: new Date(session.start_time),
        end: new Date(session.end_time),
        id: session.id,
      });
    }
  }
  return (
    <Box>
      <Typography variant="h4">Calendar</Typography>
      <Calendar
        view="day"
        views={["day"]}
        date={date || getEarliestDay(sessionList)}
        onNavigate={(date) => setDate(date)}
        localizer={localizer}
        events={calendarEvents}
        startAccessor="start"
        endAccessor="end"
        onSelectEvent={(event) =>
          router.push(`/manage-session/${event.id}`, undefined, {
            shallow: true,
          })
        }
        style={{ height: "calc(100vh - 100px)" }}
      />
    </Box>
  );
}
