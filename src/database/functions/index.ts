import { prisma } from "../prisma";

// rodar prisma generate
// criar funções de integração de group tasks

export interface User {
  id: number;
  email: string;
  name: string;

  tasks: Task[];
  member: GroupMember[];
}

export interface Task {
  id: number;

  createdAt: string;
  title: string;
  description: string;
  deadline: string;
  status: "todo" | "doing" | "done";
}

export interface Group {
  id: number;

  userId: number;
  name: string;
  members: User[];
  tasks: GroupTask[];
}

export interface GroupMember {
  user: User;
  group: Group;

  userId: number;
  groupId: number;
}

export interface GroupTask {
  id: number;

  group: Group;
  groupId: number;

  createdAt: string;
  title: string;
  description: string;
  deadline: string;
  status: "todo" | "doing" | "done";

  members: User[];
}

export const createUser = async ({
  name,
  email,
}: Pick<User, "name" | "email">): Promise<User> => {
  const user = await prisma.user.create({
    data: {
      name,
      email,
    },
  });

  return user as unknown as User;
};

export const getUserByEmail = async ({
  email,
}: Pick<User, "email">): Promise<User | null> => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
    include: {
      tasks: true,
      member: {
        include: {
          group: {
            include: {
              members: true,
              tasks: true,
            },
          },
        },
      },
    },
  });

  return user as unknown as User;
};

export const createGroup = async (userId: number, name: string) => {
  const group = await prisma.group.create({
    data: {
      name,
      userId,
    },
  });

  const groupMember = await addGroupMember(userId, group.id);

  return { group, groupMember };
};

export const addGroupMember = async (userId: number, groupId: number) => {
  const group = await prisma.group.findUnique({
    where: {
      id: groupId,
    },
  });

  if (!group) return null;

  try {
    const groupMember = await prisma.groupMember.create({
      data: {
        userId,
        groupId,
      },
      include: {
        group: {
          include: {
            members: true,
          },
        },
      },
    });

    return groupMember;
  } catch (err) {
    return null;
  }
};

export const addTask = async ({
  id,
  title,
  description,
  deadline,
}: Pick<User, "id"> &
  Pick<Task, "title" | "description" | "deadline">): Promise<User | null> => {
  const status = "todo";

  const user = await prisma.user.update({
    where: {
      id,
    },
    data: {
      tasks: {
        create: {
          title,
          description,
          deadline,
          status,
        },
      },
    },
    include: {
      tasks: true,
    },
  });

  return user as unknown as User;
};

export const updateTasks = async ({
  userId,
  tasks,
}: {
  userId: number;
  tasks: Task[];
}): Promise<void> => {
  await prisma.task.deleteMany({
    where: {
      userId,
    },
  });

  const createTasks = tasks.map((task) => ({
    ...task,
    userId,
  }));

  await prisma.task.createMany({
    data: createTasks,
    skipDuplicates: true,
  });
};

export const deleteTaskById = async (taskId: number) => {
  const deletedTask = await prisma.task.delete({
    where: {
      id: taskId,
    },
  });

  return deletedTask;
};

export const addGroupTask = async ({
  groupId,
  title,
  description,
  deadline,
}: {
  groupId: number;
  title: string;
  description: string;
  deadline: string;
}): Promise<GroupTask | null> => {
  const status = "todo";

  const group = await prisma.group.update({
    where: {
      id: groupId,
    },
    data: {
      tasks: {
        create: {
          title,
          description,
          deadline,
          status,
        },
      },
    },
    include: {
      tasks: true,
    },
  });

  return group as unknown as GroupTask;
};

export const updateGroupTasks = async ({
  groupId,
  tasks,
}: {
  groupId: number;
  tasks: GroupTask[];
}): Promise<void> => {
  await prisma.groupTask.deleteMany({
    where: {
      groupId,
    },
  });

  const createTasks = tasks.map((task) => ({
    ...task,
    groupId,
  }));

  await prisma.groupTask.createMany({
    data: createTasks,
    skipDuplicates: true,
  });
};

export const deleteGroupTaskById = async (
  taskId: number
): Promise<GroupTask | null> => {
  const deletedTask = await prisma.groupTask.delete({
    where: {
      id: taskId,
    },
    include: {
      group: true,
      members: true,
    },
  });

  return deletedTask as unknown as GroupTask;
};
