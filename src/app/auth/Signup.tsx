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
} from "@chakra-ui/react";

import { Logo } from "@/components/Logo";
import { Input } from "./components/Input";

import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { useAuth } from "@/hooks/useAuth";

type FormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const validationSchema = yup.object().shape({
  name: yup.string().required("O campo nome é obrigatório."),
  email: yup
    .string()
    .email("Email inválido.")
    .required("O campo email é obrigatório."),
  password: yup
    .string()
    .min(6, "A senha deve conter no mínimo 6 caracteres.")
    .required("O campo senha é obrigatório."),
  confirmPassword: yup
    .string()
    .min(6, "A senha deve conter no mínimo 6 caracteres.")
    .oneOf([yup.ref("password")], "As senhas devem coincidir."),
});

export const SignUp: React.FC = () => {
  const { signUp } = useAuth();

  const toast = useToast();
  const toastIdRef = useRef<ToastId>();

  const { register, handleSubmit, formState } = useForm<FormData>({
    resolver: yupResolver(validationSchema),
  });
  const { errors } = formState;

  const onSubmit: SubmitHandler<FormData> = async ({
    name,
    email,
    password,
  }) => {
    try {
      await signUp({ email, name, password });
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
    <VStack
      w="100%"
      h="100%"
      minW="100vw"
      minH="100vh"
      align="center"
      justify="center"
      bg="linear-gradient(107.2deg, #9CBAFF 0.51%, rgba(235, 241, 255, 0) 100%)"
    >
      <VStack
        as="form"
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        bg="background"
        borderRadius="xl"
        px={10}
        py={8}
        spacing={4}
        align="center"
        justify="center"
      >
        <VStack spacing={4}>
          <Logo />

          <VStack spacing={2}>
            <Heading fontSize="xl" fontWeight="500">
              Bem-vindo
            </Heading>

            <Text fontSize="sm" color="gray.100" fontWeight="400">
              Crie sua conta
            </Text>
          </VStack>
        </VStack>

        <VStack w="100%" spacing={4}>
          <Input
            placeholder="Nome"
            iconSrc="/icons/Profile.svg"
            {...register("name")}
            error={errors.name}
          />
          <Input
            placeholder="Email"
            iconSrc="/icons/Email.svg"
            {...register("email")}
            error={errors.email}
          />

          <Input
            placeholder="Senha"
            iconSrc="/icons/Password.svg"
            type="password"
            {...register("password")}
            error={errors.password}
          />

          <Input
            placeholder="Confirmar Senha"
            iconSrc="/icons/Password.svg"
            type="password"
            {...register("confirmPassword")}
            error={errors.confirmPassword}
          />
        </VStack>

        <Text fontSize="sm" color="gray.100" fontWeight="400">
          Já tem uma conta?{" "}
          <Link as={NextLink} href="/auth/login" color="blue" _hover={{}}>
            Entre aqui
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
          Cadastrar-se
        </Button>
      </VStack>
    </VStack>
  );
};
