import { createClient } from "@supabase/supabase-js";
import _ from "lodash";
import { useEffect, useState } from "react";

export function renderAuthorName(author) {
  const { first_name, middle_name, last_name } = author;
  let name = first_name;
  if (middle_name) {
    name += ` ${middle_name}`;
  }
  name += ` ${last_name}`;
  return name;
}

export function getAuthorId(author): string {
  return author.first_name + (author.middle_name || "") + author.last_name;
}

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export interface Author {
  first_name: string;
  middle_name: string;
  last_name: string;
}

export interface Paper {
  id: string;
  title: string;
  abstract: string;
  authors: Array<Author>;
  attributes: { [name: string]: string };
}

export type PapersMap = { [id: string]: Paper };

export interface Session {
  id: string;
  name: string;
  paperIds: Array<string>;
  poster: boolean;
  no_paper: boolean;
  location?: string;
  chair?: string;
  session_group?: string;
  start_time?: Date;
  end_time?: Date;
}

export type SessionsMap = { [id: string]: Session };

export interface Assignment {
  id: string;
  paper_id: string;
  session_id: string;
  minute: number;
  slot_number: number;
}

export type AuthorToSessions = { [id: string]: Array<Session> };
export type SessionToAssignments = { [id: string]: Array<Assignment> };

export enum Direction {
  UP,
  DOWN,
}

/**
 * @param {number} channelId the currently selected Channel
 */
