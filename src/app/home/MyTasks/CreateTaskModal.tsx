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

import { TSetColumns, getColumns } from "./utils/functions";

import type { User } from "@/database/functions";
import { Textarea } from "@/components/Textarea";

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  setColumns: TSetColumns;
}

type FormData = {
  title: string;
  description: string;
  date: Date;
};

const validationSchema = yup.object().shape({
  title: yup.string().required("O campo título é obrigatório."),
  description: yup.string().required("O campo senha é obrigatório."),
  date: yup
    .date()
    .max(
      new Date(new Date().setFullYear(new Date().getFullYear() + 100)),
      "Data inválida"
    )
    .min(new Date(), "Data inválida")
    .required("O campo data é obrigatório."),
});

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  isOpen,
  onClose,
  setColumns,
}) => {
  const { user, setNotifications } = useAuth();

  const { register, handleSubmit, formState } = useForm<FormData>({
    resolver: yupResolver(validationSchema),
  });
  const { errors } = formState;

  const onSubmit: SubmitHandler<FormData> = async ({
    title,
    description,
    date,
  }) => {
    const {
      data: { user: newUser },
    }: { data: { user: User } } = await axios.post("/api/res/createTask", {
      id: user!.id,
      title,
      description,
      date,
    });

    setColumns(getColumns({ tasks: newUser.tasks }));
    setNotifications((prev) => [
      ...prev,
      {
        type: "task-created",
        msg: title,
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
              Criar Tarefa
            </Heading>

            <VStack w="100%" spacing={6}>
              <Input
                placeholder="Título para a tarefa"
                leftIconSrc="/icons/Task.svg"
                {...register("title")}
                error={errors.title}
              />

              <Textarea
                h={40}
                placeholder="Descrição da tarefa"
                {...register("description")}
                error={errors.description}
              />

              <Input
                type="date"
                placeholder="Data de entrega"
                leftIconSrc="/icons/CalendarLight.svg"
                {...register("date")}
                error={errors.date}
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
              Criar tarefa
            </Button>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
