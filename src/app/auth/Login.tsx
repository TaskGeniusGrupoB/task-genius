import React, { useRef } from "react";

import NextLink from "next/link";

import {
  Button,
  VStack,
  Link,
  Text,
  Heading,
  ToastId,
  useToast,
  useDisclosure,
} from "@chakra-ui/react";

import { Logo } from "@/components/Logo";
import { Input } from "./components/Input";

import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { ForgotPasswordModal } from "./ForgotPasswordModal";

import { useAuth } from "@/hooks/useAuth";

type FormData = {
  email: string;
  password: string;
};

const validationSchema = yup.object().shape({
  email: yup
    .string()
    .email("Email inválido.")
    .required("O campo email é obrigatório."),
  password: yup.string().required("O campo senha é obrigatório."),
});

export const Login: React.FC = () => {
  const { signIn } = useAuth();

  const toast = useToast();
  const toastIdRef = useRef<ToastId>();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const { register, handleSubmit, formState } = useForm<FormData>({
    resolver: yupResolver(validationSchema),
  });
  const { errors } = formState;

  const onSubmit: SubmitHandler<FormData> = async ({ email, password }) => {
    try {
      await signIn({ email, password });
    } catch (err) {
      toastIdRef.current = toast({
        title: "Credenciais inválidas",
        description: "Verifique suas credenciais e tente novamente.",
        status: "error",
        duration: 4000,
      });
    }
  };

  return (
    <>
      <VStack
        w="100%"
        h="100%"
        minW="100vw"
        minH="100vh"
        align="center"
        justify="center"
        bg="primary"
      >
        <VStack
          as="form"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          bg="background"
          borderRadius="xl"
          p={10}
          spacing={4}
          align="center"
          justify="center"
        >
          <VStack spacing={4}>
            <Logo />

            <VStack spacing={2}>
              <Heading fontSize="xl" fontWeight="500">
                Bem-vindo de volta!
              </Heading>

              <Text fontSize="sm" color="gray.100" fontWeight="400">
                Entre com sua conta
              </Text>
            </VStack>
          </VStack>

          <VStack w="100%" spacing={4}>
            <Input
              placeholder="Email"
              iconSrc="/icons/Email.svg"
              {...register("email")}
              error={errors.email}
            />

            <VStack w="100%" spacing={3}>
              <Input
                placeholder="Senha"
                iconSrc="/icons/Password.svg"
                type="password"
                {...register("password")}
                error={errors.password}
              />

              <Link
                fontSize="sm"
                color="blue"
                fontWeight="400"
                _hover={{}}
                alignSelf="end"
                onClick={onOpen}
              >
                Esqueci a senha
              </Link>
            </VStack>
          </VStack>

          <Text fontSize="sm" color="gray.100" fontWeight="400">
            Ainda não tem uma conta?{" "}
            <Link as={NextLink} href="/auth/signup" color="blue" _hover={{}}>
              Criar conta
            </Link>
          </Text>

          <Button
            type="submit"
            w="100%"
            maxW={80}
            minH={12}
            bgColor="blue"
            color="white"
            fontWeight="600"
            _hover={{ opacity: "0.7" }}
            _active={{}}
            isLoading={formState.isSubmitting}
          >
            Entrar
          </Button>
        </VStack>
      </VStack>

      <ForgotPasswordModal isOpen={isOpen} onClose={onClose} />
    </>
  );
};
