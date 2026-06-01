"use client";

import { useMemo, useState } from "react";

import {
  DEMO_APPLICATIONS,
  exportApplicationsCsv,
  filterApplications,
  summarizeApplications,
  type JobStatus,
} from "@/lib/jobs";

const STATUS_OPTIONS: Array<JobStatus | "All"> = ["All", "Applied", "Interviewing", "Offer", "Rejected", "Paused"];

function statusTone(status: JobStatus) {
  switch (status) {
    case "Offer":
      return { background: "color-mix(in oklab, var(--color-success) 14%, transparent)", color: "var(--color-success)" };
    case "Interviewing":
      return { background: "color-mix(in oklab, var(--color-accent) 14%, transparent)", color: "var(--color-accent)" };
    default:
      return { background: "color-mix(in oklab, var(--color-warning) 14%, transparent)", color: "oklch(0.52 0.1 85)" };
  }
}

export function JobTrackerApp() {
  const [selectedStatus, setSelectedStatus] = useState<JobStatus | "All">("All");

  const applications = useMemo(
    () => filterApplications(DEMO_APPLICATIONS, selectedStatus),
    [selectedStatus],
  );
  const summary = useMemo(() => summarizeApplications(DEMO_APPLICATIONS), []);

  function handleExport() {
    const csv = exportApplicationsCsv(applications);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "job-applications.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-5 py-6 sm:px-8 lg:px-10 lg:py-10">
      <section className="grid gap-6 rounded-[28px] border border-[var(--color-border)] bg-[var(--color-panel)] p-6 shadow-[0_16px_60px_rgba(23,31,45,0.08)] lg:grid-cols-[1.08fr_0.92fr] lg:p-8">
        <div className="space-y-5">
          <div className="inline-flex rounded-full bg-[var(--color-accent-soft)] px-3 py-1 text-sm font-medium text-[var(--color-accent)]">
            Local-first search ops
          </div>
          <div className="space-y-3">
            <h1 className="max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
              Track applications, follow-ups, and pipeline health without leaving your laptop.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-[var(--color-muted)]">
              Job Application Tracker is a practical Next.js dashboard with a SQLite-backed data layer, filterable pipeline view, and CSV export path for sharing or backup.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {[
            ["Total applications", summary.total.toString()],
            ["Interviewing", summary.interviewing.toString()],
            ["Offers", summary.offers.toString()],
            ["Follow-ups this week", summary.followUpsThisWeek.toString()],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-canvas)] p-5">
              <div className="text-sm text-[var(--color-muted)]">{label}</div>
              <div className="mt-3 text-3xl font-semibold">{value}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[28px] border border-[var(--color-border)] bg-[var(--color-panel)] p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Applications</h2>
              <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">Filter by status, then export the visible results as CSV.</p>
            </div>
            <div className="flex gap-3">
              <select
                value={selectedStatus}
                onChange={(event) => setSelectedStatus(event.target.value as JobStatus | "All")}
                className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-canvas)] px-4 py-3 outline-none"
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleExport}
                className="rounded-2xl bg-[var(--color-accent)] px-5 py-3 font-medium text-white"
              >
                Export CSV
              </button>
            </div>
          </div>

          <div className="mt-6 overflow-hidden rounded-[24px] border border-[var(--color-border)]">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-[var(--color-canvas)] text-[var(--color-muted)]">
                <tr>
                  <th className="px-4 py-3 font-medium">Company</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Follow-up</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((application) => (
                  <tr key={application.id} className="border-t border-[var(--color-border)]">
                    <td className="px-4 py-4">
                      <div className="font-medium">{application.company}</div>
                      <div className="mt-1 text-xs text-[var(--color-muted)]">{application.location}</div>
                    </td>
                    <td className="px-4 py-4">{application.role}</td>
                    <td className="px-4 py-4">
                      <span className="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]" style={statusTone(application.status)}>
                        {application.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">{application.followUpOn}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          {applications.slice(0, 2).map((application) => (
            <article key={application.id} className="rounded-[28px] border border-[var(--color-border)] bg-[var(--color-panel)] p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold">{application.company}</h3>
                  <p className="mt-2 text-sm text-[var(--color-muted)]">{application.role}</p>
                </div>
                <span className="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]" style={statusTone(application.status)}>
                  {application.status}
                </span>
              </div>
              <dl className="mt-5 grid gap-4 text-sm text-[var(--color-muted)]">
                <div>
                  <dt className="font-medium text-[var(--foreground)]">Contact</dt>
                  <dd className="mt-1">{application.contactName}, {application.contactEmail}</dd>
                </div>
                <div>
                  <dt className="font-medium text-[var(--foreground)]">Applied</dt>
                  <dd className="mt-1">{application.appliedOn}</dd>
                </div>
                <div>
                  <dt className="font-medium text-[var(--foreground)]">Notes</dt>
                  <dd className="mt-1 leading-6">{application.notes}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
