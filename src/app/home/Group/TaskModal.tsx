import React from "react";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  Heading,
  ModalBody,
  VStack,
  Text,
  ModalCloseButton,
  HStack,
  Circle,
  ModalFooter,
  Button,
} from "@chakra-ui/react";

import type { Task } from "@/database/functions";
import { format } from "date-fns";

import { useAuth } from "@/hooks/useAuth";

import axios from "axios";
import type { TSetColumns } from "./utils/functions";

interface TaskModalProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  setColumns: TSetColumns;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  task,
  isOpen,
  onClose,
  setColumns,
}) => {
  const { user } = useAuth();

  const handleExcludeTask = () => {
    setColumns((prev) => {
      const tasks = Object.entries(prev)
        .map(([id, column]) => column.tasks)
        .flat();

      const newTasks = tasks.filter((_task) => _task.id !== task.id + 1);

      const newColumns = {
        ...prev,
        "0": {
          ...prev["0"],
          tasks: newTasks.filter((task) => task.status === "todo"),
        },
        "1": {
          ...prev["1"],
          tasks: newTasks.filter((task) => task.status === "doing"),
        },
        "2": {
          ...prev["2"],
          tasks: newTasks.filter((task) => task.status === "done"),
        },
      };

      axios.post("/api/res/deleteGroupTask", { taskId: task.id + 1 });

      return newColumns;
    });

    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bgColor="background" px={4} py={8}>
        <ModalCloseButton />

        <ModalBody>
          <VStack w="100%" spacing={6} align="start">
            <Heading color="blue.100" fontSize="3xl" fontWeight="700">
              {task.title}
            </Heading>

            <Text color="gray.100" fontWeight="400" fontSize="md">
              {task.description}
            </Text>

            <VStack align="start" spacing={2}>
              <Text
                color="gray.200"
                fontSize="sm"
                fontWeight="700"
                textTransform="uppercase"
              >
                data de criação
              </Text>

              <Text color="gray.100" fontWeight="400" fontSize="md">
                {format(new Date(task.createdAt), "dd/MM/yyyy")}
              </Text>
            </VStack>

            <VStack align="start" spacing={2}>
              <Text
                color="gray.200"
                fontSize="sm"
                fontWeight="700"
                textTransform="uppercase"
              >
                prazo de entrega
              </Text>

              <Text color="gray.100" fontWeight="400" fontSize="md">
                {format(new Date(task.deadline), "dd/MM/yyyy")}
              </Text>
            </VStack>

            <VStack align="start" spacing={2}>
              <Text
                color="gray.200"
                fontSize="sm"
                fontWeight="700"
                textTransform="uppercase"
              >
                participantes
              </Text>

              <HStack spacing={2}>
                <Circle size="5px" bgColor="gray.100" />

                <Text color="gray.100" fontWeight="400" fontSize="md">
                  {user!.name}
                </Text>
              </HStack>
            </VStack>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <HStack w="100%" justify="start">
            <Button
              bgColor="red.500"
              color="white"
              _hover={{ opacity: 0.7 }}
              _active={{ opacity: 0.7 }}
              onClick={handleExcludeTask}
            >
              Excluir Tarefa
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
