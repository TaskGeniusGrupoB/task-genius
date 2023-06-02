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

import axios from "axios";

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type FormData = {
  code: number;
};

const validationSchema = yup.object().shape({
  code: yup.number().required("O campo código é obrigatório."),
});

export const AddGroupModal: React.FC<CreateTaskModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { user, setUser, setNotifications } = useAuth();

  const toast = useToast();
  const toastIdRef = useRef<ToastId>();

  const { register, handleSubmit, formState } = useForm<FormData>({
    resolver: yupResolver(validationSchema),
  });
  const { errors } = formState;

  const onSubmit: SubmitHandler<FormData> = async ({ code }) => {
    const { data } = await axios.post("/api/res/addGroupMember", {
      userId: user!.id,
      groupId: code - 1000,
    });

    const { groupMember } = data;

    if (!groupMember) {
      toastIdRef.current = toast({
        title: "Código inválido",
        description: "Verifique seu código e tente novamente.",
        status: "error",
        duration: 4000,
      });

      return;
    }

    const _user = { ...user! };
    setUser({ ..._user, member: [..._user.member, groupMember] });

    setNotifications((prev) => [
      ...prev,
      {
        type: "new-group",
        msg: groupMember.group.name,
      },
    ]);

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
