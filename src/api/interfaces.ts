import type { PRIORITY, STATUS, TAGS } from "./const";

export type Priority = (typeof PRIORITY)[number];
export type Tag = (typeof TAGS)[number];
export type Status = (typeof STATUS)[number];

export type Task = {
  readonly id: string;
  title: string;
  priority: Priority;
  status: Status;
  pending?: boolean;
  tags?: Tag[];
};

export type NewTask = Omit<Task, "id" | "status" | "pending">;
export type TaskPatch = Partial<Omit<Task, "id">>;
export type TaskPreview = Pick<Task, "id" | "title" | "pending">;
export type TagCounts = Record<Tag, number>;

export type FormState =
  | { status: "idle" }
  | { status: "error"; errorText: string; title: string }
  | { status: "success" };
/* idle: ещё не отправляли
error: отправили, и не получилось
success: отправили, всё хорошо*/

export type NewTaskValues = { title: string; priority: Priority; tags: Tag[] };
