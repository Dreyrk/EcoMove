import { Request, Response } from "express";
import authService from "../services/auth.service";
import { successResponse } from "../utils/response";
import userService from "../services/user.service";
import { AppError } from "../middlewares/error.middleware";

class AuthController {
  async getProfile(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError("Utilisateur non connecté", 401);
      }
      const user = await userService.getUserById(Number(userId));
      if (!user) {
        throw new AppError("Utilisateur non trouvé", 404);
      }

      res.status(200).json(successResponse(user));
    } catch (e) {
      throw new AppError(`Erreur serveur: ${(e as Error).message}`, 500);
    }
  }

  async register(req: Request, res: Response) {
    try {
      const user = await authService.register(req.body);
      res.status(201).json(successResponse(user));
    } catch (err) {
      throw new AppError((err as Error).message, 500);
    }
  }

  async login(req: Request, res: Response) {
    try {
      const token = await authService.login(req.body);
      res
        .cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
        })
        .status(200)
        .json({ status: "success" });
    } catch (e) {
      throw new AppError(`Erreur serveur: ${(e as Error).message}`, 500);
    }
  }

  logout(req: Request, res: Response) {
    res
      .clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      })
      .status(200)
      .json({ status: "success", message: "Logged out" });
  }
}

export default new AuthController();
