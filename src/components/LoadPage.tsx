import React from "react";

import {
  VStack,
  Image,
  HStack,
  Heading,
  CircularProgress,
} from "@chakra-ui/react";

export const LoadPage: React.FC = () => {
  return (
    <VStack w="100vw" h="100vh" align="center" justify="center" spacing={4}>
      <HStack spacing={4}>
        <Image alt="logo" src="/logo/logo.png" />

        <Heading fontSize="2xl" color="#0D0F43" fontWeight="700">
          TaskGenius
        </Heading>
      </HStack>

      <CircularProgress
        isIndeterminate
        color="blue.500"
        size="30px"
        thickness="4px"
      />
    </VStack>
  );
};
