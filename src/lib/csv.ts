import { parse } from "csv-parse/sync";

export type CsvRecord = Record<string, string>;

export function parseCsv(content: string) {
  return parse(content, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  }) as CsvRecord[];
}

export function parseJsonArrayField(value?: string) {
  if (!value) return [];
  const trimmed = value.trim();
  if (!trimmed) return [];
  if (trimmed.startsWith("[")) {
    try {
      return JSON.parse(trimmed);
    } catch {
      return [];
    }
  }
  if (trimmed.startsWith("{")) {
    return trimmed
      .replace(/^{|}$/g, "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return trimmed.split("|").map((item) => item.trim()).filter(Boolean);
}
