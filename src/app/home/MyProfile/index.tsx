import React from "react";

import NextLink from "next/link";

import {
  VStack,
  Heading,
  HStack,
  Text,
  Avatar,
  Stack,
  SimpleGrid,
  Link,
} from "@chakra-ui/react";

import { Page } from "../components/Page";
import { useAuth } from "@/hooks/useAuth";
import { LoadPage } from "@/components/LoadPage";

interface GroupCardProps {
  href: string;
  title: string;
  description: string;
}

const GroupCard = ({ href, title, description }: GroupCardProps) => {
  return (
    <NextLink href={href}>
      <VStack
        as={Link}
        w="100%"
        p={4}
        spacing={6}
        align="start"
        justify="center"
        border="solid 1px"
        borderColor="#E5E5E5"
        borderRadius="lg"
        bgColor="white"
        _hover={{ opacity: 0.7, textDecoration: "none" }}
      >
        <VStack spacing={2} align="start">
          <Text color="blue.100" fontSize="lg" fontWeight="600">
            {title}
          </Text>

          <Text color="gray.100" fontSize="sm" fontWeight="400">
            {description}
          </Text>
        </VStack>
      </VStack>
    </NextLink>
  );
};

export const MyProfile = () => {
  const { user } = useAuth();

  if (!user) return <LoadPage />;

  const totalTasks =
    user.tasks.length +
    user.member.reduce((acumulador, { group }) => {
      return acumulador + group.tasks.length;
    }, 0);

  const totalGroups = user.member.length;

  return (
    <Page title="Meu Perfil">
      <VStack
        w="100%"
        h="100%"
        p={10}
        spacing={4}
        align="start"
        justify="start"
      >
        <Stack
          w="100%"
          p={8}
          spacing={4}
          bgColor="primary"
          borderRadius="xl"
          align={["center", "center", "start", "start"]}
          justify="space-between"
          direction={["column", "column", "row", "row"]}
        >
          <VStack h="100%" align="start" spacing={8} justify="space-between">
            <HStack spacing={4}>
              <Avatar size="lg" name={user.name} bgColor="blue.0" />

              <VStack align="start" spacing={0}>
                <Heading fontSize="2xl">{user.name}</Heading>
                <Text fontSize="sm" color="gray.200">
                  {user.email}
                </Text>
              </VStack>
            </HStack>
            <Text color="gray.200" fontSize="sm" fontStyle="italic">
              🔥 Especialista em Solução de Tarefas. 🚀
            </Text>
          </VStack>

          <HStack spacing={8} justify="space-between">
            <VStack align="center" spacing={0}>
              <Heading fontSize="xl">Tasks</Heading>
              <Text fontSize="sm" color="gray.200">
                {totalTasks}
              </Text>
            </VStack>

            <VStack align="center" spacing={0}>
              <Heading fontSize="xl">Grupos</Heading>
              <Text fontSize="sm" color="gray.200">
                {totalGroups}
              </Text>
            </VStack>
          </HStack>
        </Stack>

        <SimpleGrid w="100%" minChildWidth="30%" column={3} gap={4}>
          <GroupCard
            title="Minhas Tarefas"
            description={`Tarefas: ${user.tasks.length}`}
            href="/home"
          />

          {user.member.map(({ group }, index) => {
            return (
              <GroupCard
                key={index}
                href={`/home/group/${index}`}
                title={group.name}
                description={`Tarefas: ${group.tasks.length}`}
              />
            );
          })}
        </SimpleGrid>
      </VStack>
    </Page>
  );
};
