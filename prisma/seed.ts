import { PrismaClient, Role } from '../generated/prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import * as bcrypt from 'bcrypt';

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || 'file:./dev.db',
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const plainPassword = 'peganobreu123';
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  await prisma.team.upsert({
    where: { email: 'williamuteich14@gmail.com' },
    update: {
      name: 'william',
      lastName: 'uteich',
      password: hashedPassword,
      role: Role.ADMIN,
    },
    create: {
      name: 'william',
      lastName: 'uteich',
      email: 'williamuteich14@gmail.com',
      password: hashedPassword,
      role: Role.ADMIN,
    },
  });

  console.log('Seed: admin team user created/updated successfully');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
