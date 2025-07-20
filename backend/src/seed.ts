import { PrismaClient, UserRoleType, ActivityType } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Début du seed...");

  // Nettoyer la base de données
  await prisma.activity.deleteMany();
  await prisma.user.deleteMany();
  await prisma.team.deleteMany();
  console.log("🧹 Base de données nettoyée");

  // Créer les équipes (départements)
  const teams = await prisma.team.createMany({
    data: [
      {
        name: "Marketing",
        description: "Promouvoir la mobilité durable dans le département Marketing",
      },
      {
        name: "Recherche & Développement",
        description: "Innover pour un avenir vert dans la R&D",
      },
      {
        name: "Opérations",
        description: "Optimiser les déplacements professionnels",
      },
      {
        name: "Ressources Humaines",
        description: "Encourager la santé et la durabilité des employés",
      },
    ],
  });
  const createdTeams = await prisma.team.findMany();
  console.log(`✅ ${createdTeams.length} départements créés`);

  // Créer les utilisateurs (employés)
  const hashedPassword = await bcrypt.hash("password", 10);
  const users = [
    {
      name: "Marie Dubois",
      email: "admin@email.com",
      teamId: createdTeams[0].id,
      role: UserRoleType.ADMIN,
    },
    {
      name: "Jean Martin",
      email: "jean.martin@challenge-mobilite.com",
      teamId: createdTeams[0].id,
      role: UserRoleType.USER,
    },
    {
      name: "Sophie Laurent",
      email: "sophie.laurent@challenge-mobilite.com",
      teamId: createdTeams[0].id,
      role: UserRoleType.USER,
    },
    {
      name: "Pierre Lefèvre",
      email: "pierre.lefevre@challenge-mobilite.com",
      teamId: createdTeams[0].id,
      role: UserRoleType.USER,
    },
    {
      name: "Claire Robert",
      email: "claire.robert@challenge-mobilite.com",
      teamId: createdTeams[0].id,
      role: UserRoleType.USER,
    },
    {
      name: "Luc Michel",
      email: "luc.michel@challenge-mobilite.com",
      teamId: createdTeams[1].id,
      role: UserRoleType.ADMIN,
    },
    {
      name: "Emma Girard",
      email: "emma.girard@challenge-mobilite.com",
      teamId: createdTeams[1].id,
      role: UserRoleType.USER,
    },
    {
      name: "Thomas Simon",
      email: "thomas.simon@challenge-mobilite.com",
      teamId: createdTeams[1].id,
      role: UserRoleType.USER,
    },
    {
      name: "Julie Bernard",
      email: "julie.bernard@challenge-mobilite.com",
      teamId: createdTeams[1].id,
      role: UserRoleType.USER,
    },
    {
      name: "Antoine Renaud",
      email: "antoine.renaud@challenge-mobilite.com",
      teamId: createdTeams[1].id,
      role: UserRoleType.USER,
    },
    {
      name: "Léa Dubois",
      email: "lea.dubois@challenge-mobilite.com",
      teamId: createdTeams[2].id,
      role: UserRoleType.USER,
    },
    {
      name: "Hugo Fournier",
      email: "hugo.fournier@challenge-mobilite.com",
      teamId: createdTeams[2].id,
      role: UserRoleType.USER,
    },
    {
      name: "Chloé Lemaire",
      email: "chloe.lemaire@challenge-mobilite.com",
      teamId: createdTeams[2].id,
      role: UserRoleType.USER,
    },
    {
      name: "Maxime Petit",
      email: "maxime.petit@challenge-mobilite.com",
      teamId: createdTeams[2].id,
      role: UserRoleType.USER,
    },
    {
      name: "Camille Garnier",
      email: "camille.garnier@challenge-mobilite.com",
      teamId: createdTeams[2].id,
      role: UserRoleType.USER,
    },
    {
      name: "Nicolas Durand",
      email: "nicolas.durand@challenge-mobilite.com",
      teamId: createdTeams[3].id,
      role: UserRoleType.USER,
    },
    {
      name: "Manon Faure",
      email: "manon.faure@challenge-mobilite.com",
      teamId: createdTeams[3].id,
      role: UserRoleType.USER,
    },
    {
      name: "Paul Lemoine",
      email: "paul.lemoine@challenge-mobilite.com",
      teamId: createdTeams[3].id,
      role: UserRoleType.USER,
    },
    {
      name: "Laura Giraud",
      email: "laura.giraud@challenge-mobilite.com",
      teamId: createdTeams[3].id,
      role: UserRoleType.USER,
    },
    {
      name: "Marc Blanchard",
      email: "marc.blanchard@challenge-mobilite.com",
      teamId: createdTeams[3].id,
      role: UserRoleType.USER,
    },
  ];

  const createdUsers = [];
  for (const userData of users) {
    const user = await prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
      },
    });
    createdUsers.push(user);
  }
  console.log(`✅ ${createdUsers.length} employés créés`);

  // Créer les activités pour aujourd'hui (19 juillet 2025)
  const today = new Date(2025, 6, 19); // 19 juillet 2025
  const activities = [];
  const activityTypes = [ActivityType.VELO, ActivityType.MARCHE];

  for (const user of createdUsers) {
    const randomType = activityTypes[Math.floor(Math.random() * activityTypes.length)];
    let distanceKm: number;
    let steps: number | null = null;

    if (randomType === ActivityType.VELO) {
      distanceKm = Math.round((Math.random() * 18 + 2) * 10) / 10; // 2-20 km (trajet domicile-travail)
    } else {
      steps = Math.floor(Math.random() * 9000 + 1000); // 1000-10000 pas
      distanceKm = parseFloat((steps / 1500).toFixed(1)); // 1500 pas = 1 km
    }

    try {
      const activity = await prisma.activity.create({
        data: {
          userId: user.id,
          date: today,
          type: randomType,
          distanceKm,
          steps,
        },
      });
      activities.push(activity);
    } catch (error: unknown) {
      if (error instanceof Error && "code" in error && error.code === "P2002") {
        console.log(`⚠️ Activité déjà existante pour l'employé ${user.name} le ${today.toISOString()}`);
      } else {
        console.error("Erreur lors de la création de l'activité:", error);
      }
    }
  }
  console.log(`✅ ${activities.length} activités créées pour le 19/07/2025`);

  // Afficher un résumé
  const summary = await prisma.team.findMany({
    include: {
      users: {
        include: {
          activities: true,
        },
      },
    },
  });

  console.log("\n📊 Résumé du seed:");
  summary.forEach((team) => {
    console.log(`\n🏆 Département: ${team.name}`);
    console.log(`   Employés: ${team.users.length}`);
    const totalActivities = team.users.reduce((sum, user) => sum + user.activities.length, 0);
    const totalDistance = team.users
      .reduce((sum, user) => sum + user.activities.reduce((sumAct, act) => sumAct + act.distanceKm, 0), 0)
      .toFixed(1);
    const veloCount = team.users.reduce(
      (sum, user) => sum + user.activities.filter((act) => act.type === ActivityType.VELO).length,
      0
    );
    const marcheCount = team.users.reduce(
      (sum, user) => sum + user.activities.filter((act) => act.type === ActivityType.MARCHE).length,
      0
    );
    console.log(`   Activités: ${totalActivities} (Vélo: ${veloCount}, Marche: ${marcheCount})`);
    console.log(`   Distance totale: ${totalDistance} km`);
  });

  console.log("\n🎉 Seed terminé avec succès !");
}

main()
  .catch((e) => {
    console.error("❌ Erreur lors du seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
