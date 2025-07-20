import request from "supertest";
import express, { Request, Response, NextFunction } from "express";
import statsRouter from "../routes/stats.routes";
import statsService from "../services/stats.service";
import authMiddleware from "../middlewares/auth.middleware";
import { getPagination } from "../utils/pagination";

type UserRoleType = "ADMIN" | "USER";

class AppError extends Error {
  public statusCode: number;
  public errorCode: string | undefined;

  constructor(message: string, statusCode: number, errorCode?: string) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
  }
}

// On "mock" (simule) les modules externes
jest.mock("../services/stats.service");
jest.mock("../utils/pagination");
jest.mock("../middlewares/auth.middleware", () => ({
  verifyToken: jest.fn((req: Request, res: Response, next: NextFunction) => {
    next();
  }),
}));

// Création d'une application Express minimale pour les tests
const app = express();
app.use(express.json());

// On déclare une interface custom pour Express Request avec le bon type de rôle
interface CustomRequest extends Request {
  user?: { id: number; role: UserRoleType };
}

app.use("/api/stats", (req: CustomRequest, res, next) => {
  statsRouter(req, res, next);
});

// Le gestionnaire d'erreurs utilise maintenant notre classe AppError locale
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: "error",
      message: err.message,
      errorCode: err.errorCode,
    });
  }
  res.status(500).json({ status: "error", message: "Internal Server Error" });
});

describe("Stats Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/stats/general", () => {
    it("devrait retourner 200 avec les statistiques générales", async () => {
      const mockStats = { totalParticipants: 50, totalDistance: 1234.5, totalTeams: 5 };
      (statsService.getGeneralStats as jest.Mock).mockResolvedValue(mockStats);

      const response = await request(app).get("/api/stats/general");

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockStats);
    });
  });

  describe("GET /api/stats/users/:id", () => {
    const mockUserStats = { totalKm: 150, individualRank: 5, teamRank: 2 };

    it("devrait retourner 200 si un utilisateur accède à ses propres stats", async () => {
      (authMiddleware.verifyToken as jest.Mock).mockImplementation((req: CustomRequest, res, next) => {
        req.user = { id: 1, role: "USER" };
        next();
      });
      (statsService.getUserStats as jest.Mock).mockResolvedValue(mockUserStats);

      const response = await request(app).get("/api/stats/users/1");

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockUserStats);
      expect(statsService.getUserStats).toHaveBeenCalledWith(1);
    });

    it("devrait retourner 200 si un admin accède aux stats d'un utilisateur", async () => {
      (authMiddleware.verifyToken as jest.Mock).mockImplementation((req: CustomRequest, res, next) => {
        req.user = { id: 99, role: "ADMIN" };
        next();
      });
      (statsService.getUserStats as jest.Mock).mockResolvedValue(mockUserStats);

      const response = await request(app).get("/api/stats/users/1");

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockUserStats);
    });
  });

  describe("GET /api/stats/users/:id/progress", () => {
    const mockUserProgress = {
      data: [{ date: "2025-07-19", bike: 10, walk: 2 }],
      meta: { total: 1, page: 1, per_page: 30 },
    };

    it("devrait retourner 200 si un utilisateur accède à sa propre progression", async () => {
      const mockPagination = { skip: 0, take: 30 };
      (getPagination as jest.Mock).mockReturnValue(mockPagination);
      (authMiddleware.verifyToken as jest.Mock).mockImplementation((req: any, res, next) => {
        req.user = { id: 1, role: "USER" };
        next();
      });
      (statsService.getUserProgress as jest.Mock).mockResolvedValue(mockUserProgress);

      const response = await request(app).get("/api/stats/users/1/progress");

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockUserProgress.data);
      expect(statsService.getUserProgress).toHaveBeenCalledWith(1, mockPagination);
    });
  });
});
