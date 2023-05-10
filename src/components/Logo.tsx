import React from "react";

import { HStack, Heading, Image } from "@chakra-ui/react";

export const Logo: React.FC = () => {
  return (
    <HStack spacing={[2, 2, 4, 4]}>
      <Image src="/logo/logo.png" />

      <Heading
        fontSize={["lg", "lg", "xl", "2xl"]}
        color="#0D0F43"
        fontWeight="700"
        display={["none", "none", "flex", "flex"]}
      >
        TaskGenius
      </Heading>
    </HStack>
  );
};
