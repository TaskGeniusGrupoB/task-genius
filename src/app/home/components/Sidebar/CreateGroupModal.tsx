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
  name: string;
};

const validationSchema = yup.object().shape({
  name: yup
    .string()
    .max(15, "Máximo de 15 caracteres.")
    .required("O campo nome é obrigatório."),
});

export const CreateGroupModal: React.FC<CreateTaskModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { user, setUser } = useAuth();

  const { register, handleSubmit, formState } = useForm<FormData>({
    resolver: yupResolver(validationSchema),
  });
  const { errors } = formState;

  const onSubmit: SubmitHandler<FormData> = async ({ name }) => {
    const { data } = await axios.post("/api/res/createGroup", {
      userId: user!.id,
      name,
    });
    const { group, groupMember } = data;

    const _user = { ...user! };
    setUser({ ..._user, member: [...user!.member, groupMember] });

    console.log(`CreateGroupModal`, {
      ..._user,
      member: [...user!.member, groupMember,],
    });
    console.log(`CreateGroupModal`, { groups: _user.member[0].group });

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
              Criar Grupo
            </Heading>

            <VStack w="100%" spacing={6}>
              <Input
                placeholder="Nome do Grupo"
                leftIconSrc="/icons/Task.svg"
                {...register("name")}
                error={errors.name}
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
              Criar
            </Button>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
