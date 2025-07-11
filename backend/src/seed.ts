import db from "./lib/db";

async function main() {
  // Create Teams
  const team1 = await db.team.create({
    data: {
      name: "Team Alpha",
      description: "The leading team",
    },
  });

  const team2 = await db.team.create({
    data: {
      name: "Team Beta",
      description: "The challenger team",
    },
  });

  // Create Users
  const user1 = await db.user.create({
    data: {
      name: "John Doe",
      email: "john.doe@example.com",
      password: "hashedpassword1",
      teamId: team1.id,
    },
  });

  const user2 = await db.user.create({
    data: {
      name: "Jane Smith",
      email: "jane.smith@example.com",
      password: "hashedpassword2",
      teamId: team1.id,
    },
  });

  const user3 = await db.user.create({
    data: {
      name: "Bob Johnson",
      email: "bob.johnson@example.com",
      password: "hashedpassword3",
      teamId: team2.id,
    },
  });

  // Create Activities
  await db.activity.createMany({
    data: [
      {
        userId: user1.id,
        date: new Date("2023-10-01"),
        type: "MARCHE",
        steps: 5000,
        distanceKm: 5000 / 1500,
      },
      {
        userId: user1.id,
        date: new Date("2023-10-02"),
        type: "VELO",
        distanceKm: 10,
      },
      {
        userId: user2.id,
        date: new Date("2023-10-01"),
        type: "VELO",
        distanceKm: 15,
      },
      {
        userId: user3.id,
        date: new Date("2023-10-02"),
        type: "MARCHE",
        steps: 3000,
        distanceKm: 3000 / 1500,
      },
    ],
  });

  console.log("Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
