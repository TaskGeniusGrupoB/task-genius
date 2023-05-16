import NextLink from "next/link";

import { HStack, Icon, Circle, Link, Image, Text } from "@chakra-ui/react";

interface NavLinkProps {
  iconSrc: string;
  href: string;
  children: React.ReactNode;
}

export const NavLink = ({ children, iconSrc, href }: NavLinkProps) => {
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

export const GroupLink = ({
  index,
  id,
  isActive,
  children,
}: GroupLinkProps) => {
  const colors = ["#0047FF", "#2DCD5B", "#B92CEB", "#6AD0E2"];
  const color = colors[(index as number) % colors.length];

  return (
    <NextLink passHref href={`/home/group/${index}`}>
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
