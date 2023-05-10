import { useDisclosure, VStack, Text } from "@chakra-ui/react";

import { TaskModal } from "./TaskModal";

import type { Task } from "@/database/functions";

interface DayTaskProps {
  task: Task;
  index: number;
}

export const DayTask = ({ task, index }: DayTaskProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <VStack
        w="100%"
        key={index}
        p={2}
        spacing={1}
        align="start"
        bgColor="primary"
        borderRadius="8px"
        onClick={onOpen}
        _hover={{ cursor: "pointer" }}
      >
        <VStack w={[4, 4, 8, 8]} h={1} borderRadius="full" bgColor="#0047FF" />
        <Text
          color="#0D062D"
          fontSize="xs"
          fontWeight="700"
          display={["none", "none", "flex", "flex"]}
        >
          {task.title}
        </Text>
        <Text
          color="#030303"
          fontSize="xs"
          fontWeight="700"
          display={["flex", "flex", "none", "none"]}
        >
          {index + 1}
        </Text>
      </VStack>

      <TaskModal isOpen={isOpen} onClose={onClose} task={task} />
    </>
  );
};
