import { describe, it, expect } from "vitest";
import { calculateTotal, suggestPlan, waLink, toWaNumber } from "./pricing";

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

describe("whatsapp link", () => {
  it("adds country code 55 when missing", () => {
    expect(toWaNumber("(31) 99999-9999")).toBe("5531999999999");
  });
  it("keeps the country code when it is already there", () => {
    expect(toWaNumber("+55 31 99999-9999")).toBe("5531999999999");
  });
  it("builds the universal wa.me URL with a digits-only phone", () => {
    const url = waLink("+55 (31) 99999-9999", "Olá!");
    expect(url).toBe("https://wa.me/5531999999999?text=Ol%C3%A1!");
    expect(url).not.toMatch(/[+()\- ]/);
  });
  it("URL-encodes the message cleanly", () => {
    const msg = "Plano Start — R$ 250/mês\nEmpresa: Clínica";
    const url = waLink("31999999999", msg);
    expect(url.startsWith("https://wa.me/5531999999999?text=")).toBe(true);
    expect(url).toBe(`https://wa.me/5531999999999?text=${encodeURIComponent(msg)}`);
    expect(url).not.toContain(" ");
  });
});
