import yaml from "js-yaml";
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

function convertToOutputSession(session: Session): OutputSession {
  return {
    title: session.name,
    chair: session.chair,
    location: session.location,
    start_time: session.start_time,
    end_time: session.end_time,
  };
}

export default function exportToYaml(sessions: Array<Session>) {
  const parallelSessions = {};
  // Generate the parallel sessions.
  for (let session of sessions) {
    if (session.session_group) {
      continue;
    }
    let parallelSession = parallelSessions[session.session_group];
    if (!parallelSession) {
      parallelSession = {
        title: session.session_group,
        start_time: session.start_time,
        end_time: session.end_time,
        subsessions: [convertToOutputSession(session)],
      };
      parallelSessions[session.session_group] = parallelSession;
    } else {
      if (session.start_time < parallelSession.start_time) {
        parallelSession.start_time = session.start_time;
      }
      if (session.end_time > parallelSession.end_time) {
        parallelSession.end_time = session.end_time;
      }
      parallelSession.subsessions.push(convertToOutputSession(session));
    }
  }
  const output = [];
  for (let parallelSession of Object.values(parallelSessions)) {
    output.push(parallelSession);
  }
  for (let session of sessions) {
    if (!session.session_group) {
      output.push(convertToOutputSession(session));
    }
  }
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
