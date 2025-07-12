import { Request, Response } from "express";
import authService from "../services/auth.service";

class AuthController {
  async register(req: Request, res: Response) {
    try {
      const user = await authService.register(req.body);
      res.status(201).json(user);
    } catch (err) {
      res.status(400).json({ error: (err as Error).message });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const token = await authService.login(req.body);
      res.status(200).json({ token });
    } catch (err) {
      res.status(401).json({ error: (err as Error).message });
    }
  }
}

export default new AuthController();
