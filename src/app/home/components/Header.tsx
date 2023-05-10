import React from "react";

import {
  HStack,
  VStack,
  Heading,
  Text,
  Image,
  IconButton,
  Menu as ChakraMenu,
  MenuButton,
  MenuItem as ChakraMenuItem,
  MenuList,
} from "@chakra-ui/react";

import { useAuth } from "@/hooks/useAuth";

interface HeaderProps {
  title: string;
}

export const Header: React.FC<HeaderProps> = ({ title }) => {
  const { user } = useAuth();

  return (
    <HStack
      as="form"
      w="100%"
      py={4}
      pl={4}
      pr={8}
      justify="space-between"
      boxShadow="4px 5px 10px 0px rgba(0,0,0,0.1)"
    >
      <Heading fontSize="2xl" fontWeight="700" color="blue.100">
        {title}
      </Heading>

      <HStack spacing={8} align="center">
        <HStack spacing={4}>
          <Image src="/icons/Person.png" />

          <VStack spacing={0} align="start">
            <Text color="blue.100" fontSize="md" fontWeight="500">
              {user!.name}
            </Text>
            <Text color="gray.100" fontSize="xs" fontWeight="400">
              {user!.email}
            </Text>
          </VStack>
        </HStack>

        <Menu />
      </HStack>
    </HStack>
  );
};

interface MenuItemProps {
  iconSrc: string;
  onClick: () => void;
  children: React.ReactNode;
}

const MenuItem = ({ iconSrc, onClick, children }: MenuItemProps) => {
  return (
    <ChakraMenuItem
      bgColor="white"
      _hover={{ opacity: "0.7" }}
      py={4}
      borderBottom="solid 1px #383C48"
      _last={{ borderBottom: "none" }}
      onClick={onClick}
    >
      <HStack w="100%" spacing={6}>
        <Image src={iconSrc} />
        <Text color="blue.100">{children}</Text>
      </HStack>
    </ChakraMenuItem>
  );
};

const Menu = () => {
  const { signOut } = useAuth();

  return (
    <ChakraMenu>
      <MenuButton
        as={IconButton}
        icon={<Image src="/icons/Arrow-Down.svg" />}
        aria-label="menu"
        bgColor="transparent"
        _hover={{ bgColor: "white.100" }}
        _active={{ bgColor: "white.100" }}
      />
      <MenuList bgColor="white" border="solid 1px" borderColor="white.100">
        <VStack px={4} spacing={0} color="#C6C6C7">
          <MenuItem iconSrc="/icons/Logout.svg" onClick={signOut}>
            Sair
          </MenuItem>
        </VStack>
      </MenuList>
    </ChakraMenu>
  );
};
