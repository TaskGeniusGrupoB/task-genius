import { VStack, Text } from "@chakra-ui/react";

import { DayTask } from "./DayTask";

import type { Task } from "@/database/functions";

interface DayProps {
  children: React.ReactNode;
  day: string;
  tasks: Task[];
}

export const Day = ({ children, day, tasks }: DayProps) => {
  return (
    <VStack
      key={day}
      w="100%"
      minH={40}
      h="100%"
      p={3}
      spacing={2}
      align="center"
      justify="space-between"
      borderRight="solid 1px"
      borderBottom="solid 1px"
      borderColor="#E8E8E8"
    >
      <Text color="#5A5B80" fontSize="xl" fontWeight="500" alignSelf="start">
        {children}
      </Text>

      <VStack w="100%" spacing={1}>
        {tasks &&
          tasks.length &&
          tasks.map((task, index) => {
            return <DayTask task={task} index={index} />;
          })}
      </VStack>
    </VStack>
  );
};