export const useStore = (props?) => {
  const [loading, setLoading] = useState(true);
  const [papers, setPapers] = useState<PapersMap>({});
  const [sessions, setSessions] = useState<SessionsMap>({});
  const [assignments, setAssignments] = useState<Array<Assignment>>([]);
  const [newSession, handleNewSession] = useState();
  const [updateSession, handleUpdateSession] = useState();
  const [deleteSession, handleDeleteSession] = useState();
  const [insertAssignment, handleInsertAssignment] = useState();
  const [updateAssignment, handleUpdateAssignment] = useState();
  const [deleteAssignment, handleDeleteAssignment] = useState();

  // Load initial data and set up listeners
  useEffect(() => {
    fetchPapers(setPapers, setLoading);
    fetchSessions(setSessions);
    fetchAssignments(setAssignments);
    // const paperListener = supabase
    //   .from("papers")
    //   .on("UPDATE", (payload) => handleUpdatePaper(payload.new))
    //   .subscribe();
    const sessionsListener = supabase
      .from("sessions")
      .on("INSERT", (payload) =>
        handleNewSession({ ...payload.new, assignments: [] })
      )
      .on("UPDATE", (payload) => handleUpdateSession(payload.new))
      .on("DELETE", (payload) => handleDeleteSession(payload.old))
      .subscribe();
    const assignmentsListener = supabase
      .from("assignments")
      .on("INSERT", (payload) => handleInsertAssignment(payload.new))
      .on("UPDATE", (payload) => handleUpdateAssignment(payload.new))
      .on("DELETE", (payload) => handleDeleteAssignment(payload.old))
      .subscribe();
    // Cleanup on unmount.
    return () => {
      // paperListener.unsubscribe();
      sessionsListener.unsubscribe();
      assignmentsListener.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (newSession) {
      setSessions({ ...sessions, [newSession.id]: newSession });
    }
  }, [newSession]);

  useEffect(() => {
    if (updateSession) {
      setSessions({ ...sessions, [updateSession.id]: updateSession });
    }
  }, [updateSession]);

  useEffect(() => {
    if (deleteSession) {
      setSessions(_.reject(sessions, deleteSession));
    }
  }, [deleteSession]);

  useEffect(() => {
    if (insertAssignment) {
      setAssignments([...assignments, insertAssignment]);
    }
  }, [insertAssignment]);

  useEffect(() => {
    if (updateAssignment) {
      const updated = _.reject(assignments, { id: updateAssignment.id });
      setAssignments([...updated, updateAssignment]);
    }
  }, [updateAssignment]);

  useEffect(() => {
    if (deleteAssignment) {
      setAssignments(_.reject(assignments, deleteAssignment));
    }
  }, [deleteAssignment]);

  if (loading) {
    return null;
  }

  const paperToAssignments = {};
  const sessionToAssignments = {};
  for (const assignment of assignments) {
    if (paperToAssignments[assignment.paper_id]) {
      paperToAssignments[assignment.paper_id].push(assignment);
    } else {
      paperToAssignments[assignment.paper_id] = [assignment];
    }
    if (sessionToAssignments[assignment.session_id]) {
      sessionToAssignments[assignment.session_id].push(assignment);
    } else {
      sessionToAssignments[assignment.session_id] = [assignment];
    }
  }

  const locations = [];
  const chairs = [];
  const sessionGroups = [];
  for (const session of Object.values(sessions)) {
    if (session.location) {
      locations.push(session.location);
    }
    if (session.chair) {
      chairs.push(session.chair);
    }
    if (session.session_group) {
      sessionGroups.push(session.session_group);
    }
  }

  const attributeValues = {};
  for (const paper of Object.values(papers)) {
    Object.keys(paper.attributes).forEach((key) => {
      if (key in attributeValues) {
        if (!attributeValues[key].includes(paper.attributes[key])) {
          attributeValues[key].push(paper.attributes[key]);
        }
      } else {
        attributeValues[key] = [paper.attributes[key]];
      }
    });
  }

  const authorToSessions = {};
  for (const session of Object.values(sessions)) {
    if (session.session_group) {
      const assignments = sessionToAssignments[session.id];
      if (!assignments) {
        continue;
      }
      for (const assignment of assignments) {
        const paper = papers[assignment.paper_id];
        if (!paper) {
          continue;
        }
        const author = paper.authors[0];
        const authorId = getAuthorId(author);
        if (authorId in authorToSessions) {
          if (!authorToSessions[authorId].includes(session)) {
            authorToSessions[authorId].push(session);
          }
        } else {
          authorToSessions[authorId] = [session];
        }
      }
    }
  }

  return {
    papers,
    attributeValues,
    sessions,
    locations,
    chairs,
    sessionGroups,
    paperToAssignments,
    sessionToAssignments,
    authorToSessions,
  };
};

const FETCH_BATCH_SIZE = 50;

export const fetchPapers = async (setPapers, setLoading) => {
  try {
    let idx = 0;
    let lastBatchSize = FETCH_BATCH_SIZE;
    while (lastBatchSize >= FETCH_BATCH_SIZE) {
      const { body } = await supabase
        .from("papers")
        .select("*")
        .range(idx, idx + FETCH_BATCH_SIZE);
      idx = idx + FETCH_BATCH_SIZE;
      lastBatchSize = body.length;
      const papers = {};
      for (const paper of body) {
        papers[paper.id] = { ...paper, assignments: [] };
      }
      if (setPapers) {
        setPapers((prev) => {
          return {
            ...prev,
            ...papers,
          };
        });
      }
      if (setLoading) {
        setLoading(false);
      }
    }
  } catch (error) {
    console.log("error", error);
  }
};

export const fetchSessions = async (setSessions) => {
  try {
    const { body } = await supabase.from("sessions").select("*");
    const sessions = {};
    for (const session of body) {
      sessions[session.id] = { ...session, assignments: [] };
    }
    if (setSessions) setSessions(sessions);
    return body;
  } catch (error) {
    console.log("error", error);
  }
};

export const fetchAssignments = async (setAssignments) => {
  try {
    const { body } = await supabase.from("assignments").select("*");
    if (setAssignments) setAssignments(body);
    return body;
  } catch (error) {
    console.log("error", error);
  }
};

export const addPapers = async (papers: Array<Paper>) => {
  try {
    let { body } = await supabase
      .from("papers")
      .upsert(papers, { onConflict: "id" });
    return body;
  } catch (error) {
    console.log("error", error);
  }
};

export const deletePaper = async (id: String) => {
  try {
    let { body } = await supabase.from("papers").delete().match({ id });
    return body;
  } catch (error) {
    console.log("error", error);
  }
};

export const addSession = async ({ name }: { name: string }) => {
  try {
    let { body } = await supabase.from("sessions").insert({ name });
    return body;
  } catch (error) {
    console.log("error", error);
  }
};

export const deleteSession = async (id: String) => {
  try {
    let { body } = await supabase.from("sessions").delete().match({ id });
    return body;
  } catch (error) {
    console.log("error", error);
  }
};

export const updateSession = async (session: Session) => {
  try {
    let { body } = await supabase
      .from("sessions")
      .update(session)
      .match({ id: session.id });
    return body;
  } catch (error) {
    console.log("error", error);
  }
};

export const setPresentationLength = async (id: string, minutes: number) => {
  if (minutes <= 0) {
    return;
  }
  try {
    let { body } = await supabase
      .from("assignments")
      .update({ minutes })
      .match({ id });
    return body;
  } catch (error) {
    console.log("error", error);
  }
};

export const assignPapers = async (papers, session) => {
  try {
    let { body } = await supabase.from("assignments").upsert(
      papers.map((paper) => ({
        id: `${paper.id}-${session.id}`,
        paper_id: paper.id,
        session_id: session.id,
      }))
    );
    return body;
  } catch (error) {
    console.log("error", error);
  }
};

export const reorderAssignment = async (
  assignment,
  direction: Direction,
  assignments
) => {
  try {
    const orderedAssignments = _.sortBy(assignments, "slot_number");
    for (const [i, a] of orderedAssignments.entries()) {
      a.slot_number = i;
    }
    if (direction === Direction.UP && assignment.slot_number > 0) {
      orderedAssignments[assignment.slot_number - 1].slot_number =
        assignment.slot_number;
      assignment.slot_number -= 1;
    } else if (
      direction === Direction.DOWN &&
      assignment.slot_number < orderedAssignments.length - 1
    ) {
      orderedAssignments[assignment.slot_number + 1].slot_number =
        assignment.slot_number;
      assignment.slot_number += 1;
    }
    const { body } = await supabase
      .from("assignments")
      .upsert(orderedAssignments);
  } catch (error) {
    console.log("error", error);
  }
};

export const deleteAssignment = async (id: String) => {
  try {
    let { body } = await supabase.from("assignments").delete().match({ id });
    return body;
  } catch (error) {
    console.log("error", error);
  }
};
