import React, { Dispatch, SetStateAction, useEffect, useState } from "react";

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
  Circle,
} from "@chakra-ui/react";

import { useAuth } from "@/hooks/useAuth";

import type { Task } from "@/database/functions";

const getDeadlineNotifications = (_tasks: Task[]): Notification[] => {
  if (!_tasks.length) return [];

  const tasks = _tasks.filter(({ deadline }) => {
    const today = new Date();
    const maxDate = new Date();
    maxDate.setDate(today.getDate() + 3);
    const dateDeadline = new Date(deadline);

    return dateDeadline.getTime() <= maxDate.getTime();
  });

  const deadlineNotifications = tasks.map(({ title }) => {
    return {
      type: "deadline",
      msg: title,
    } as Notification;
  });

  return deadlineNotifications;
};

interface HeaderProps {
  title: string;
}

export const Header: React.FC<HeaderProps> = ({ title }) => {
  const { user, notifications } = useAuth();

  const [_notifications, setNotifications] = useState<Notification[]>();
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    if (user && notifications) {
      setNotifications([
        ...notifications,
        ...getDeadlineNotifications(
          !!user.tasks && !!user.tasks.length ? user.tasks : []
        ),
      ]);

      setIsOpen((prev) => !prev);
    }
  }, [user, notifications]);

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

      <HStack spacing={4} align="center">
        {_notifications && (
          <NotificationsMenu
            notifications={_notifications}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
          />
        )}

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

const messages = {
  "new-group": (group: string) => `Você ingressou no grupo: ${group}`,
  "created-group": (group: string) => `Grupo criado com sucesso! ${group}`,
  deadline: (task: string) => `Cuidado! Este prazo se aproxima: ${task}`,
  "task-created": (task: string) => `Tarefa criada com sucesso! ${task}`,
};

interface NotificationItemProps {
  type: keyof typeof messages;
  msg: string;
}

const NotificationItem = ({ type, msg }: NotificationItemProps) => {
  return (
    <ChakraMenuItem
      bgColor="#EBF1FF"
      _hover={{}}
      _active={{}}
      py={4}
      borderBottom="solid 1px"
      borderBottomColor="#CDD7EC"
      _last={{ borderBottom: "none" }}
    >
      <HStack w="100%" spacing={6}>
        <Circle bgColor="#F52828" size={2} />
        <Text color="blue.100" fontSize="sm" noOfLines={2}>
          {messages[type](msg)}
        </Text>
      </HStack>
    </ChakraMenuItem>
  );
};

export type Notification = {
  type: keyof typeof messages;
  msg: string;
};

interface NotificationsMenuProps {
  notifications: Notification[];
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const NotificationsMenu = ({
  notifications,
  isOpen,
  setIsOpen,
}: NotificationsMenuProps) => {
  return (
    <ChakraMenu isOpen={isOpen}>
      <MenuButton
        as={IconButton}
        icon={<Image src="/icons/Email.png" />}
        borderRadius="lg"
        border="none"
        bgColor="#EBF1FF"
        aria-label="menu"
        _hover={{ bgColor: "#EBF1FF" }}
        _active={{ bgColor: "#EBF1FF" }}
        onClick={() => setIsOpen((prev) => !prev)}
      />

      <MenuList
        bgColor="#EBF1FF"
        border="solid 1px"
        borderColor="white.100"
        px={4}
      >
        {notifications.map(({ type, msg }, index) => {
          return <NotificationItem type={type} msg={msg} key={index} />;
        })}
      </MenuList>
    </ChakraMenu>
  );
};
