import React, { useState } from "react";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  Heading,
  ModalBody,
  VStack,
  Button,
  SimpleGrid,
  Text,
  Checkbox,
} from "@chakra-ui/react";

import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { Input } from "@/components/Input";
import { Textarea } from "@/components/Textarea";

import axios from "axios";

import { TSetColumns, getColumns } from "./utils/functions";

import type { Group, User } from "@/database/functions";
import { useAuth } from "@/hooks/useAuth";

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  setColumns: TSetColumns;
  group: Group;
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
  group,
}) => {
  const { setNotifications } = useAuth();

  const { register, handleSubmit, formState } = useForm<FormData>({
    resolver: yupResolver(validationSchema),
  });
  const { errors } = formState;

  const [checkedMembers, setCheckedMembers] = useState<boolean[]>(
    new Array(group.members.length).fill(false)
  );

  const onSubmit: SubmitHandler<FormData> = async ({
    title,
    description,
    date,
  }) => {
    let members = checkedMembers.map((checked, index) => {
      if (checked) return group.members[index].user;
    });
    members = members.filter((val) => val) as User[];

    const {
      data: { group: newGroup },
    }: { data: { group: Group } } = await axios.post("/api/res/addGroupTask", {
      groupId: group.id,
      title,
      description,
      deadline: date,
      members,
    });

    setColumns(getColumns({ tasks: newGroup.tasks }));
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

            <Text color="black" fontSize="md" fontWeight="500">
              Membros responsáveis
            </Text>
            <SimpleGrid w="100%" columns={3}>
              {group.members.map((member, index) => {
                return (
                  <Checkbox
                    key={index}
                    isChecked={checkedMembers[index]}
                    onChange={(e) =>
                      setCheckedMembers((prev) => {
                        return [
                          ...prev.slice(0, index),
                          e.target.checked,
                          ...prev.slice(index + 1, prev.length),
                        ];
                      })
                    }
                  >
                    {member.user.name}
                  </Checkbox>
                );
              })}
            </SimpleGrid>

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
