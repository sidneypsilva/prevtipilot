import { describe, it, expect } from "vitest";
import { calculateTotal, suggestPlan } from "./pricing";

describe("pricing", () => {
  it("charges R$50 per computer", () => {
    expect(calculateTotal({ pcCount: 4, hasServer: false, hasCloudBackup: false })).toBe(200);
  });
  it("adds R$150 for local server", () => {
    expect(calculateTotal({ pcCount: 1, hasServer: true, hasCloudBackup: false })).toBe(200);
  });
  it("adds R$90 for cloud backup", () => {
    expect(calculateTotal({ pcCount: 1, hasServer: false, hasCloudBackup: true })).toBe(140);
  });
  it("caps computers at 30", () => {
    expect(calculateTotal({ pcCount: 50, hasServer: false, hasCloudBackup: false })).toBe(1500);
  });
  it("suggests plans by size", () => {
    expect(suggestPlan({ pcCount: 5, hasServer: false, hasCloudBackup: false })).toBe("Start");
    expect(suggestPlan({ pcCount: 10, hasServer: false, hasCloudBackup: false })).toBe("Pro");
    expect(suggestPlan({ pcCount: 20, hasServer: false, hasCloudBackup: false })).toBe("Corporate");
  });
});
