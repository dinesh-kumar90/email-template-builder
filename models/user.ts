import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { createUserInput, User } from "@/types/user";

export async function authenticateUser(input: {
  email: string;
  password: string;
}): Promise<User | null> {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (!user?.password) {
    return null;
  }

  const valid = await bcrypt.compare(input.password, user.password);

  if (!valid) {
    return null;
  }

  return user;
}

export async function createUser(data: createUserInput): Promise<User> {
  return prisma.user.create({
    data,
  });
}

export async function updateUser(data: User): Promise<User> {
  return prisma.user.update({
    data,
    where: {
      id: data.id,
    },
  });
}
