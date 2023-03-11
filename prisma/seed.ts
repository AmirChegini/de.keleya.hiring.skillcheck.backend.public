import { hashPassword } from '../src/common/utils/password';

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seed() {
  try {
    const credentials1 = await prisma.credentials.upsert({
      where: { id: 1 },
      update: {},
      create: {
        hash: await hashPassword('password1'),
      },
    });

    const credentials2 = await prisma.credentials.upsert({
      where: { id: 2 },
      update: {},
      create: {
        hash: await hashPassword('password2'),
      },
    });

    const credentials3 = await prisma.credentials.upsert({
      where: { id: 3 },
      update: {},
      create: {
        hash: await hashPassword('password3'),
      },
    });

    const credentials4 = await prisma.credentials.upsert({
      where: { id: 4 },
      update: {},
      create: {
        hash: await hashPassword('password4'),
      },
    });

    console.log({ credentials1, credentials2, credentials3 });

    const user1 = await prisma.user.upsert({
      where: { email: 'admin@example.com'.toLowerCase() },
      update: {},
      create: {
        name: 'admin',
        email: 'admin@example.com'.toLowerCase(),
        email_confirmed: true,
        is_admin: true,
        credentials_id: credentials1.id,
      },
    });

    const user2 = await prisma.user.upsert({
      where: { email: 'user@example.com'.toLowerCase() },
      update: {},
      create: {
        name: 'user',
        email: 'user@example.com'.toLowerCase(),
        email_confirmed: true,
        is_admin: false,
        credentials_id: credentials2.id,
      },
    });

    const user3 = await prisma.user.upsert({
      where: { email: 'user2@example.com'.toLowerCase() },
      update: {},
      create: {
        name: 'user2',
        email: 'user2@example.com'.toLowerCase(),
        email_confirmed: true,
        is_admin: false,
        credentials_id: credentials3.id,
      },
    });

    const user4 = await prisma.user.upsert({
      where: { email: 'user3@example.com'.toLowerCase() },
      update: {},
      create: {
        name: 'The mad king',
        email: 'user3@example.com'.toLowerCase(),
        email_confirmed: true,
        is_admin: false,
        credentials_id: credentials4.id,
      },
    });

    console.log({ user1, user2, user3, user4 });

    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database: ', error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
