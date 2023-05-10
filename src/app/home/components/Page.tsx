import React from "react";

import { HStack, VStack } from "@chakra-ui/react";

import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

interface PageProps {
  children: React.ReactNode;
  title: string;
}

export const Page: React.FC<PageProps> = ({ children, title }) => {
  return (
    <HStack
      w="100%"
      h="100%"
      minH="100vh"
      minW="100vw"
      spacing={0}
      bg="primary"
      align="start"
    >
      <Sidebar />

      <VStack w="100%" h="100%" minH="100vh" bgColor="white">
        <Header title={title} />

        {children}
      </VStack>
    </HStack>
  );
};
