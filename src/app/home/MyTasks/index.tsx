import React, { Dispatch, SetStateAction, useMemo, useState } from "react";

import { useAuth } from "@/hooks/useAuth";

import { VStack, Heading, HStack, Progress, Text } from "@chakra-ui/react";

import { Page } from "../components/Page";
import { TasksCard } from "./TaskCard";

import { LoadPage } from "@/components/LoadPage";

import { DragDropContext, DropResult } from "react-beautiful-dnd";

import axios from "axios";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import type { Task } from "@/database/functions";

export const getColumns = (tasks: Task[]) => {
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

const onDragEnd = (
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

const getProgress = (columns: TColumns) => {
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

const getTimeline = (columns: TColumns) => {
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

export const MyTasks = () => {
  const { user } = useAuth();

  if (!user) return <LoadPage />;

  const initialColumns = getColumns(user!.tasks);

  const [columns, setColumns] = useState(initialColumns);

  const progress = useMemo(() => getProgress(columns), [columns]);
  const { oldestDate, newestDate } = useMemo(
    () => getTimeline(columns),
    [columns]
  );

  return (
    <Page title="Minhas Tarefas">
      <VStack
        w="100%"
        h="100%"
        p={10}
        spacing={0}
        align="start"
        justify="start"
      >
        <VStack w="100%" spacing={12} align="start">
          <VStack w="100%" spacing={4} align="start">
            <VStack spacing={4} align="start">
              <Heading color="blue.100" fontSize="4xl" fontWeight="700">
                Todas as tarefas
              </Heading>
              {oldestDate && newestDate && (
                <Text color="gray.200" fontSize="sm" fontWeight="500">
                  {oldestDate} - {newestDate}
                </Text>
              )}
            </VStack>

            <VStack w="100%" spacing={2}>
              <HStack
                color="blue.100"
                fontSize="lg"
                fontWeight="500"
                spacing={2}
                alignSelf={["start", "end", "end", "end"]}
              >
                <Text>Em andamento</Text>
                <Text>{progress}%</Text>
              </HStack>

              <Progress
                w="100%"
                value={Number(progress)}
                colorScheme="blue"
                bgColor="#F1F2F7"
                size="sm"
                borderRadius="full"
              />
            </VStack>
          </VStack>

          <DragDropContext
            onDragEnd={(result) =>
              onDragEnd(result, user.id, columns, setColumns)
            }
          >
            <HStack w="100%" spacing={8} align="start" justify="space-between">
              {Object.entries(columns).map(([columnId, column], index) => {
                return (
                  <TasksCard
                    key={columnId}
                    type={
                      ["todo", "doing", "done"][index] as
                        | "todo"
                        | "doing"
                        | "done"
                    }
                    column={column}
                    columnId={columnId}
                    setColumns={setColumns}
                  />
                );
              })}
            </HStack>
          </DragDropContext>
        </VStack>
      </VStack>
    </Page>
  );
};
