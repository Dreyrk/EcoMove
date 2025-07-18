import { PrismaClient, User, UserRoleType } from "@prisma/client";
import z from "zod";
import db from "../lib/db";
import { UserSchema } from "../schemas/user.schema";
import { formatZodErrors } from "../utils/formatZodErrors";

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
    // Valider les données avec Zod
    const validatedUser = UserSchema.safeParse(data);

    // Vérifier si la validation a réussi
    if (!validatedUser.success) {
      throw new Error(`Erreur de validation: ${formatZodErrors(validatedUser.error)}`);
    }

    // Extraire les données validées
    const userData = validatedUser.data;

    const createdUser = await this.db.user.create({ data: userData });

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
