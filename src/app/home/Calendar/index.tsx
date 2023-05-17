import React, { useMemo, useState } from "react";

import { Page } from "../components/Page";

import {
  VStack,
  Heading,
  SimpleGrid,
  HStack,
  IconButton,
} from "@chakra-ui/react";

import { Day } from "./Day";

import { AiOutlineArrowLeft } from "react-icons/ai";
import { AiOutlineArrowRight } from "react-icons/ai";

import {
  getDatesInMonth,
  formatMonthYear,
  getDayFromDate,
  getNextMonthYear,
  getPreviousMonthYear,
} from "./utils/timeFunctions";

import { LoadPage } from "@/components/LoadPage";

import { useAuth } from "@/hooks/useAuth";

import type { Task } from "@/database/functions";

function groupTasksByDay(tasks: Task[]): Record<string, Task[]> {
  const tasksByDay: Record<string, Task[]> = {};

  tasks.forEach((task) => {
    const deadlineDate = new Date(task.deadline).toLocaleDateString();
    if (!tasksByDay[deadlineDate]) {
      tasksByDay[deadlineDate] = [];
    }
    tasksByDay[deadlineDate].push(task);
  });

  return tasksByDay;
}

export const Calendar: React.FC = () => {
  const { user } = useAuth();

  const [month, setMonth] = useState([
    new Date().getMonth(),
    new Date().getFullYear(),
  ]);

  if (!user) return <LoadPage />;

  const tasks = groupTasksByDay(user.tasks);

  const handleChangeMonth = (plus: boolean) => {
    setMonth((prev) => {
      if (plus) {
        return getNextMonthYear(prev[0], prev[1]);
      } else {
        return getPreviousMonthYear(prev[0], prev[1]);
      }
    });
  };

  const days = getDatesInMonth(month[1], month[0]);

  return (
    <Page title="Calendário">
      <VStack
        w="100%"
        h="100%"
        p={10}
        spacing={10}
        align="start"
        justify="start"
      >
        <HStack spacing={2}>
          <IconButton
            icon={<AiOutlineArrowLeft />}
            aria-label="left"
            bgColor="white"
            _hover={{ opacity: 0.7 }}
            _active={{ opacity: 0.9 }}
            onClick={() => handleChangeMonth(false)}
          />

          <Heading fontSize="2xl" fontWeight="700">
            {formatMonthYear(month[0] + 1, month[1])}
          </Heading>

          <IconButton
            icon={<AiOutlineArrowRight />}
            aria-label="right"
            bgColor="white"
            _hover={{ opacity: 0.7 }}
            _active={{ opacity: 0.9 }}
            onClick={() => handleChangeMonth(true)}
          />
        </HStack>

        <SimpleGrid
          w="100%"
          minChildWidth="14%"
          borderLeft="solid 1px"
          borderTop="solid 1px"
          borderColor="#E8E8E8"
          borderRadius="lg"
        >
          {days.map((day) => {
            return (
              <Day key={day} day={day} tasks={tasks[day]}>
                {getDayFromDate(day)}
              </Day>
            );
          })}
        </SimpleGrid>
      </VStack>
    </Page>
  );
};
