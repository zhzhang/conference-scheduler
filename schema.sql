DROP TABLE IF EXISTS assignments;
DROP TABLE IF EXISTS papers;
DROP TABLE IF EXISTS sessions;

CREATE TABLE IF NOT EXISTS papers (
    id VARCHAR(128) NOT NULL PRIMARY KEY,
    title TEXT NOT NULL,
    abstract TEXT NOT NULL,
    authors JSON NOT NULL,
    attributes JSON NOT NULL
);

ALTER TABLE papers ENABLE ROW LEVEL SECURITY;

CREATE POLICY papers_select
ON public.papers
FOR SELECT USING (
  true
);

CREATE POLICY papers_insert
ON public.papers
FOR INSERT WITH CHECK (
  auth.role() = 'authenticated'
);

CREATE POLICY papers_update
ON public.papers
FOR UPDATE USING (true) WITH CHECK (
  auth.role() = 'authenticated'
);

CREATE POLICY papers_delete
ON public.papers
FOR DELETE USING (
  auth.role() = 'authenticated'
);

CREATE TABLE IF NOT EXISTS sessions (
    id UUID NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4 (),
    name TEXT NOT NULL,
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    location VARCHAR(128),
    chair VARCHAR(256),
    session_group VARCHAR(256),
    paper_scheduled BOOLEAN NOT NULL DEFAULT TRUE,
    no_paper BOOLEAN NOT NULL DEFAULT FALSE
);
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY sessions_select
ON public.sessions
FOR SELECT USING (
  true
);

CREATE POLICY sessions_insert
ON public.sessions
FOR INSERT WITH CHECK (
  auth.role() = 'authenticated'
);

CREATE POLICY sessions_update
ON public.sessions
FOR UPDATE USING (true) WITH CHECK (
  auth.role() = 'authenticated'
);

CREATE POLICY sessions_delete
ON public.sessions
FOR DELETE USING (
  auth.role() = 'authenticated'
);

CREATE TABLE IF NOT EXISTS assignments (
    id VARCHAR(256) NOT NULL PRIMARY KEY,
    paper_id VARCHAR(128) REFERENCES papers ON DELETE CASCADE NOT NULL,
    session_id UUID REFERENCES sessions ON DELETE CASCADE NOT NULL,
    minutes SMALLINT NOT NULL DEFAULT 15,
    slot_number SMALLSERIAL NOT NULL
);

ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY assignments_select
ON public.assignments
FOR SELECT USING (
  true
);

CREATE POLICY assignments_insert
ON public.assignments
FOR INSERT WITH CHECK (
  auth.role() = 'authenticated'
);

CREATE POLICY assignments_update
ON public.assignments
FOR UPDATE USING (true) WITH CHECK (
  auth.role() = 'authenticated'
);

CREATE POLICY assignments_delete
ON public.assignments
FOR DELETE USING (
  auth.role() = 'authenticated'
);
