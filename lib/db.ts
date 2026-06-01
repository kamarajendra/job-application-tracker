import initSqlJs, { type Database, type SqlJsStatic } from "sql.js";

import { DEMO_APPLICATIONS } from "@/lib/jobs";

let sqlPromise: Promise<SqlJsStatic> | null = null;

async function getSql() {
  if (!sqlPromise) {
    sqlPromise = initSqlJs({
      locateFile: (file: string) => `https://sql.js.org/dist/${file}`,
    });
  }

  return sqlPromise;
}

export async function createDemoDatabase(): Promise<Database> {
  const SQL = await getSql();
  const database = new SQL.Database();

  database.run(`
    create table applications (
      id text primary key,
      company text not null,
      role text not null,
      status text not null,
      applied_on text not null,
      follow_up_on text not null,
      location text not null,
      contact_name text not null,
      contact_email text not null,
      notes text not null
    );
  `);

  for (const application of DEMO_APPLICATIONS) {
    database.run(
      `insert into applications values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        application.id,
        application.company,
        application.role,
        application.status,
        application.appliedOn,
        application.followUpOn,
        application.location,
        application.contactName,
        application.contactEmail,
        application.notes,
      ],
    );
  }

  return database;
}
