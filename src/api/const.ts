import type { Priority } from "./interfaces";

export const TAGS = [
  "react",
  "typescript",
  "keycloak",
  "devops",
  "life",
] as const;
export const PRIORITY = ["low", "medium", "high"] as const;
export const STATUS = ["todo", "inProgress", "testing", "done"] as const;

export const PRIORITY_COLOR = {
  low: "cyan",
  medium: "orange",
  high: "red",
} satisfies Record<Priority, string>;
