"use client";

import { useMemo, useState } from "react";

import {
  DEMO_APPLICATIONS,
  exportApplicationsCsv,
  filterApplications,
  searchApplications,
  summarizeApplications,
  type JobStatus,
} from "@/lib/jobs";

const STATUS_OPTIONS: Array<JobStatus | "All"> = ["All", "Applied", "Interviewing", "Offer", "Rejected", "Paused"];

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: "◆" },
  { id: "applications", label: "Applications", icon: "◇" },
  { id: "export", label: "Export", icon: "▽" },
];

function statusBadgeStyle(status: JobStatus) {
  switch (status) {
    case "Offer":    return { bg: "color-mix(in oklab, var(--color-success) 15%, transparent)", color: "var(--color-success)" };
    case "Interviewing": return { bg: "color-mix(in oklab, var(--color-accent) 15%, transparent)", color: "var(--color-accent)" };
    case "Rejected": return { bg: "color-mix(in oklab, var(--color-accent-2) 12%, transparent)", color: "var(--color-accent-2)" };
    default:         return { bg: "color-mix(in oklab, var(--color-warning) 15%, transparent)", color: "oklch(0.54 0.1 85)" };
  }
}

function priorityStyle(p: "High" | "Medium" | "Low") {
  switch (p) {
    case "High":   return { bg: "color-mix(in oklab, var(--color-accent-2) 15%, transparent)", color: "var(--color-accent-2)" };
    case "Low":    return { bg: "color-mix(in oklab, var(--color-accent) 12%, transparent)", color: "var(--color-accent)" };
    default:       return { bg: "color-mix(in oklab, var(--color-success) 14%, transparent)", color: "var(--color-success)" };
  }
}

export function JobTrackerApp() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedStatus, setSelectedStatus] = useState<JobStatus | "All">("All");
  const [query, setQuery] = useState("");

  const applications = useMemo(() => {
    const filtered = filterApplications(DEMO_APPLICATIONS, selectedStatus);
    return searchApplications(filtered, query);
  }, [query, selectedStatus]);

  const summary = useMemo(() => summarizeApplications(DEMO_APPLICATIONS), []);

  function handleExport() {
    const csv = exportApplicationsCsv(applications);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "job-applications.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex min-h-dvh">
      {/* Sidebar */}
      <aside className="hidden w-56 shrink-0 border-r border-[var(--color-border)] bg-[var(--color-sidebar)] p-4 md:block">
        <div className="mb-6 flex items-center gap-2.5 px-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-accent)] text-sm font-bold text-white">
            JT
          </div>
          <div>
            <div className="text-sm font-bold">Job Tracker</div>
            <div className="text-[11px] text-[var(--color-muted)]">Pipeline dashboard</div>
          </div>
        </div>
        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                activeTab === item.id
                  ? "bg-[var(--color-panel)] text-[var(--color-accent)] shadow-sm"
                  : "text-[var(--color-muted)] hover:bg-[var(--color-panel)] hover:text-[var(--foreground)]"
              }`}
            >
              <span className="w-4 text-center text-xs">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {/* Top bar */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Pipeline</h1>
              <p className="mt-1 text-sm text-[var(--color-muted)]">{DEMO_APPLICATIONS.length} total applications</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <input
                  aria-label="Search applications"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by company or role"
                  className="w-52 rounded-lg border border-[var(--color-border)] bg-[var(--color-panel)] px-4 py-2.5 text-sm outline-none focus:border-[var(--color-accent)]"
                />
              </div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as JobStatus | "All")}
                className="rounded-lg border border-[var(--color-border)] bg-[var(--color-panel)] px-4 py-2.5 text-sm outline-none focus:border-[var(--color-accent)]"
              >
                {STATUS_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
              </select>
              <button
                type="button"
                onClick={handleExport}
                className="rounded-lg bg-[var(--color-accent)] px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
              >
                Export CSV
              </button>
            </div>
          </div>

          {/* Cards */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Total", summary.total.toString(), "var(--color-foreground)"],
              ["Interviewing", summary.interviewing.toString(), "var(--color-accent)"],
              ["Offers", summary.offers.toString(), "var(--color-success)"],
              ["Follow-ups this week", summary.followUpsThisWeek.toString(), "var(--color-accent-2)"],
            ].map(([label, value, accent]) => (
              <div key={label} className="rounded-xl border border-[var(--color-border)] bg-[var(--color-panel)] p-5 shadow-sm">
                <div className="text-sm text-[var(--color-muted)]">{label}</div>
                <div className="mt-2 text-3xl font-bold" style={{ color: accent }}>{value}</div>
              </div>
            ))}
          </div>

          {/* Table */}
          <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-panel)] shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-[var(--color-border)] bg-[var(--color-sidebar)]">
                    <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-muted)]">Company</th>
                    <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-muted)]">Role</th>
                    <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-muted)]">Status</th>
                    <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-muted)]">Priority</th>
                    <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-muted)]">Follow-up</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => {
                    const sb = statusBadgeStyle(app.status);
                    const pb = priorityStyle(app.priority);
                    return (
                      <tr key={app.id} className="border-b border-[var(--color-border)] transition-colors hover:bg-[var(--color-canvas)]">
                        <td className="px-5 py-4">
                          <div className="font-semibold">{app.company}</div>
                          <div className="mt-0.5 text-xs text-[var(--color-muted)]">{app.location}</div>
                        </td>
                        <td className="px-5 py-4 text-[var(--color-muted)]">{app.role}</td>
                        <td className="px-5 py-4">
                          <span className="inline-block rounded-full px-3 py-1 text-xs font-semibold" style={{ background: sb.bg, color: sb.color }}>
                            {app.status}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span className="inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold" style={{ background: pb.bg, color: pb.color }}>
                            {app.priority}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-[var(--color-muted)]">{app.followUpOn}</td>
                      </tr>
                    );
                  })}
                  {applications.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-10 text-center text-sm text-[var(--color-muted)]">No applications match the current filters.</td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </div>

          {/* Detail cards below table */}
          {applications.length > 0 ? (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {applications.slice(0, 3).map((app) => (
                <article key={app.id} className="rounded-xl border border-[var(--color-border)] bg-[var(--color-panel)] p-5 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-bold">{app.company}</h3>
                      <p className="text-sm text-[var(--color-muted)]">{app.role}</p>
                    </div>
                    <span className="shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold" style={{ ...statusBadgeStyle(app.status), background: statusBadgeStyle(app.status).bg }}>
                      {app.status}
                    </span>
                  </div>
                  <div className="mt-4 space-y-2 text-sm text-[var(--color-muted)]">
                    <div className="flex justify-between"><span className="font-medium text-[var(--foreground)]">Contact</span><span>{app.contactName}</span></div>
                    <div className="flex justify-between"><span className="font-medium text-[var(--foreground)]">Applied</span><span>{app.appliedOn}</span></div>
                    <div className="flex justify-between"><span className="font-medium text-[var(--foreground)]">Follow-up</span><span>{app.followUpOn}</span></div>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--color-muted)]">{app.notes}</p>
                </article>
              ))}
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
}
