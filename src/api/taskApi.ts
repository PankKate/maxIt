// import { bigMock } from "./bigMock";
import type { NewTask, Task, TaskPatch } from "./interfaces";
import { mock } from "./mock";

let editedMock: Task[] = [...mock];

// Readonly<Task>          // запрещает менять поля одной задачи
// Readonly<Task>[]        // каждая задача защищена, но сам массив можно менять (push, splice)
// readonly Task[]         // массив защищён, но поля задач можно менять
// readonly Readonly<Task>[]  // защищено и то и другое

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function fetchTasks(): Promise<Task[]> {
  await sleep(800);
  return [...editedMock];
}

export async function addTask(data: NewTask): Promise<Task> {
  await sleep(1000);
  if (data.title.toLowerCase().includes("fail"))
    throw new Error("Сервер сказал нет 💀");
  const task = { id: crypto.randomUUID(), status: "todo", ...data };
  editedMock = [task, ...editedMock];

  return task;
}

export async function updateTask(id: string, patch: TaskPatch): Promise<void> {
  await sleep(1000);

  editedMock = editedMock.map((el) =>
    el.id === id ? { ...el, ...patch } : el,
  );
}
