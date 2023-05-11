import { prisma } from "../prisma";

export interface User {
  id: number;
  email: string;
  name: string;
  tasks: Task[];
}

// export interface Group {
//   id: number;

//   name: string;

//   members: User[];
//   tasks: GroupTask[];
// }

export interface Task {
  id: number;

  createdAt: string;
  title: string;
  description: string;
  deadline: string;
  status: "todo" | "doing" | "done";
}

// export interface GroupTask {
//   id: number;

//   createdAt: string;
//   title: string;
//   description: string;
//   deadline: string;
//   status: "todo" | "doing" | "done";

//   members: User[];
// }

export const createUser = async ({
  name,
  email,
}: Pick<User, "name" | "email">): Promise<User> => {
  const tasks = [] as Task[];

  const user = await prisma.user.create({
    data: {
      name,
      email,
      tasks: {
        create: tasks,
      },
    },
  });

  return user;
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
    },
  });

  return user;
};

// export const createGroup = async (
//   creatorUser: User,
//   name: string
// ): Promise<Group> => {
//   const tasks: GroupTask[] = [];

//   const group = await prisma.group.create({
//     data: {
//       name,
//       members: {
//         connect: { id: creatorUser.id },
//       },
//       tasks: {
//         create: tasks,
//       },
//     },
//     include: {
//       members: true,
//     },
//   });

//   return group;
// };

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

  return user;
};

interface updateTasks {
  userId: number;
  tasks: Task[];
}

export const updateTasks = async ({
  userId,
  tasks,
}: updateTasks): Promise<void> => {
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
