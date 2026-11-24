import { memo, use } from "react";
import type { Task, TaskPreview } from "../../../../api/interfaces";
import { Card, Flex, Tag } from "antd";

function burnCpu(iterations: number) {
  let x = 0;
  for (let i = 0; i < iterations; i++) {
    x += Math.sqrt(i);
  }
  return x;
}

import styles from "./TasksList.module.scss";
import { getGroupBy } from "../../../../helpers/groupBy";
import { PRIORITY_COLOR } from "../../../../api/const";

const SlowItem = memo(({ task }: { task: Task | TaskPreview }) => {
  // искусственная нагрузка, чтобы лаг был заметен
  const cost = burnCpu(300_000);

  return (
    <Card
      data-cost={Math.round(cost)}
      title={task.title}
      loading={task.pending}
      className={styles.taskCard}
    >
      {"priority" in task && "tags" in task && (
        <div className={styles.taskCard__content}>
          <Flex gap="small" align="center" wrap>
            <Tag color={PRIORITY_COLOR[task.priority]}>{task.priority}</Tag>
            <span>
              {task.tags?.map((el) => (
                <Tag>{el}</Tag>
              ))}
            </span>
          </Flex>
        </div>
      )}
    </Card>
  );
});

interface ITasksList {
  fetchTasks: Promise<Task[]>;
  pendingTasks: TaskPreview[];
  search: string;
  groupBy: keyof Task | undefined;
}

export const TasksList = memo(
  ({ fetchTasks, pendingTasks, search, groupBy }: ITasksList) => {
    const tasks = use(fetchTasks);
    const formattedSearch = search.trim().toLowerCase();
    let filtered;

    if (groupBy) {
      filtered = Object.values(
        getGroupBy(tasks, (el: Task) =>
          Array.isArray(el[groupBy]) ? el[groupBy][0] : el[groupBy],
        ),
      ).flat();
    } else {
      filtered = [...pendingTasks, ...tasks].filter((el) =>
        el.title.toLowerCase().includes(formattedSearch),
      );
    }

    
    return (
      <div className={styles.tasksList}>
        {filtered.map((task) => (
          <SlowItem task={task} key={task.id} />
        ))}
      </div>
    );
  },
);
