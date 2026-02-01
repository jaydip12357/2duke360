import { PrismaClient, Role, ContainerStatus, LocationType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Clear existing data
  console.log("Clearing existing data...");
  await prisma.notification.deleteMany();
  await prisma.impactStats.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.container.deleteMany();
  await prisma.user.deleteMany();
  await prisma.location.deleteMany();
  await prisma.systemSettings.deleteMany();

  // Create system settings
  console.log("Creating system settings...");
  await prisma.systemSettings.create({
    data: {
      lateFeeAmount: 5.0,
      gracePeriodHours: 24,
      returnWindowDays: 3,
      maxContainersPerUser: 5,
      autoChargeEnabled: false,
      smsNotificationsOn: true,
      emailNotificationsOn: true,
    },
  });

  // Create locations
  console.log("Creating locations...");
  const locations = await Promise.all([
    prisma.location.create({
      data: {
        name: "Marketplace",
        code: "MKT",
        type: LocationType.DINING_HALL,
        address: "810 Duke University Rd",
        hours: JSON.stringify({
          monday: "7:00 AM - 9:00 PM",
          tuesday: "7:00 AM - 9:00 PM",
          wednesday: "7:00 AM - 9:00 PM",
          thursday: "7:00 AM - 9:00 PM",
          friday: "7:00 AM - 8:00 PM",
          saturday: "8:00 AM - 8:00 PM",
          sunday: "8:00 AM - 9:00 PM",
        }),
        latitude: 36.0014,
        longitude: -78.9382,
        capacity: 200,
        isActive: true,
      },
    }),
    prisma.location.create({
      data: {
        name: "West Union",
        code: "WU",
        type: LocationType.DINING_HALL,
        address: "West Union Building",
        hours: JSON.stringify({
          monday: "7:00 AM - 10:00 PM",
          tuesday: "7:00 AM - 10:00 PM",
          wednesday: "7:00 AM - 10:00 PM",
          thursday: "7:00 AM - 10:00 PM",
          friday: "7:00 AM - 9:00 PM",
          saturday: "9:00 AM - 9:00 PM",
          sunday: "9:00 AM - 10:00 PM",
        }),
        latitude: 36.0008,
        longitude: -78.9395,
        capacity: 175,
        isActive: true,
      },
    }),
    prisma.location.create({
      data: {
        name: "Farmstead",
        code: "FARM",
        type: LocationType.DINING_HALL,
        address: "Farmstead Building",
        hours: JSON.stringify({
          monday: "11:00 AM - 8:00 PM",
          tuesday: "11:00 AM - 8:00 PM",
          wednesday: "11:00 AM - 8:00 PM",
          thursday: "11:00 AM - 8:00 PM",
          friday: "11:00 AM - 7:00 PM",
          saturday: "Closed",
          sunday: "Closed",
        }),
        latitude: 36.0020,
        longitude: -78.9400,
        capacity: 100,
        isActive: true,
      },
    }),
    prisma.location.create({
      data: {
        name: "The Loop",
        code: "LOOP",
        type: LocationType.RETURN_STATION,
        address: "Science Drive",
        hours: JSON.stringify({
          monday: "24/7",
          tuesday: "24/7",
          wednesday: "24/7",
          thursday: "24/7",
          friday: "24/7",
          saturday: "24/7",
          sunday: "24/7",
        }),
        latitude: 36.0025,
        longitude: -78.9410,
        capacity: 80,
        isActive: true,
      },
    }),
  ]);

  console.log(`Created ${locations.length} locations`);

  // Create users
  console.log("Creating users...");
  const passwordHash = await bcrypt.hash("demo123", 10);

  // Admin user
  const admin = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@duke.edu",
      netId: "admin01",
      role: Role.ADMIN,
      phone: "919-555-0001",
      passwordHash,
    },
  });

  // Staff users
  const staffUsers = await Promise.all([
    prisma.user.create({
      data: {
        name: "Sarah Johnson",
        email: "sarah.johnson@duke.edu",
        netId: "sj123",
        role: Role.DINING_STAFF,
        phone: "919-555-0010",
        passwordHash,
      },
    }),
    prisma.user.create({
      data: {
        name: "Mike Chen",
        email: "mike.chen@duke.edu",
        netId: "mc456",
        role: Role.DINING_STAFF,
        phone: "919-555-0011",
        passwordHash,
      },
    }),
  ]);

  // Facilities users
  const facilitiesUsers = await Promise.all([
    prisma.user.create({
      data: {
        name: "Tom Williams",
        email: "tom.williams@duke.edu",
        netId: "tw789",
        role: Role.FACILITIES,
        phone: "919-555-0020",
        passwordHash,
      },
    }),
  ]);

  // Student users
  const studentNames = [
    "Alex Kim", "Emma Davis", "John Smith", "Lisa Park", "Michael Brown",
    "Sarah Lee", "David Wilson", "Jennifer Taylor", "Chris Anderson", "Amy Martinez",
    "James Thompson", "Nicole White", "Ryan Garcia", "Megan Harris", "Kevin Clark",
    "Ashley Lewis", "Brian Robinson", "Stephanie Walker", "Tyler Hall", "Lauren Young",
  ];

  const students = await Promise.all(
    studentNames.map((name, i) =>
      prisma.user.create({
        data: {
          name,
          email: `${name.toLowerCase().replace(" ", ".")}@duke.edu`,
          netId: `${name.split(" ")[0].toLowerCase()}${String(i + 1).padStart(3, "0")}`,
          role: Role.STUDENT,
          phone: `919-555-${String(1000 + i).padStart(4, "0")}`,
          passwordHash,
        },
      })
    )
  );

  console.log(`Created ${1 + staffUsers.length + facilitiesUsers.length + students.length} users`);

  // Create containers
  console.log("Creating containers...");
  const containers: any[] = [];

  // Create 100 containers across all locations
  for (let i = 1; i <= 100; i++) {
    const locationIndex = (i - 1) % locations.length;
    const location = locations[locationIndex];
    const containerId = `DRC-${location.code}-${String(i).padStart(4, "0")}`;

    // Randomly assign status
    let status: ContainerStatus = ContainerStatus.AVAILABLE;
    let currentUserId: string | null = null;
    let dueDate: Date | null = null;

    const rand = Math.random();
    if (rand < 0.4) {
      // 40% checked out
      status = ContainerStatus.CHECKED_OUT;
      currentUserId = students[Math.floor(Math.random() * students.length)].id;
      dueDate = new Date(Date.now() + Math.random() * 1000 * 60 * 60 * 72); // Random due date within 3 days
    } else if (rand < 0.5) {
      // 10% in cleaning
      status = ContainerStatus.IN_CLEANING;
    } else if (rand < 0.55) {
      // 5% late
      status = ContainerStatus.LATE;
      currentUserId = students[Math.floor(Math.random() * students.length)].id;
      dueDate = new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 48); // Overdue
    }

    containers.push({
      containerId,
      qrCode: `QR-${containerId}`,
      rfidTag: `RFID-${String(i).padStart(4, "0")}`,
      status,
      currentUserId,
      dueDate,
      locationId: location.id,
      checkoutCount: Math.floor(Math.random() * 100),
      condition: Math.random() > 0.9 ? "Fair" : "Good",
    });
  }

  await prisma.container.createMany({ data: containers });
  console.log(`Created ${containers.length} containers`);

  // Create transactions
  console.log("Creating transactions...");
  const transactions: any[] = [];
  const now = new Date();

  // Generate 50 historical transactions
  for (let i = 0; i < 50; i++) {
    const student = students[Math.floor(Math.random() * students.length)];
    const location = locations[Math.floor(Math.random() * locations.length)];
    const container = containers[Math.floor(Math.random() * containers.length)];

    const checkoutTime = new Date(now.getTime() - Math.random() * 1000 * 60 * 60 * 24 * 30); // Within last 30 days
    const wasReturned = Math.random() > 0.3;
    const returnTime = wasReturned
      ? new Date(checkoutTime.getTime() + Math.random() * 1000 * 60 * 60 * 72)
      : null;
    const wasLate = wasReturned && Math.random() > 0.95;

    transactions.push({
      containerId: container.containerId,
      userId: student.id,
      checkoutTime,
      returnTime,
      locationId: location.id,
      wasLate,
      lateFee: wasLate ? 5.0 : null,
    });
  }

  // Need to get actual container IDs from database
  const dbContainers = await prisma.container.findMany();
  const validTransactions = transactions.map((tx) => ({
    ...tx,
    containerId: dbContainers.find((c) => c.containerId === tx.containerId)?.id || dbContainers[0].id,
  }));

  await prisma.transaction.createMany({ data: validTransactions });
  console.log(`Created ${transactions.length} transactions`);

  // Create impact stats for students
  console.log("Creating impact stats...");
  await Promise.all(
    students.map((student, i) =>
      prisma.impactStats.create({
        data: {
          userId: student.id,
          containersReused: Math.floor(Math.random() * 150) + 10,
          wasteAverted: Math.random() * 30 + 2,
          carbonSaved: Math.random() * 15 + 1,
          waterSaved: Math.random() * 75 + 5,
          streak: Math.floor(Math.random() * 30),
          longestStreak: Math.floor(Math.random() * 60) + 10,
          badges: i % 3 === 0 ? ["First Timer", "Getting Started"] : ["First Timer"],
          leaderboardRank: i + 1,
        },
      })
    )
  );

  console.log(`Created ${students.length} impact stats records`);

  console.log("✅ Database seeding completed!");
  console.log("\nDemo credentials:");
  console.log("  Admin: admin@duke.edu / demo123");
  console.log("  Staff: sarah.johnson@duke.edu / demo123");
  console.log("  Student: alex.kim@duke.edu / demo123");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
