import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 1️⃣ Seed cities
  const cities = [
    { id: 'city1', name: 'Dubai', slug: 'dubai', image_url: 'https://example.com/dubai.png' },
    { id: 'city2', name: 'Abu Dhabi', slug: 'abu-dhabi', image_url: 'https://example.com/abudhabi.png' },
  ];

  for (const city of cities) {
    await prisma.city.upsert({
      where: { slug: city.slug },
      update: {},
      create: city,
    });
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
