import { expect, it } from "vitest";
import { formatDate } from "./format";

it("memformat tanggal per locale", () => {
  expect(formatDate("2026-10-09", "id")).toBe("9 Oktober 2026");
  expect(formatDate("2026-10-09", "en")).toBe("9 October 2026");
  expect(formatDate("2026-01-01", "en")).toBe("1 January 2026");
});
