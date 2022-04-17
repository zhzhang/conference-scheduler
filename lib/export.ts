import { add, formatISO9075 } from "date-fns";
import yaml from "js-yaml";
import _ from "lodash";
import { Session } from "./store";

type ParallelSession = {
  title: string;
  start_time: string;
  end_time: string;
};

type OutputSession = {
  title: string;
  chair?: string;
  location?: string;
  start_time: Date;
  end_time: Date;
};

function convertToOutputSession(
  session: Session,
  sessionToAssignments
): OutputSession {
  const output = {
    title: session.name,
    chair: session.chair,
    location: session.location,
    start_time: formatISO9075(new Date(session.start_time)),
    end_time: formatISO9075(new Date(session.end_time)),
  };
  const assignments = _.sortBy(sessionToAssignments[session.id], "slot_number");
  if (assignments) {
    output.papers = [];
    let start = new Date(output.start_time);
    for (let assignment of assignments) {
      const end = add(start, { minutes: assignment.minutes });
      output.papers.push({
        id: assignment.paper_id,
        start_time: formatISO9075(start),
        end_time: formatISO9075(end),
      });
      start = end;
    }
  }
  return output;
}

export default function exportToYaml(
  sessions: Array<Session>,
  sessionToAssignments
) {
  const parallelSessions = {};
  // Generate the parallel sessions.
  for (let session of sessions) {
    if (!session.session_group) {
      continue;
    }
    let parallelSession = parallelSessions[session.session_group];
    if (!parallelSession) {
      parallelSession = {
        title: session.session_group,
        start_time: formatISO9075(new Date(session.start_time)),
        end_time: formatISO9075(new Date(session.end_time)),
        subsessions: [convertToOutputSession(session, sessionToAssignments)],
      };
      parallelSessions[session.session_group] = parallelSession;
    } else {
      if (session.start_time < parallelSession.start_time) {
        parallelSession.start_time = formatISO9075(
          new Date(session.start_time)
        );
      }
      if (session.end_time > parallelSession.end_time) {
        parallelSession.end_time = formatISO9075(new Date(session.end_time));
      }
      parallelSession.subsessions.push(
        convertToOutputSession(session, sessionToAssignments)
      );
    }
  }
  let output = [];
  for (let parallelSession of Object.values(parallelSessions)) {
    output.push(parallelSession);
  }
  for (let session of sessions) {
    if (!session.session_group) {
      output.push(convertToOutputSession(session, sessionToAssignments));
    }
  }
  output = _.sortBy(output, "start_time");
  const yamlOutput = yaml.dump(output);
  const element = document.createElement("a");
  const file = new Blob([yamlOutput], {
    type: "text/yaml",
  });
  element.href = URL.createObjectURL(file);
  element.download = "program.yml";
  document.body.appendChild(element); // Required for this to work in FireFox
  element.click();
}
