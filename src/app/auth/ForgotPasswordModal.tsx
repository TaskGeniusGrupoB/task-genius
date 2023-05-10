import React, { useRef } from "react";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  Heading,
  ModalBody,
  VStack,
  Button,
  ToastId,
  useToast,
} from "@chakra-ui/react";

import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { Input } from "@/components/Input";
import { useAuth } from "@/hooks/useAuth";

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type FormData = {
  email: string;
};

const validationSchema = yup.object().shape({
  email: yup
    .string()
    .email("Email inválido.")
    .required("O campo email é obrigatório."),
});

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { sendPasswordResetEmail } = useAuth();

  const toast = useToast();
  const toastIdRef = useRef<ToastId>();

  const { register, handleSubmit, formState } = useForm<FormData>({
    resolver: yupResolver(validationSchema),
  });
  const { errors } = formState;

  const onSubmit: SubmitHandler<FormData> = async ({ email }) => {
    try {
      await sendPasswordResetEmail({ email });

      toastIdRef.current = toast({
        title: "Email enviado!",
        description: "Verifique sua caixa de entrada para redefinir sua senha.",
        status: "success",
        duration: 4000,
      });
    } catch (err) {
      toastIdRef.current = toast({
        title: "Algo aconteceu...",
        description: "Tivemos algum erro ao enviar seu email....",
        status: "error",
        duration: 4000,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bgColor="background" px={4} py={8}>
        <ModalBody>
          <VStack
            as="form"
            noValidate
            onSubmit={handleSubmit(onSubmit)}
            w="100%"
            spacing={6}
            align="start"
          >
            <Heading color="black" fontSize="2xl" fontWeight="700">
              Redefinir senha
            </Heading>

            <VStack w="100%" spacing={6}>
              <Input
                placeholder="Email"
                leftIconSrc="/icons/Email.svg"
                {...register("email")}
                error={errors.email}
              />
            </VStack>

            <Button
              type="submit"
              w="100%"
              py={6}
              bgColor="#0047FF"
              color="white"
              fontWeight="600"
              fontSize="md"
              _hover={{ opacity: 0.7 }}
              _active={{ opacity: 0.7 }}
              isLoading={formState.isSubmitting}
            >
              Enviar email para resetar a senha
            </Button>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
