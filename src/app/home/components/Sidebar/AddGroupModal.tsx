import React from "react";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  Heading,
  ModalBody,
  VStack,
  Button,
} from "@chakra-ui/react";

import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { Input } from "@/components/Input";

import { useAuth } from "@/hooks/useAuth";

import axios from "axios";

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type FormData = {
  code: string;
};

const validationSchema = yup.object().shape({
  code: yup.string().required("O campo código é obrigatório."),
});

export const AddGroupModal: React.FC<CreateTaskModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { user } = useAuth();

  const { register, handleSubmit, formState } = useForm<FormData>({
    resolver: yupResolver(validationSchema),
  });
  const { errors } = formState;

  const onSubmit: SubmitHandler<FormData> = async ({}) => {
    onClose();
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
              Ingressar em um Grupo
            </Heading>

            <VStack w="100%" spacing={6}>
              <Input
                placeholder="Código do grupo"
                leftIconSrc="/icons/Task.svg"
                {...register("code")}
                error={errors.code}
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
              Entrar em grupo
            </Button>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
