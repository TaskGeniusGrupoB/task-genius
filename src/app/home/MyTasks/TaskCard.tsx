import React, { Dispatch, SetStateAction } from "react";

import {
  VStack,
  HStack,
  Text,
  Divider,
  Image,
  Button,
  useDisclosure,
} from "@chakra-ui/react";

import { Droppable, Draggable } from "react-beautiful-dnd";

import { CreateTaskModal } from "./CreateTaskModal";
import { TaskModal } from "./TaskModal";

import { format } from "date-fns";

import type { Task } from "@/database/functions";
import type { TSetColumns } from ".";

interface CardProps {
  index: number;
  id: number;
  title: string;
  description: string;
  createdAt: string;
  deadline: string;
  status: "todo" | "doing" | "done";
  setColumns: TSetColumns;
}

const Card = ({
  index,
  id,
  title,
  description,
  createdAt,
  deadline,
  status,
  setColumns,
}: CardProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Draggable key={id} draggableId={id.toString()} index={index}>
        {(provided) => (
          <VStack
            w="100%"
            p={4}
            spacing={6}
            align="start"
            justify="center"
            border="solid 1px"
            borderColor="#E5E5E5"
            borderRadius="lg"
            bgColor="white"
            _hover={{ cursor: "pointer", opacity: 0.9 }}
            onClick={onOpen}
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <VStack spacing={4} align="start">
              <Text color="blue.100" fontSize="lg" fontWeight="600">
                {title}
              </Text>

              <Text color="gray.100" fontSize="sm" fontWeight="400">
                {description}
              </Text>
            </VStack>

            <HStack
              w="100%"
              justify={[
                "start",
                "space-between",
                "space-between",
                "space-between",
              ]}
            >
              <Image
                src="/icons/Person.png"
                h={8}
                display={["none", "none", "flex", "flex"]}
              />

              <Text color="red.500" fontSize="sm" fontWeight="500">
                {format(new Date(deadline), "dd/MM/yyyy")}
              </Text>
            </HStack>
          </VStack>
        )}
      </Draggable>

      <TaskModal
        task={{ id, title, description, deadline, createdAt, status }}
        isOpen={isOpen}
        onClose={onClose}
        setColumns={setColumns}
      />
    </>
  );
};

interface TasksCardProps {
  columnId: string;
  type: "todo" | "doing" | "done";
  column: {
    name: string;
    tasks: Task[];
  };
  setColumns: TSetColumns;
}

export const TasksCard: React.FC<TasksCardProps> = ({
  type,
  columnId,
  column,
  setColumns,
}) => {
  const {
    isOpen: createTaskModalIsOpen,
    onOpen: createTaskModalOnOpen,
    onClose: createTaskModalOnClose,
  } = useDisclosure();

  const colors = {
    todo: "#FF00003D",
    doing: "#0047FF3D",
    done: "#2BB73D3D",
  };

  return (
    <>
      <VStack w="33%" spacing={2} align="start" key={columnId}>
        <Text color="blue.100" fontSize="xl" fontWeight="500">
          {
            {
              todo: "A Fazer",
              doing: "Fazendo",
              done: "Feito",
            }[type]
          }
        </Text>

        <Divider
          h="4px"
          bgColor={colors[type]}
          border="none"
          borderRadius="full"
        />

        <Droppable droppableId={columnId} key={columnId}>
          {(provided) => (
            <VStack
              w="100%"
              spacing={4}
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {column.tasks.map(
                ({ id, title, description, createdAt, deadline }, index) => {
                  return (
                    <Card
                      index={index}
                      id={id - 1}
                      title={title}
                      description={description}
                      createdAt={createdAt}
                      deadline={deadline}
                      status={type}
                      setColumns={setColumns}
                    />
                  );
                }
              )}

              {provided.placeholder}
            </VStack>
          )}
        </Droppable>

        {type === "todo" && (
          <Button
            w="100%"
            py={4}
            borderRadius="lg"
            bgColor="rgba(0, 71, 255, 0.08)"
            color="rgba(0, 71, 255, 0.78)"
            _hover={{ opacity: 0.7 }}
            _active={{ opacity: 0.7 }}
            onClick={createTaskModalOnOpen}
          >
            <HStack>
              <Text>Criar tarefa</Text>
              <Image src="/icons/Add.svg" h="16px" />
            </HStack>
          </Button>
        )}
      </VStack>

      <CreateTaskModal
        isOpen={createTaskModalIsOpen}
        onClose={createTaskModalOnClose}
        setColumns={setColumns}
      />
    </>
  );
};
