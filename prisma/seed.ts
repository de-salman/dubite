import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // 1️⃣ Seed Cities
  console.log('📍 Seeding cities...');
  const dubai = await prisma.city.upsert({
    where: { slug: 'dubai' },
    update: {},
    create: {
      name: 'Dubai',
      slug: 'dubai',
      image_url:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBzhrncxEW2BomrFLO-xcUJw7g1XBqaQ9ba3ciqMSugrjyJujsZhKXsZjAqqHxOFxcVHpS2OJHfSm8ta1dgaCWKie5In2i_SadL8R_y_aAZzYjEy5QoT-NQHJbg8TggE8uGtfispTmnRol5g_o5Y614pBFzpSWuYeNXA-0s8nhtb2RQBCwmoZMG3DqDB-nJHSF_7PQP6NHKnH5lnxbdMvwY7HcSCrWZvawrSaFxIS69gEXXGfEVrAgY0BGjTgmll8juDRS9fGhDaPw',
    },
  });

  // 2️⃣ Seed Users (for reviews)
  console.log('👥 Seeding users...');
  const hashedPassword = await bcrypt.hash('password123', 10);

  const users = [
    {
      name: 'Sarah H.',
      email: 'sarah.h@example.com',
      password: hashedPassword,
      auth_provider: 'email',
      avatar_url:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCZd9ZLMF7-tw7nWqTic8ANZeW6KTo71ssZCKdhEt90CqK6YG-uh6Y9Tw9uKw0ACWPfap_Mj8xQPMyXvutKGw0H9hkKewztsJK3fVmKg4qqIe0qqzdfpD4MJKwYYn0gyvvss-3HCjqoAuvVI3H-66wpV7XgwbXBES0qGQ0UdZNzKUcp0DaB5EVGtYmWiOALvV_XZxlbDVWPeTp2e0KlZ0lkbrpqvZYNoFP86EI_FWQRN3AsExukerNMsRDJF3L09h9fIy53R07EsnQ',
      role: 'USER' as const,
      city_id: dubai.id,
    },
    {
      name: 'Ahmed M.',
      email: 'ahmed.m@example.com',
      password: hashedPassword,
      auth_provider: 'email',
      avatar_url:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAEXac-AIKmu8cEZsHgy8COF1ZFtXGCKrpNnTkufXV7_dS5wbGN1j4mv7ou0Af4wJXqlfiWdA40jOnThVEjc9f7x8pdVjIRw1WGg-Uf4AyN8APTidxPpkaQXocAMHchh2-fmIpGr4WHbYgkP5_t9IhT_u93QhfyWr0Dj4BtALDCRxgohFmzB9FEGrdP2z150CHslaH9bnRoTaDJ3Zbsc_yc7LXOcddfkF32p-9Rljuv4Vo-NDgrb-0uuCS7kFKdorUBo4CEylyMOcE',
      role: 'USER' as const,
      city_id: dubai.id,
    },
    {
      name: 'Fatima K.',
      email: 'fatima.k@example.com',
      password: hashedPassword,
      auth_provider: 'email',
      avatar_url:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuD87EnyJA8X5VP1sea7MfC5wu6MHS6PTvz1btkq0hJOXq4Tk0uxeGXbgsipCqTJmKG8BEKWnVLQocvaFeojd8GeTtArhoVTMTPV1ppvR1QwgXh2HsR97qTfqwe2Ej644eyyaedgUViafL2jeQkYhmQvrE8iISectu5eCAyjz6dfTXi5yCj8O8lDBYIU635KNaa1i-1xuebxkDVQclQvAzEZ9HF6Rq00MtpIcGKHgsDhB0TXqa-AXFuNzSUZPSyAmTRtYvvTD1ue-cE',
      role: 'USER' as const,
      city_id: dubai.id,
    },
    {
      name: 'Alex Chen',
      email: 'alex.chen@example.com',
      password: hashedPassword,
      auth_provider: 'email',
      avatar_url:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAEXac-AIKmu8cEZsHgy8COF1ZFtXGCKrpNnTkufXV7_dS5wbGN1j4mv7ou0Af4wJXqlfiWdA40jOnThVEjc9f7x8pdVjIRw1WGg-Uf4AyN8APTidxPpkaQXocAMHchh2-fmIpGr4WHbYgkP5_t9IhT_u93QhfyWr0Dj4BtALDCRxgohFmzB9FEGrdP2z150CHslaH9bnRoTaDJ3Zbsc_yc7LXOcddfkF32p-9Rljuv4Vo-NDgrb-0uuCS7kFKdorUBo4CEylyMOcE',
      role: 'USER' as const,
      city_id: dubai.id,
    },
    {
      name: 'Sarah M.',
      email: 'sarah.m@example.com',
      password: hashedPassword,
      auth_provider: 'email',
      avatar_url:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCZd9ZLMF7-tw7nWqTic8ANZeW6KTo71ssZCKdhEt90CqK6YG-uh6Y9Tw9uKw0ACWPfap_Mj8xQPMyXvutKGw0H9hkKewztsJK3fVmKg4qqIe0qqzdfpD4MJKwYYn0gyvvss-3HCjqoAuvVI3H-66wpV7XgwbXBES0qGQ0UdZNzKUcp0DaB5EVGtYmWiOALvV_XZxlbDVWPeTp2e0KlZ0lkbrpqvZYNoFP86EI_FWQRN3AsExukerNMsRDJF3L09h9fIy53R07EsnQ',
      role: 'USER' as const,
      city_id: dubai.id,
    },
    {
      name: 'Linda C.',
      email: 'linda.c@example.com',
      password: hashedPassword,
      auth_provider: 'email',
      avatar_url:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuD87EnyJA8X5VP1sea7MfC5wu6MHS6PTvz1btkq0hJOXq4Tk0uxeGXbgsipCqTJmKG8BEKWnVLQocvaFeojd8GeTtArhoVTMTPV1ppvR1QwgXh2HsR97qTfqwe2Ej644eyyaedgUViafL2jeQkYhmQvrE8iISectu5eCAyjz6dfTXi5yCj8O8lDBYIU635KNaa1i-1xuebxkDVQclQvAzEZ9HF6Rq00MtpIcGKHgsDhB0TXqa-AXFuNzSUZPSyAmTRtYvvTD1ue-cE',
      role: 'USER' as const,
      city_id: dubai.id,
    },
  ];

  const createdUsers: any[] = [];
  for (const user of users) {
    const created = await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: user,
    });
    createdUsers.push(created);
  }

  // 2.5️⃣ Seed Categories
  console.log('📂 Seeding categories...');
  const categories = [
    {
      name: 'Fine Dining',
      slug: 'fine-dining',
      image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAL1neQmBLngr96Y7kVK_BsmrkGsd0StV8APxPHadrRrNPERJGlM6n0U--aaoztSynFXFn6Z5Wzn9L9-LmGTU3To2_gkgjVrIPkM0R-9A_cvAmPJ1hET86ZVVD1cgCQRbKQBbrgeUNETMh0QU1UVWBT1D6ESdGSWvpdVfvgQLubV7XsXSo-6lLZdvxJRldFGOxnhtUpJsTBXDcJLLLsF5ufDbPW004HA4zbhDq2xCobhHP5GoKaYmGE-dkHLAtnGAiDWx7KBR7GYoM',
    },
    {
      name: 'Appetizers',
      slug: 'appetizers',
      image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCg0OCWHjo9fGkn3UDlKMHCaP40CjVxTxOzW5RcGIXchmX7XuXANhaao6d23FFip-Yn5KPCoNecu3zuDEtlcpv8uGjbNzLZCEl_3zVuOUX-74tqeH-SuNnLcUHsRBx9U0W7JQOjdfr8mT7HICoAxmRAZlCXhaIXsRRgSATvoBLLJzyTmi_J9vKkyXnNxZLxl-aWOooXEplQERHXj0dUeWZoTxg-bmfnRHEfH5xVR2felFTMqYUKWR__GYmdmsddDFDeRrDYYm1doTU',
    },
    {
      name: 'Desserts',
      slug: 'desserts',
      image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDHGWUWGO0g31j68iw-jAQ2mKQ7nQZyJzbllJVU-LtkXYTz4yloBOvYGmDrkgYWVbFXLfTBwQ-SCEOxgxOHQrEebwGxUUDi3nB6UNxMhAN5KdsqyLo8QTnzweWbjGHqlhD0CMTPoQbr0JbfSIkZjsZtz856br2SsyLuMDytoHEWGt7Pgs2rYNVIuEozQlCBsIuSzo_6I5G4Ydh7BcDA-htbxBhczYyE9BnYrxBmxmevBGB3Ca64hengZmdPDdwCapIZZ__EYagF50A',
    },
    {
      name: 'Main Course',
      slug: 'main-course',
      image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAL1neQmBLngr96Y7kVK_BsmrkGsd0StV8APxPHadrRrNPERJGlM6n0U--aaoztSynFXFn6Z5Wzn9L9-LmGTU3To2_gkgjVrIPkM0R-9A_cvAmPJ1hET86ZVVD1cgCQRbKQBbrgeUNETMh0QU1UVWBT1D6ESdGSWvpdVfvgQLubV7XsXSo-6lLZdvxJRldFGOxnhtUpJsTBXDcJLLLsF5ufDbPW004HA4zbhDq2xCobhHP5GoKaYmGE-dkHLAtnGAiDWx7KBR7GYoM',
    },
    {
      name: 'Burgers',
      slug: 'burgers',
      image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBpLMA9xAFo6-Jqueg4Cj_klVJhefG8QCj63mSW68vNpyQXJlcompCxM3FEnCkAA9uXGs8cy11LcYOVGrEtbmdVOWa-XgsuUytngbiuom8jd2185ftWJY7p5TE42hGNciP6YDIbqFjSpKxDHJG_r09u35UaAZdFvPrXx5hkoOXMrXw_1SEh7WqIvaVQyTF78ne8a8UIaAWZUSzXRpatynqipRJQFGb6DwwwbEsUrWbMJSjSAyNfkdv81pa-gM7VUBqPbxO63Y3zMQk',
    },
    {
      name: 'Shawarma',
      slug: 'shawarma',
      image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA6eaIxTry_KRDyKZj88txaKzEOa9SnVJtM1vl41wsEJ5lqW5ZYcMDkAXcCSxx2agsXzT-mZFsqiNRVxRlmEcIzhZ3iJ5paQCdyVufsKS3dxp6IIaoWfDkmTqMZYDkOhXjU7WdtEoLycbLFCPOnivRbG4ktgXTat3Dp9i4-1hJtt9i11ztHOVMY8jcpEYwKBn1uRbIv7QV461o07h8BWCnPq5tkY1Bq8RYSIdkTEbDBURWjQUmDHghOzdGhpW50JKAg6ZqqlGd74dw',
    },
    {
      name: 'Sushi',
      slug: 'sushi',
      image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBV779PABJra2WoS5y89s2_fyuHYbStR1lyJpUDH_VD8M4dGxHwIlGdjPyDcGu_XoYsYVi0BxmLyfDO7aP1sfzXKtYZPHMwW9iuTxY98pPreQNm_Y2FHlTZ5fUp2rVIh07_pqmkgAIX3pJzns-V1qSjmXrg0ye-Pq0zj0bfdFcwmGF4ILRwn5A1DBtSYQd5wA1FlwrgnN7sN-yaiNDJhNZlBvWTa6H6r6NB_5AuGoqa5mo9QnG2SKGaQ7h8uTSqO4-HZj6lY_XXp5A',
    },
  ];

  const createdCategories: any[] = [];
  for (const category of categories) {
    const created = await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
    createdCategories.push(created);
  }

  // 2.6️⃣ Seed Cuisines
  console.log('🌍 Seeding cuisines...');
  const cuisines = [
    {
      name: 'Emirati Fusion',
      slug: 'emirati-fusion',
      image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAL1neQmBLngr96Y7kVK_BsmrkGsd0StV8APxPHadrRrNPERJGlM6n0U--aaoztSynFXFn6Z5Wzn9L9-LmGTU3To2_gkgjVrIPkM0R-9A_cvAmPJ1hET86ZVVD1cgCQRbKQBbrgeUNETMh0QU1UVWBT1D6ESdGSWvpdVfvgQLubV7XsXSo-6lLZdvxJRldFGOxnhtUpJsTBXDcJLLLsF5ufDbPW004HA4zbhDq2xCobhHP5GoKaYmGE-dkHLAtnGAiDWx7KBR7GYoM',
    },
    {
      name: 'Fine Dining',
      slug: 'fine-dining',
      image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCCgh5eLUqU_w8NcF0OD6Rof0xZGK0YUBx1HKJAsNBcXsgtLHL5G_2kvP7RIAKaiaaZH2mUxkWgEzxaWk8h7wCYBlt-J8h50pP_GgdRohCu1TeCaAkciCXM1_25RPPcijzNh3VSpvWK05mThlO9FfyRyLLvKOb0_DAYEpryqKtgFQbxo1tH8-F9CcUnsjbIo8P88m-sGvsxLdjjv4ZEmyt_KsN9ZHFPRgydpiibM6wbSG91yQtJ-JaF4p-rudn0skFudAXco3UwjAo',
    },
    {
      name: 'Lebanese',
      slug: 'lebanese',
      image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA6eaIxTry_KRDyKZj88txaKzEOa9SnVJtM1vl41wsEJ5lqW5ZYcMDkAXcCSxx2agsXzT-mZFsqiNRVxRlmEcIzhZ3iJ5paQCdyVufsKS3dxp6IIaoWfDkmTqMZYDkOhXjU7WdtEoLycbLFCPOnivRbG4ktgXTat3Dp9i4-1hJtt9i11ztHOVMY8jcpEYwKBn1uRbIv7QV461o07h8BWCnPq5tkY1Bq8RYSIdkTEbDBURWjQUmDHghOzdGhpW50JKAg6ZqqlGd74dw',
    },
    {
      name: 'Mediterranean',
      slug: 'mediterranean',
      image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCCgh5eLUqU_w8NcF0OD6Rof0xZGK0YUBx1HKJAsNBcXsgtLHL5G_2kvP7RIAKaiaaZH2mUxkWgEzxaWk8h7wCYBlt-J8h50pP_GgdRohCu1TeCaAkciCXM1_25RPPcijzNh3VSpvWK05mThlO9FfyRyLLvKOb0_DAYEpryqKtgFQbxo1tH8-F9CcUnsjbIo8P88m-sGvsxLdjjv4ZEmyt_KsN9ZHFPRgydpiibM6wbSG91yQtJ-JaF4p-rudn0skFudAXco3UwjAo',
    },
    {
      name: 'Japanese',
      slug: 'japanese',
      image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBV779PABJra2WoS5y89s2_fyuHYbStR1lyJpUDH_VD8M4dGxHwIlGdjPyDcGu_XoYsYVi0BxmLyfDO7aP1sfzXKtYZPHMwW9iuTxY98pPreQNm_Y2FHlTZ5fUp2rVIh07_pqmkgAIX3pJzns-V1qSjmXrg0ye-Pq0zj0bfdFcwmGF4ILRwn5A1DBtSYQd5wA1FlwrgnN7sN-yaiNDJhNZlBvWTa6H6r6NB_5AuGoqa5mo9QnG2SKGaQ7h8uTSqO4-HZj6lY_XXp5A',
    },
  ];

  const createdCuisines: any[] = [];
  for (const cuisine of cuisines) {
    const created = await prisma.cuisine.upsert({
      where: { slug: cuisine.slug },
      update: {},
      create: cuisine,
    });
    createdCuisines.push(created);
  }

  // Helper function to find category by name
  const findCategory = (name: string) => {
    return createdCategories.find(c => c.name === name || c.slug === name.toLowerCase().replace(/\s+/g, '-'));
  };

  // Helper function to find cuisine by name
  const findCuisine = (name: string) => {
    return createdCuisines.find(c => c.name === name || c.slug === name.toLowerCase().replace(/\s+/g, '-'));
  };

  // 3️⃣ Seed Restaurants
  console.log('🍽️ Seeding restaurants...');
  const restaurants = [
    {
      name: 'The Alchemist Lab',
      slug: 'the-alchemist-lab',
      description:
        'A culinary sanctuary where traditional Emirati flavors meet avant-garde techniques. Under the direction of Michelin-star Chef Omar Al-Farsi, our kitchen transforms classic ingredients into sensory experiences.',
      cuisine_name: 'Emirati Fusion',
      tags: ['Fine Dining', 'Emirati Fusion', 'Romantic'],
      latitude: 25.2048,
      longitude: 55.2708,
      image_url:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAL1neQmBLngr96Y7kVK_BsmrkGsd0StV8APxPHadrRrNPERJGlM6n0U--aaoztSynFXFn6Z5Wzn9L9-LmGTU3To2_gkgjVrIPkM0R-9A_cvAmPJ1hET86ZVVD1cgCQRbKQBbrgeUNETMh0QU1UVWBT1D6ESdGSWvpdVfvgQLubV7XsXSo-6lLZdvxJRldFGOxnhtUpJsTBXDcJLLLsF5ufDbPW004HA4zbhDq2xCobhHP5GoKaYmGE-dkHLAtnGAiDWx7KBR7GYoM',
      city_id: dubai.id,
    },
    {
      name: 'Salt & Bone',
      slug: 'salt-bone',
      description:
        'Contemporary Mediterranean with Burj Views. Experience culinary heights with our premium Wagyu and artisanal dishes.',
      cuisine_name: 'Fine Dining',
      tags: ['Fine Dining', 'Mediterranean', 'DIFC'],
      latitude: 25.2188,
      longitude: 55.2794,
      image_url:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCCgh5eLUqU_w8NcF0OD6Rof0xZGK0YUBx1HKJAsNBcXsgtLHL5G_2kvP7RIAKaiaaZH2mUxkWgEzxaWk8h7wCYBlt-J8h50pP_GgdRohCu1TeCaAkciCXM1_25RPPcijzNh3VSpvWK05mThlO9FfyRyLLvKOb0_DAYEpryqKtgFQbxo1tH8-F9CcUnsjbIo8P88m-sGvsxLdjjv4ZEmyt_KsN9ZHFPRgydpiibM6wbSG91yQtJ-JaF4p-rudn0skFudAXco3UwjAo',
      city_id: dubai.id,
    },
    {
      name: 'Al Mallah',
      slug: 'al-mallah',
      description: 'Authentic Lebanese cuisine with the best shawarma in Dubai. A local favorite since 1979.',
      cuisine_name: 'Lebanese',
      tags: ['Street Food', 'Lebanese', 'Deira'],
      latitude: 25.2631,
      longitude: 55.2972,
      image_url:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuA6eaIxTry_KRDyKZj88txaKzEOa9SnVJtM1vl41wsEJ5lqW5ZYcMDkAXcCSxx2agsXzT-mZFsqiNRVxRlmEcIzhZ3iJ5paQCdyVufsKS3dxp6IIaoWfDkmTqMZYDkOhXjU7WdtEoLycbLFCPOnivRbG4ktgXTat3Dp9i4-1hJtt9i11ztHOVMY8jcpEYwKBn1uRbIv7QV461o07h8BWCnPq5tkY1Bq8RYSIdkTEbDBURWjQUmDHghOzdGhpW50JKAg6ZqqlGd74dw',
      city_id: dubai.id,
    },
    {
      name: 'The Majestic Palate',
      slug: 'the-majestic-palate',
      description: 'Contemporary Mediterranean with Burj Views. Fine dining experience in the heart of DIFC.',
      cuisine_name: 'Mediterranean',
      tags: ['Fine Dining', 'Mediterranean', 'DIFC'],
      latitude: 25.2188,
      longitude: 55.2794,
      image_url:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCCgh5eLUqU_w8NcF0OD6Rof0xZGK0YUBx1HKJAsNBcXsgtLHL5G_2kvP7RIAKaiaaZH2mUxkWgEzxaWk8h7wCYBlt-J8h50pP_GgdRohCu1TeCaAkciCXM1_25RPPcijzNh3VSpvWK05mThlO9FfyRyLLvKOb0_DAYEpryqKtgFQbxo1tH8-F9CcUnsjbIo8P88m-sGvsxLdjjv4ZEmyt_KsN9ZHFPRgydpiibM6wbSG91yQtJ-JaF4p-rudn0skFudAXco3UwjAo',
      city_id: dubai.id,
    },
    {
      name: 'Neon Sushi Lounge',
      slug: 'neon-sushi-lounge',
      description: 'Modern Japanese cuisine with a vibrant atmosphere. Located in Dubai Marina.',
      cuisine_name: 'Japanese',
      tags: ['Japanese', 'Sushi', 'Dubai Marina'],
      latitude: 25.0772,
      longitude: 55.1394,
      image_url:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuC17g1_JeQq4mkUxwsO9BgLWBkGjOyU3uWWwn0LUjGvcch8hilZWe_0ZQCkZ2_p5ta5qt94qWVPKbC3P9fKnI_blJcz1XGhoCezrwxO40vGrycep7up1spbosndr9enSwkGcBTfGx1JYwPfdGGOdQ3bMm-wlzOcesV8kBkeTGhhWAhAaAcEITzkm5yPUdjRaf3vDSmX_CP5TCTpVtspzgS1GhF_689dSoxIYMzmnbMcG5c8T4pd-2oDli1FM2piI2ECuuwlZp9yGr8',
      city_id: dubai.id,
    },
  ];

  const createdRestaurants: any[] = [];
  for (const restaurant of restaurants) {
    const cuisine = findCuisine(restaurant.cuisine_name);
    if (!cuisine) {
      console.error(`Cuisine not found: ${restaurant.cuisine_name}`);
      continue;
    }

    const { cuisine_name, ...restaurantData } = restaurant;
    const created = await prisma.restaurant.upsert({
      where: { slug: restaurant.slug },
      update: {},
      create: {
        ...restaurantData,
        cuisine_id: cuisine.id,
      },
    });
    createdRestaurants.push(created);
  }

  // 4️⃣ Seed Dishes
  console.log('🍜 Seeding dishes...');
  const dishes = [
    // The Alchemist Lab dishes
    {
      name: 'Wagyu Truffle Carpaccio',
      slug: 'wagyu-truffle-carpaccio',
      category_name: 'Fine Dining',
      description:
        'Premium Wagyu beef carpaccio with shaved black winter truffles, arugula, and parmesan. A signature dish that showcases the finest ingredients.',
      price: 145,
      tags: ['Wagyu', 'Truffle', 'Signature'],
      image_url:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAL1neQmBLngr96Y7kVK_BsmrkGsd0StV8APxPHadrRrNPERJGlM6n0U--aaoztSynFXFn6Z5Wzn9L9-LmGTU3To2_gkgjVrIPkM0R-9A_cvAmPJ1hET86ZVVD1cgCQRbKQBbrgeUNETMh0QU1UVWBT1D6ESdGSWvpdVfvgQLubV7XsXSo-6lLZdvxJRldFGOxnhtUpJsTBXDcJLLLsF5ufDbPW004HA4zbhDq2xCobhHP5GoKaYmGE-dkHLAtnGAiDWx7KBR7GYoM',
      restaurant_id: createdRestaurants[0].id,
    },
    {
      name: 'Saffron Lobster Risotto',
      slug: 'saffron-lobster-risotto',
      category_name: 'Fine Dining',
      description: 'Creamy risotto with fresh lobster and saffron, finished with parmesan and herbs.',
      price: 210,
      tags: ['Lobster', 'Risotto', 'Saffron'],
      image_url:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAHsmhcX5APl5dxcb1kdCWDsimtEoMiFuzHI92zpNMoj5kXUJL3H3Qi3EwfXWXyn6Jjyins3tsTzYy4au_VjVd-Jg13oKlqoAZuZabjp87fPp0JTNXf2iH3YTb2fcUyCjAuhtZlfoo3H6yYVy9z4uNZeEEVvpIX3Ij3rovUSCfhlATAwRmuaDHb8mOFCKgqg5xC7xh9BXz2_qBJqqHolxSr07zLKOsFQ7LHAtpMq-lGXZpnhYGKsCLyd9NsJFbWp0xyHbWqYw6wMR4',
      restaurant_id: createdRestaurants[0].id,
    },
    {
      name: 'Burrata & Balsamic Pearls',
      slug: 'burrata-balsamic-pearls',
      category_name: 'Appetizers',
      description: 'Fresh burrata cheese with balsamic pearls, cherry tomatoes, and basil.',
      price: 85,
      tags: ['Burrata', 'Italian', 'Vegetarian'],
      image_url:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCg0OCWHjo9fGkn3UDlKMHCaP40CjVxTxOzW5RcGIXchmX7XuXANhaao6d23FFip-Yn5KPCoNecu3zuDEtlcpv8uGjbNzLZCEl_3zVuOUX-74tqeH-SuNnLcUHsRBx9U0W7JQOjdfr8mT7HICoAxmRAZlCXhaIXsRRgSATvoBLLJzyTmi_J9vKkyXnNxZLxl-aWOooXEplQERHXj0dUeWZoTxg-bmfnRHEfH5xVR2felFTMqYUKWR__GYmdmsddDFDeRrDYYm1doTU',
      restaurant_id: createdRestaurants[0].id,
    },
    {
      name: 'Gold Flaked Date Pudding',
      slug: 'gold-flaked-date-pudding',
      category_name: 'Desserts',
      description: 'Traditional Emirati date pudding with gold flakes and vanilla ice cream.',
      price: 75,
      tags: ['Dessert', 'Emirati', 'Dates'],
      image_url:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDHGWUWGO0g31j68iw-jAQ2mKQ7nQZyJzbllJVU-LtkXYTz4yloBOvYGmDrkgYWVbFXLfTBwQ-SCEOxgxOHQrEebwGxUUDi3nB6UNxMhAN5KdsqyLo8QTnzweWbjGHqlhD0CMTPoQbr0JbfSIkZjsZtz856br2SsyLuMDytoHEWGt7Pgs2rYNVIuEozQlCBsIuSzo_6I5G4Ydh7BcDA-htbxBhczYyE9BnYrxBmxmevBGB3Ca64hengZmdPDdwCapIZZ__EYagF50A',
      restaurant_id: createdRestaurants[0].id,
    },
    {
      name: 'Spiced Lamb Shoulder',
      slug: 'spiced-lamb-shoulder',
      category_name: 'Main Course',
      description: 'Slow-cooked lamb shoulder with Middle Eastern spices, served with rice and vegetables.',
      price: 190,
      tags: ['Lamb', 'Middle Eastern', 'Slow Cooked'],
      image_url:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAL1neQmBLngr96Y7kVK_BsmrkGsd0StV8APxPHadrRrNPERJGlM6n0U--aaoztSynFXFn6Z5Wzn9L9-LmGTU3To2_gkgjVrIPkM0R-9A_cvAmPJ1hET86ZVVD1cgCQRbKQBbrgeUNETMh0QU1UVWBT1D6ESdGSWvpdVfvgQLubV7XsXSo-6lLZdvxJRldFGOxnhtUpJsTBXDcJLLLsF5ufDbPW004HA4zbhDq2xCobhHP5GoKaYmGE-dkHLAtnGAiDWx7KBR7GYoM',
      restaurant_id: createdRestaurants[0].id,
    },
    // Salt & Bone dishes
    {
      name: 'Truffle Wagyu Burger',
      slug: 'truffle-wagyu-burger',
      category_name: 'Burgers',
      description:
        'Experience culinary heights with our 48-hour aged Wagyu, shaved black winter truffles, and artisanal charcoal brioche.',
      price: 85,
      tags: ['Wagyu', 'Truffle', 'Burger', 'Premium'],
      image_url:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBpLMA9xAFo6-Jqueg4Cj_klVJhefG8QCj63mSW68vNpyQXJlcompCxM3FEnCkAA9uXGs8cy11LcYOVGrEtbmdVOWa-XgsuUytngbiuom8jd2185ftWJY7p5TE42hGNciP6YDIbqFjSpKxDHJG_r09u35UaAZdFvPrXx5hkoOXMrXw_1SEh7WqIvaVQyTF78ne8a8UIaAWZUSzXRpatynqipRJQFGb6DwwwbEsUrWbMJSjSAyNfkdv81pa-gM7VUBqPbxO63Y3zMQk',
      restaurant_id: createdRestaurants[1].id,
    },
    // Al Mallah dishes (Shawarma)
    {
      name: 'OG Charcoal Chicken Shawarma',
      slug: 'og-charcoal-chicken-shawarma',
      category_name: 'Shawarma',
      description: 'Authentic Lebanese shawarma with charcoal-grilled chicken, fresh vegetables, and tahini sauce.',
      price: 24,
      tags: ['Shawarma', 'Chicken', 'Lebanese', 'Street Food'],
      image_url:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuA6eaIxTry_KRDyKZj88txaKzEOa9SnVJtM1vl41wsEJ5lqW5ZYcMDkAXcCSxx2agsXzT-mZFsqiNRVxRlmEcIzhZ3iJ5paQCdyVufsKS3dxp6IIaoWfDkmTqMZYDkOhXjU7WdtEoLycbLFCPOnivRbG4ktgXTat3Dp9i4-1hJtt9i11ztHOVMY8jcpEYwKBn1uRbIv7QV461o07h8BWCnPq5tkY1Bq8RYSIdkTEbDBURWjQUmDHghOzdGhpW50JKAg6ZqqlGd74dw',
      restaurant_id: createdRestaurants[2].id,
    },
    {
      name: 'Spicy Lamb Doner Platter',
      slug: 'spicy-lamb-doner-platter',
      category_name: 'Shawarma',
      description: 'Spiced lamb doner served on a platter with rice, salad, and garlic sauce.',
      price: 45,
      tags: ['Shawarma', 'Lamb', 'Spicy'],
      image_url:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuD7ydUbjGgmUQ8WWFjb2pj71lU3I8Jfl1wT4yRGSt18lK_uf7fewFIsNpgBlzqM2pHbIm0N_JqOSo_lEHFEsgzsaaKxEBjfL3qjDbSCueiAoyBQAPAikCSuyRI0BTszutbXi7Gb-zz5r74-9IOLV2ogskgVEAWuiGzs1Tmxt1CuInVwvIe0cyTHKdCKj9r9BsOLbxMSoh1SMs-XlOSW7rjw9OSZkC_Pe-42tgaaNMl3QtSBLZx4THifIpqEyZadvlp9thiVhORdMow',
      restaurant_id: createdRestaurants[2].id,
    },
    // Neon Sushi Lounge dishes
    {
      name: 'Dragon Maki Roll',
      slug: 'dragon-maki-roll',
      category_name: 'Sushi',
      description: 'Eel, cucumber, and avocado topped with spicy mayo and eel sauce.',
      price: 115,
      tags: ['Sushi', 'Japanese', 'Eel'],
      image_url:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBV779PABJra2WoS5y89s2_fyuHYbStR1lyJpUDH_VD8M4dGxHwIlGdjPyDcGu_XoYsYVi0BxmLyfDO7aP1sfzXKtYZPHMwW9iuTxY98pPreQNm_Y2FHlTZ5fUp2rVIh07_pqmkgAIX3pJzns-V1qSjmXrg0ye-Pq0zj0bfdFcwmGF4ILRwn5A1DBtSYQd5wA1FlwrgnN7sN-yaiNDJhNZlBvWTa6H6r6NB_5AuGoqa5mo9QnG2SKGaQ7h8uTSqO4-HZj6lY_XXp5A',
      restaurant_id: createdRestaurants[4].id,
    },
    {
      name: 'Spicy Tuna Roll',
      slug: 'spicy-tuna-roll',
      category_name: 'Sushi',
      description: 'Fresh tuna mixed with spicy mayo, cucumber, and sesame seeds.',
      price: 95,
      tags: ['Sushi', 'Tuna', 'Spicy'],
      image_url:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBV779PABJra2WoS5y89s2_fyuHYbStR1lyJpUDH_VD8M4dGxHwIlGdjPyDcGu_XoYsYVi0BxmLyfDO7aP1sfzXKtYZPHMwW9iuTxY98pPreQNm_Y2FHlTZ5fUp2rVIh07_pqmkgAIX3pJzns-V1qSjmXrg0ye-Pq0zj0bfdFcwmGF4ILRwn5A1DBtSYQd5wA1FlwrgnN7sN-yaiNDJhNZlBvWTa6H6r6NB_5AuGoqa5mo9QnG2SKGaQ7h8uTSqO4-HZj6lY_XXp5A',
      restaurant_id: createdRestaurants[4].id,
    },
  ];

  const createdDishes: any[] = [];
  for (const dish of dishes) {
    const category = findCategory(dish.category_name);
    if (!category) {
      console.error(`Category not found: ${dish.category_name}`);
      continue;
    }

    // Get restaurant to get its city_id
    const restaurant = createdRestaurants.find((r) => r.id === dish.restaurant_id);
    if (!restaurant) {
      console.error(`Restaurant not found for dish: ${dish.name}`);
      continue;
    }

    // Fetch restaurant with city_id to ensure we have it
    const restaurantWithCity = await prisma.restaurant.findUnique({
      where: { id: restaurant.id },
      select: { city_id: true },
    });

    if (!restaurantWithCity) {
      console.error(`Restaurant not found in database for dish: ${dish.name}`);
      continue;
    }

    const { category_name, ...dishData } = dish;
    // Use create with explicit unchecked input to include city_id
    const dishCreateData = {
      name: dishData.name,
      slug: dishData.slug,
      description: dishData.description,
      price: dishData.price,
      tags: dishData.tags,
      image_url: dishData.image_url,
      restaurant_id: dishData.restaurant_id,
      category_id: category.id,
      city_id: restaurantWithCity.city_id, // Add city_id from restaurant
    };
    
    const created = await prisma.dish.upsert({
      where: { slug: dish.slug },
      update: {},
      create: dishCreateData as any, // Type assertion for unchecked input
    });
    createdDishes.push(created);
  }

  // 5️⃣ Seed Reviews
  console.log('⭐ Seeding reviews...');
  const reviews = [
    // Truffle Wagyu Burger reviews
    {
      user_id: createdUsers[0].id,
      dish_id: createdDishes[5].id, // Truffle Wagyu Burger
      rating: 5,
      comment:
        'The truffle flavor is subtle yet distinct. The meat quality is clearly superior to any other burger in DIFC. A must-try for any burger enthusiast.',
    },
    {
      user_id: createdUsers[3].id, // Alex Chen
      dish_id: createdDishes[5].id,
      rating: 5,
      comment:
        'Absolute perfection. The brioche bun is like a cloud. Make sure to order it medium-rare to truly appreciate the incredible marbling of the wagyu beef.',
    },
    {
      user_id: createdUsers[2].id, // Fatima K.
      dish_id: createdDishes[5].id,
      rating: 4,
      comment:
        "Delicious, but definitely heavy! Sharing is recommended if you're ordering appetizers as well. The truffle oil aroma hits you as soon as it arrives.",
    },
    // Wagyu Truffle Carpaccio reviews
    {
      user_id: createdUsers[0].id, // Sarah H.
      dish_id: createdDishes[0].id,
      rating: 5,
      comment:
        'Dubite changed how I explore DIFC. The dish-first approach ensures I never miss out on the best wagyu in the city.',
    },
    // Dragon Maki Roll reviews
    {
      user_id: createdUsers[1].id, // Ahmed M.
      dish_id: createdDishes[7].id,
      rating: 5,
      comment:
        'The curation is unmatched. Every recommendation I\'ve followed from the "Trending Discovery" list has been phenomenal.',
    },
    // OG Charcoal Chicken Shawarma reviews
    {
      user_id: createdUsers[1].id,
      dish_id: createdDishes[6].id,
      rating: 5,
      comment: 'Best shawarma in Dubai! The charcoal flavor is incredible and the chicken is always perfectly cooked.',
    },
    {
      user_id: createdUsers[4].id,
      dish_id: createdDishes[6].id,
      rating: 5,
      comment: 'Authentic Lebanese taste. Reminds me of home. The tahini sauce is perfect!',
    },
  ];

  for (const review of reviews) {
    await prisma.review.upsert({
      where: {
        user_id_dish_id: {
          user_id: review.user_id,
          dish_id: review.dish_id,
        },
      },
      update: {},
      create: review,
    });
  }

  // 6️⃣ Calculate and Seed Stats
  console.log('📊 Calculating and seeding stats...');

  // Calculate Dish Stats
  for (const dish of createdDishes) {
    const dishReviews = await prisma.review.findMany({
      where: { dish_id: dish.id },
    });

    if (dishReviews.length > 0) {
      const avgRating =
        dishReviews.reduce((sum, r) => sum + r.rating, 0) / dishReviews.length;
      const lastReview = dishReviews.sort(
        (a, b) => b.created_at.getTime() - a.created_at.getTime()
      )[0];

      // Calculate score (weighted average of rating and review count)
      const score = avgRating * 0.7 + Math.min(dishReviews.length / 10, 1) * 3;

      await prisma.dishStats.upsert({
        where: { dish_id: dish.id },
        update: {
          avg_rating: avgRating,
          review_count: dishReviews.length,
          last_review_at: lastReview.created_at,
          score: score,
          updated_at: new Date(),
        },
        create: {
          dish_id: dish.id,
          avg_rating: avgRating,
          review_count: dishReviews.length,
          last_review_at: lastReview.created_at,
          score: score,
        },
      });
    }
  }

  // Calculate Restaurant Stats
  for (const restaurant of createdRestaurants) {
    const restaurantDishes = await prisma.dish.findMany({
      where: { restaurant_id: restaurant.id },
      include: { stats: true },
    });

    if (restaurantDishes.length > 0) {
      const dishesWithStats = restaurantDishes.filter((d) => d.stats);
      const avgDishScore =
        dishesWithStats.length > 0
          ? dishesWithStats.reduce((sum, d) => sum + (d.stats?.score || 0), 0) /
            dishesWithStats.length
          : 0;

      const totalReviews = dishesWithStats.reduce(
        (sum, d) => sum + (d.stats?.review_count || 0),
        0
      );

      // Calculate restaurant score
      const score = avgDishScore * 0.6 + Math.min(totalReviews / 50, 1) * 4;

      await prisma.restaurantStats.upsert({
        where: { restaurant_id: restaurant.id },
        update: {
          avg_dish_score: avgDishScore,
          total_reviews: totalReviews,
          dish_count: restaurantDishes.length,
          score: score,
          updated_at: new Date(),
        },
        create: {
          restaurant_id: restaurant.id,
          avg_dish_score: avgDishScore,
          total_reviews: totalReviews,
          dish_count: restaurantDishes.length,
          score: score,
        },
      });
    }
  }

  console.log('✅ Database seed completed successfully!');
  console.log(`   - ${(await prisma.city.count())} cities`);
  console.log(`   - ${(await prisma.user.count())} users`);
  console.log(`   - ${(await prisma.restaurant.count())} restaurants`);
  console.log(`   - ${(await prisma.dish.count())} dishes`);
  console.log(`   - ${(await prisma.review.count())} reviews`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
