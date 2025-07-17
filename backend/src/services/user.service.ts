import { PrismaClient, User, UserRoleType } from "@prisma/client";
import db from "../lib/db";

type SelectedUser = {
  email: string;
  password: string;
  role: UserRoleType;
  id: number;
};

class UserService {
  private db: PrismaClient;

  constructor() {
    this.db = db;
  }

  async createUser(data: { name: string; email: string; password: string; teamId: number }): Promise<User> {
    const createdUser = await this.db.user.create({ data });

    return createdUser;
  }

  async getUserByEmail(email: string): Promise<SelectedUser | null> {
    return await this.db.user.findUnique({
      where: { email },
      select: { email: true, password: true, role: true, id: true },
    });
  }

  async getUserById(id: number): Promise<Partial<User> | null> {
    return await this.db.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        team: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }
}

export default new UserService();
