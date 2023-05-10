import React from "react";

import { useRouter } from "next/router";
import NextLink from "next/link";

import {
  Circle,
  HStack,
  VStack,
  Text,
  Image,
  Icon,
  Link,
} from "@chakra-ui/react";

import { Logo } from "@/components/Logo";

interface NavLinkProps {
  iconSrc: string;
  href: string;
  children: React.ReactNode;
}

const NavLink = ({ children, iconSrc, href }: NavLinkProps) => {
  const MyIcon = () => <Image src={iconSrc} />;

  return (
    <NextLink href={href}>
      <HStack
        as={Link}
        spacing={4}
        _hover={{ cursor: "pointer", opacity: "0.9", textDecoration: "none" }}
      >
        <Icon as={MyIcon} />

        <Text
          fontSize={["sm", "md", "lg", "lg"]}
          fontWeight="500"
          display={["none", "none", "flex", "flex"]}
        >
          {children}
        </Text>
      </HStack>
    </NextLink>
  );
};

interface GroupLinkProps {
  index: number;
  id: number;
  isActive: boolean;
  children: React.ReactNode;
}

const GroupLink = ({ index, id, isActive, children }: GroupLinkProps) => {
  const colors = ["#0047FF", "#2DCD5B", "#B92CEB", "#6AD0E2"];
  const color = colors[(index as number) % colors.length];

  return (
    <NextLink passHref href={`/home/group/${id}`}>
      <HStack
        key={index}
        as={Link}
        w="100%"
        px={4}
        py={2}
        spacing={4}
        bgColor={isActive ? "#0047FF14" : "none"}
        _hover={{
          cursor: "pointer",
          bgColor: "#0047FF14",
          textDecoration: "none",
        }}
      >
        <Circle size={2} bgColor={color} />

        <Text
          fontSize="sm"
          fontWeight="500"
          display={["none", "none", "flex", "flex"]}
        >
          {children}
        </Text>
      </HStack>
    </NextLink>
  );
};

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

  return (
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
        <Text fontSize={["lg", "lg", "xl", "xl"]} fontWeight="600">
          Grupos
        </Text>

        <VStack align="start" px={2} spacing={2}>
          {userGroups.map((group, index) => {
            return (
              <GroupLink
                index={index}
                id={group.id}
                isActive={router.query.group === group.id.toString()}
              >
                {group.name}
              </GroupLink>
            );
          })}
        </VStack>
      </VStack>
    </VStack>
  );
};
