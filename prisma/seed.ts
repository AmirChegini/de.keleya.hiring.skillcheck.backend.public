
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seed() {
  try {
    const credentials1 = await prisma.credentials.upsert({
      where: { id: 1 },
      update: {},
      create: {
        hash: 'myhashedpassword1',
      },
    });

    const credentials2 = await prisma.credentials.upsert({
      where: { id: 2 },
      update: {},
      create: {
        hash: 'myhashedpassword2',
      },
    });

    console.log({credentials1,credentials2})

   const user1= await prisma.user.upsert({
      where: {  email: 'johndoe@example.com' },
      update: {},
      create: {
        name: 'John Doe',
        email: 'johndoe@example.com',
        email_confirmed: true,
        is_admin: false,
        credentials_id: credentials1.id,
      },
    });

   const user2= await prisma.user.upsert({
      where: {  email: 'bobmarley@example.com' },
      update: {},
      create: {
        name: 'Bob Marley',
        email: 'bobmarley@example.com',
        email_confirmed: true,
        is_admin: true,
        credentials_id: credentials2.id,
      },
    });

   const user3= await prisma.user.upsert({
      where: { email: 'tomhardy@example.com' },
      update: {},
      create: {
        name: 'Tom Hardy',
        email: 'tomhardy@example.com',
        email_confirmed: true,
        is_admin: true,
        credentials_id: credentials2.id,
      },
    });

      console.log({ user1, user2, user3 })
      
    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database: ', error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();