import {
  Suspense,
  useActionState,
  useDeferredValue,
  useOptimistic,
  useState,
  useTransition,
} from "react";

import type {
  FormState,
  NewTaskValues,
  Task,
  TaskPreview,
} from "../../api/interfaces";
import { fetchTasks, addTask } from "../../api/taskApi";
import { TasksList } from "./components/tasksList/TasksList";

import { Button, Input, notification, Select } from "antd";
import { TaskFormModal } from "./components";

import styles from "./TaskPage.module.scss";
import { useLocalStorage } from "../../hooks/useLocalStorage";

const NO_PENDING: Task[] = [];

const groupByOptions: {
  label: string;
  value: keyof Task | null;
}[] = [
  { label: "Нет", value: null },
  {
    label: "Приоритет",
    value: "priority",
  },
  {
    label: "Тэг",
    value: "tags",
  },
];

export const TaskPage = () => {
  const [pendingTasks, setPendingTasks] =
    useOptimistic<TaskPreview[]>(NO_PENDING);
  const [isPending, startTransition] = useTransition(); // СОЗДАНО ДЛЯ ОБНОВЛЕНИЙ
  const [tasksPromise, setTasksPromise] = useState(() => fetchTasks()); //useMemo это подсказка для оптимизации, а не гарантия: React вправе выбросить кэш и пересоздать значение. Для промиса это плохо, потому что запрос уйдёт заново, и компонент снова «зависнет». Надёжнее ленивая инициализация состояния: Функция в useState(() => ...) выполнится один раз, при первом рендере, и промис будет жить, пока жив компонент

  const [openedModal, setOpenedModal] = useState(false);
  const [search, setSearch] = useLocalStorage("search", "");
  const [groupBy, setGroupBy] = useLocalStorage("groupBy", null);
  const deferredSearch = useDeferredValue(search);

  const [notificationData, notificationtHolder] =
    notification.useNotification();

  const openNotification = (description: string) => {
    notificationData.info({
      title: `Пупупурупурупу`,
      description,
    });
  };

  const onAddTask = async (
    _prev: FormState,
    formData: NewTaskValues,
  ): Promise<FormState> => {
    const { title, priority, tags } = formData;

    try {
      setPendingTasks((current) => [
        {
          id: ` temp-${crypto.randomUUID()}`,
          title,
        },
        ...current,
      ]);

      const task = await addTask({ title, priority, tags });

      startTransition(() => {
        setTasksPromise((prev) => prev.then((list) => [task, ...list]));
      });
      setOpenedModal(false);
      openNotification("Ура, новая задача успешно добавлена");
      return { status: "success" };
    } catch (e) {
      openNotification("Ну чет не пошло");
      return {
        status: "error",
        errorText: e instanceof Error ? e.message : "Что-то пошло не так",
        title,
      };
    }
  };

  const [addTaskState, handleAddTask, isAddTaskLoad] = useActionState(
    onAddTask,
    { status: "idle" },
  );

  const isListOld = deferredSearch !== search;
  const getTasksData = () => {
    startTransition(() => {
      setTasksPromise(fetchTasks());
    });
  };

  return (
    <main>
      <h1>Трекер задач</h1>
      <div className={styles.taskPage}>
        <div className={styles.taskPage__bar}>
          <Input
            placeholder="Это поиск"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="large"
            allowClear
          />

          <Button
            onClick={() => setOpenedModal(true)}
            disabled={isAddTaskLoad || isPending}
            type="primary"
            size="large"
          >
            Добавить задачу
          </Button>

          <Button
            onClick={getTasksData}
            disabled={isAddTaskLoad || isPending}
            type="default"
            size="large"
          >
            {isPending ? "Обновляю…" : "Обновить"}
          </Button>

          <Select
            prefix={"Группировать: "}
            defaultValue={groupBy}
            options={groupByOptions}
            onChange={setGroupBy}
            disabled={isAddTaskLoad || isPending}
            size="large"
          />
        </div>

        {isListOld && (
          <span style={{ color: "darkkhaki" }}>
            Список старый, сейчас подгрузится
          </span>
        )}

        <Suspense fallback={<p>Грузим…</p>}>
          <TasksList
            fetchTasks={tasksPromise}
            search={deferredSearch}
            groupBy={groupBy}
            pendingTasks={pendingTasks}
          />
        </Suspense>

        {notificationtHolder}
        {openedModal && (
          <TaskFormModal
            isLoad={isAddTaskLoad}
            onOk={handleAddTask}
            onCancel={() => setOpenedModal(false)}
          />
        )}
      </div>
    </main>
  );
};
