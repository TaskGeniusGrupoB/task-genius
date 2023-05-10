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
} from "@chakra-ui/react";

import type { Task } from "@/database/functions";
import { format } from "date-fns";

import { useAuth } from "@/hooks/useAuth";

interface TaskModalProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  task,
  isOpen,
  onClose,
}) => {
  const { user } = useAuth();

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
      </ModalContent>
    </Modal>
  );
};
