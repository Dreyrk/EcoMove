import { PrismaClient, User } from "@prisma/client";
import db from "../lib/db";
class UserService {
  private db: PrismaClient;

  constructor() {
    this.db = db;
  }

  async createUser(data: { name: string; email: string; password: string; teamId: number }): Promise<User> {
    const createdUser = await db.user.create({ data });

    return createdUser;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return await db.user.findUnique({ where: { email } });
  }

  async getUserById(id: number): Promise<User | null> {
    return await db.user.findUnique({ where: { id } });
  }
}

export default new UserService();
