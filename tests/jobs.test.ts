import { describe, expect, it } from "vitest";

import {
  DEMO_APPLICATIONS,
  exportApplicationsCsv,
  filterApplications,
  summarizeApplications,
} from "@/lib/jobs";

describe("job helpers", () => {
  it("summarizes application counts", () => {
    const summary = summarizeApplications(DEMO_APPLICATIONS);

    expect(summary.total).toBe(4);
    expect(summary.interviewing).toBe(1);
    expect(summary.offers).toBe(1);
    expect(summary.followUpsThisWeek).toBe(3);
  });

  it("filters applications by status", () => {
    const filtered = filterApplications(DEMO_APPLICATIONS, "Interviewing");

    expect(filtered).toHaveLength(1);
    expect(filtered[0]?.company).toBe("Northstar Labs");
  });

  it("exports CSV with header row", () => {
    const csv = exportApplicationsCsv(DEMO_APPLICATIONS.slice(0, 1));

    expect(csv).toContain('"company","role","status"');
    expect(csv).toContain("Northstar Labs");
  });
});
