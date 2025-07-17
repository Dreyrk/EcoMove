import { PrismaClient, UserRoleType, ActivityType } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Début du seed...");

  // Nettoyer la base de données
  await prisma.activity.deleteMany();
  await prisma.user.deleteMany();
  await prisma.team.deleteMany();

  // Créer les équipes
  const teams = await prisma.team.createMany({
    data: [
      {
        name: "Les Cyclistes Fous",
        description: "Équipe passionnée de vélo et de défis sportifs",
      },
      {
        name: "Marcheurs Urbains",
        description: "Explorateurs de la ville à pied",
      },
      {
        name: "Green Warriors",
        description: "Équipe engagée pour l'environnement",
      },
      {
        name: "Fitness Masters",
        description: "Les pros de l'activité physique",
      },
    ],
  });

  // Récupérer les équipes créées
  const createdTeams = await prisma.team.findMany();
  console.log(`✅ ${createdTeams.length} équipes créées`);

  // Créer les utilisateurs
  const hashedPassword = await bcrypt.hash("password123", 10);

  const users = [
    { name: "Alice Martin", email: "alice@example.com", teamId: createdTeams[0].id, role: UserRoleType.ADMIN },
    { name: "Bob Dupont", email: "bob@example.com", teamId: createdTeams[0].id, role: UserRoleType.USER },
    { name: "Claire Rousseau", email: "claire@example.com", teamId: createdTeams[0].id, role: UserRoleType.USER },
    { name: "David Moreau", email: "david@example.com", teamId: createdTeams[1].id, role: UserRoleType.USER },
    { name: "Emma Leroy", email: "emma@example.com", teamId: createdTeams[1].id, role: UserRoleType.USER },
    { name: "Florian Bernard", email: "florian@example.com", teamId: createdTeams[1].id, role: UserRoleType.USER },
    { name: "Gabrielle Petit", email: "gabrielle@example.com", teamId: createdTeams[1].id, role: UserRoleType.USER },
    { name: "Hugo Durand", email: "hugo@example.com", teamId: createdTeams[2].id, role: UserRoleType.USER },
    { name: "Isabelle Garnier", email: "isabelle@example.com", teamId: createdTeams[2].id, role: UserRoleType.USER },
    { name: "Julien Faure", email: "julien@example.com", teamId: createdTeams[2].id, role: UserRoleType.USER },
    { name: "Kevin Lemoine", email: "kevin@example.com", teamId: createdTeams[3].id, role: UserRoleType.USER },
    { name: "Laura Giraud", email: "laura@example.com", teamId: createdTeams[3].id, role: UserRoleType.USER },
    { name: "Marc Blanchard", email: "marc@example.com", teamId: createdTeams[3].id, role: UserRoleType.USER },
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

  console.log(`✅ ${createdUsers.length} utilisateurs créés`);

  // Créer les activités sur plusieurs jours
  const activities = [];
  const startDate = new Date("2024-01-01");
  const activityTypes = [ActivityType.VELO, ActivityType.MARCHE];

  // Générer 45 activités sur 30 jours
  for (let i = 0; i < 45; i++) {
    const randomUser = createdUsers[Math.floor(Math.random() * createdUsers.length)];
    const randomType = activityTypes[Math.floor(Math.random() * activityTypes.length)];

    // Date aléatoire dans les 30 derniers jours
    const randomDate = new Date(startDate);
    randomDate.setDate(startDate.getDate() + Math.floor(Math.random() * 30));

    // Distance aléatoire selon le type d'activité
    let distance: number;
    let steps: number | null = null;

    if (randomType === ActivityType.VELO) {
      distance = Math.round((Math.random() * 30 + 5) * 10) / 10; // 5-35 km
    } else {
      distance = Math.round((Math.random() * 10 + 2) * 10) / 10; // 2-12 km
      steps = Math.floor(distance * 1300 + Math.random() * 500); // ~1300 steps/km + variation
    }

    try {
      const activity = await prisma.activity.create({
        data: {
          userId: randomUser.id,
          date: randomDate,
          type: randomType,
          distanceKm: distance,
          steps: steps,
        },
      });
      activities.push(activity);
    } catch (error: unknown) {
      // Ignore les erreurs de contrainte unique (même utilisateur, même date)
      if (error instanceof Error && "code" in error && error.code === "P2002") {
        // Ignore silencieusement
      } else {
        console.error("Erreur lors de la création de l'activité:", error);
      }
    }
  }

  console.log(`✅ ${activities.length} activités créées`);

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
    console.log(`\n🏆 Équipe: ${team.name}`);
    console.log(`   Membres: ${team.users.length}`);
    const totalActivities = team.users.reduce((sum, user) => sum + user.activities.length, 0);
    console.log(`   Activités: ${totalActivities}`);
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
