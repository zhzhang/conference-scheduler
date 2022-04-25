import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { format, getDay, parse, startOfWeek } from "date-fns";
import { useRouter } from "next/router";
import { useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Session, SessionsMap } from "../lib/store";

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
});

function getEarliestDay(sessions: Array<Session>): Date | undefined {
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

export default function Days({ sessions }: { sessions: SessionsMap }) {
  const router = useRouter();
  const sessionList = Object.values(sessions);
  const calendarEvents = [];
  const [date, setDate] = useState<Date | undefined>();
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
