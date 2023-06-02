import { prisma } from "../prisma";

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
  members: GroupMember[];
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
              members: {
                include: {
                  user: true,
                },
              },
              tasks: {
                include: {
                  members: true,
                  group: true,
                },
              },
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
            members: {
              include: {
                user: true,
              },
            },
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
  tasks,
}: {
  userId: number;
  tasks: Task[];
}): Promise<void> => {
  await Promise.all(
    tasks.map(async (task) => {
      await prisma.task.update({
        where: { id: task.id },
        data: {
          status: task.status,
        },
      });
    })
  );
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
  members,
}: {
  groupId: number;
  title: string;
  description: string;
  deadline: string;
  members: User[];
}): Promise<Group | null> => {
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
          members: {
            connect: members.map((user) => ({ id: user.id })),
          },
        },
      },
    },
    include: {
      tasks: {
        include: {
          members: true,
        },
      },
    },
  });

  return group as unknown as Group;
};

export const updateGroupTasks = async ({
  groupId,
  tasks,
}: {
  groupId: number;
  tasks: GroupTask[];
}): Promise<void> => {
  await Promise.all(
    tasks.map(async (task) => {
      await prisma.groupTask.update({
        where: { id: task.id },
        data: {
          status: task.status,
        },
      });
    })
  );
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
