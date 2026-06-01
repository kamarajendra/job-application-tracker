export type JobStatus = "Applied" | "Interviewing" | "Offer" | "Rejected" | "Paused";

export type JobApplication = {
  id: string;
  company: string;
  role: string;
  status: JobStatus;
  appliedOn: string;
  followUpOn: string;
  location: string;
  contactName: string;
  contactEmail: string;
  notes: string;
  priority: "High" | "Medium" | "Low";
};

export const DEMO_APPLICATIONS: JobApplication[] = [
  {
    id: "job-1",
    company: "Northstar Labs",
    role: "Frontend Engineer",
    status: "Interviewing",
    appliedOn: "2026-05-20",
    followUpOn: "2026-06-03",
    location: "Remote",
    contactName: "Lena Shaw",
    contactEmail: "lena@northstar.dev",
    notes: "Second-round panel booked. They care a lot about design systems.",
    priority: "High",
  },
  {
    id: "job-2",
    company: "Paper Kite",
    role: "Product Engineer",
    status: "Applied",
    appliedOn: "2026-05-28",
    followUpOn: "2026-06-05",
    location: "Berlin",
    contactName: "Omar Diaz",
    contactEmail: "omar@paperkite.co",
    notes: "Sent portfolio link and case study.",
    priority: "Medium",
  },
  {
    id: "job-3",
    company: "Cloud Current",
    role: "UI Platform Engineer",
    status: "Offer",
    appliedOn: "2026-05-02",
    followUpOn: "2026-06-01",
    location: "London",
    contactName: "Nina Fox",
    contactEmail: "nina@cloudcurrent.io",
    notes: "Offer received, reviewing package.",
    priority: "High",
  },
  {
    id: "job-4",
    company: "Signal Forge",
    role: "Design Technologist",
    status: "Paused",
    appliedOn: "2026-04-17",
    followUpOn: "2026-06-12",
    location: "New York",
    contactName: "Maya Chen",
    contactEmail: "maya@signalforge.com",
    notes: "Hiring freeze for two weeks.",
    priority: "Low",
  },
];

export function summarizeApplications(applications: JobApplication[]) {
  const today = new Date();
  const endOfWeek = new Date(today);
  endOfWeek.setDate(today.getDate() + (7 - today.getDay()));
  const endOfWeekStr = endOfWeek.toISOString().split("T")[0];

  return {
    total: applications.length,
    interviewing: applications.filter((application) => application.status === "Interviewing").length,
    offers: applications.filter((application) => application.status === "Offer").length,
    followUpsThisWeek: applications.filter((application) => application.followUpOn <= endOfWeekStr).length,
  };
}

export function filterApplications(applications: JobApplication[], status: JobStatus | "All") {
  if (status === "All") {
    return applications;
  }

  return applications.filter((application) => application.status === status);
}

export function searchApplications(applications: JobApplication[], query: string) {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return applications;
  }

  return applications.filter((application) =>
    [application.company, application.role, application.location]
      .join(" ")
      .toLowerCase()
      .includes(normalized),
  );
}

export function exportApplicationsCsv(applications: JobApplication[]) {
  const header = [
    "company",
    "role",
    "status",
    "appliedOn",
    "followUpOn",
    "location",
    "contactName",
    "contactEmail",
    "notes",
  ];

  const rows = applications.map((application) => [
    application.company,
    application.role,
    application.status,
    application.appliedOn,
    application.followUpOn,
    application.location,
    application.contactName,
    application.contactEmail,
    application.notes.replace(/\n/g, " "),
  ]);

  return [header, ...rows]
    .map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(","))
    .join("\n");
}
