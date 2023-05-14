import React from "react";

import { useRouter } from "next/router";

import {
  HStack,
  VStack,
  Text,
  IconButton,
  useDisclosure,
  Button,
} from "@chakra-ui/react";
import { AiOutlinePlus } from "react-icons/ai";

import { AddGroupModal } from "./AddGroupModal";
import { CreateGroupModal } from "./CreateGroupModal";

import { Logo } from "@/components/Logo";
import { NavLink, GroupLink } from "./Components";

import { useAuth } from "@/hooks/useAuth";

const userGroups = [
  {
    id: 1,
    name: "Química",
  },
  {
    id: 2,
    name: "Física",
  },
  {
    id: 3,
    name: "Cálculo II",
  },
  {
    id: 4,
    name: "TaskGenius",
  },
];

export const Sidebar: React.FC = () => {
  const router = useRouter();

  const { user } = useAuth();
  console.log("Sidebar", { user });
  console.log("Sidebar", { member: user?.member });
  console.log("Sidebar", { group: user?.member[0].group });

  const {
    isOpen: addGroupModalIsOpen,
    onOpen: addGroupModalOnOpen,
    onClose: addGroupModalOnClose,
  } = useDisclosure();

  const {
    isOpen: createGroupModalIsOpen,
    onOpen: createGroupModalOnOpen,
    onClose: createGroupModalOnClose,
  } = useDisclosure();

  return (
    <>
      <VStack
        w="20%"
        h="100%"
        minH="100vh"
        p={6}
        spacing={8}
        justify="start"
        align={["center", "center", "start", "start"]}
        bg="primary"
        color="#5A5B80"
      >
        <Logo />

        <VStack align="start" spacing={3}>
          <Text fontSize={["lg", "lg", "xl", "xl"]} fontWeight="600">
            Home
          </Text>

          <VStack align="start" pl={2} spacing={4}>
            <NavLink iconSrc="/icons/tasks.svg" href="/home">
              Minhas tarefas
            </NavLink>
            <NavLink iconSrc="/icons/calendar.svg" href="/home/calendar">
              Calendário
            </NavLink>
          </VStack>
        </VStack>

        <VStack align="start" spacing={3}>
          <HStack w="100%" justify="space-between">
            <Text fontSize={["lg", "lg", "xl", "xl"]} fontWeight="600">
              Grupos
            </Text>

            <IconButton
              aria-label="add-group"
              h={5}
              icon={<AiOutlinePlus />}
              bgColor="#0047FF14"
              _hover={{ opacity: 0.7 }}
              _active={{ opacity: 0.7 }}
              onClick={addGroupModalOnOpen}
            />
          </HStack>

          <VStack align="start" px={2} spacing={2}>
            {user?.member.map((member, index) => {
              return (
                <GroupLink
                  index={index}
                  id={member.group.id}
                  isActive={router.query.group === member.group.id.toString()}
                >
                  {member.group.name}
                </GroupLink>
              );
            })}

            <Button
              w="100%"
              bgColor="#0047FF14"
              onClick={createGroupModalOnOpen}
              _hover={{ opacity: 0.7 }}
              _active={{ opacity: 0.7 }}
            >
              Criar Grupo
            </Button>
          </VStack>
        </VStack>
      </VStack>

      <AddGroupModal
        isOpen={addGroupModalIsOpen}
        onClose={addGroupModalOnClose}
      />

      <CreateGroupModal
        isOpen={createGroupModalIsOpen}
        onClose={createGroupModalOnClose}
      />
    </>
  );
};
