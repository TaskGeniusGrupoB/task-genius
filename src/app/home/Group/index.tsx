import React, { useMemo, useState } from "react";

import { useRouter } from "next/router";

import { useAuth } from "@/hooks/useAuth";

import {
  VStack,
  Heading,
  HStack,
  Progress,
  Text,
  Image,
} from "@chakra-ui/react";

import { Page } from "../components/Page";
import { TasksCard } from "./TaskCard";

import { LoadPage } from "@/components/LoadPage";

import { DragDropContext } from "react-beautiful-dnd";

import {
  getColumns,
  getProgress,
  getTimeline,
  onDragEnd,
} from "./utils/functions";

const PersonIcon = ({ index }: { index: number }) => {
  return <Image key={index} src="/icons/Person.png" h={8} />;
};

export const Group = () => {
  const { user } = useAuth();

  const router = useRouter();
  const { group } = router.query;

  if (!user) return <LoadPage />;

  const initialColumns = getColumns({ tasks: user.tasks });
  // user.groups[group].tasks

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

            <VStack w="100%" spacing={4}>
              <HStack w="100%" align="center" justify="space-between">
                <HStack spacing={2}>
                  {[1, 2, 3].map((member, index) => {
                    return <PersonIcon index={index} />;
                  })}
                </HStack>

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
