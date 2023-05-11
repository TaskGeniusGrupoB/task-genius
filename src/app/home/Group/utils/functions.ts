import type { Dispatch, SetStateAction } from "react";

import axios from "axios";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import type { Task } from "@/database/functions";

import type { DropResult } from "react-beautiful-dnd";

export const getColumns = ({ tasks }: { tasks: Task[] }) => {
  if (!tasks) {
    return {
      "0": {
        name: "A Fazer",
        tasks: [] as Task[],
      },
      "1": {
        name: "Fazendo",
        tasks: [] as Task[],
      },
      "2": {
        name: "Feito",
        tasks: [] as Task[],
      },
    };
  }

  const todo = tasks.filter((task) => task.status === "todo");
  const doing = tasks.filter((task) => task.status === "doing");
  const done = tasks.filter((task) => task.status === "done");

  return {
    "0": {
      name: "A Fazer",
      tasks: todo,
    },
    "1": {
      name: "Fazendo",
      tasks: doing,
    },
    "2": {
      name: "Feito",
      tasks: done,
    },
  };
};

type TColumns = ReturnType<typeof getColumns>;

export type TSetColumns = Dispatch<SetStateAction<TColumns>>;

export const onDragEnd = (
  result: DropResult,
  userId: number,
  columns: TColumns,
  setColumns: TSetColumns
) => {
  if (!result.destination) return;

  const { source, destination } = result;

  let newColumns: TColumns;

  if (source.droppableId !== destination.droppableId) {
    const sourceColumn = columns[source.droppableId as keyof typeof columns];
    const destColumn = columns[destination.droppableId as keyof typeof columns];
    const sourceItems = [...sourceColumn.tasks];
    const destItems = [...destColumn.tasks];
    const [removed] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, removed);

    newColumns = {
      ...columns,
      [source.droppableId]: {
        ...sourceColumn,
        tasks: sourceItems,
      },
      [destination.droppableId]: {
        ...destColumn,
        tasks: destItems,
      },
    };
  } else {
    const column = columns[source.droppableId as keyof typeof columns];
    const copiedItems = [...column.tasks];
    const [removed] = copiedItems.splice(source.index, 1);
    copiedItems.splice(destination.index, 0, removed);

    newColumns = {
      ...columns,
      [source.droppableId]: {
        ...column,
        tasks: copiedItems,
      },
    };
  }

  setColumns(newColumns);

  Object.entries(newColumns).forEach(([id, column], index) => {
    column.tasks.forEach((task, _index) => {
      task.status = ["todo", "doing", "done"][index] as
        | "todo"
        | "doing"
        | "done";

      task.id = index + _index + 1;
    });
  });

  const tasks = [
    ...newColumns[0].tasks,
    ...newColumns[1].tasks,
    ...newColumns[2].tasks,
  ];

  axios.post("/api/res/updateTasks", { userId, tasks });
};

export const getProgress = (columns: TColumns) => {
  const tasks = Object.entries(columns)
    .map(([id, column]) => column.tasks)
    .flat();

  if (tasks.length === 0) return "0";

  const count = tasks.reduce((accumulator, task) => {
    if (task.status === "doing") {
      return accumulator + 0.5;
    } else if (task.status === "done") {
      return accumulator + 1;
    } else {
      return accumulator;
    }
  }, 0);

  return ((100 * count) / tasks.length).toFixed();
};

export const getTimeline = (columns: TColumns) => {
  const tasks = Object.entries(columns)
    .map(([id, column]) => column.tasks)
    .flat();

  if (tasks.length < 2) {
    return { oldestDate: null, newestDate: null };
  }

  const sortedTasks = tasks.sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return dateA.getTime() - dateB.getTime();
  });

  const oldestTask = format(
    new Date(sortedTasks[0].createdAt),
    "dd 'de' MMMM, yyyy",
    { locale: ptBR }
  );

  const newestTask = format(
    new Date(sortedTasks[sortedTasks.length - 1].createdAt),
    "dd 'de' MMMM, yyyy",
    { locale: ptBR }
  );

  return {
    oldestDate: oldestTask,
    newestDate: newestTask,
  };
};
