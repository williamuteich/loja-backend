import { PrismaClient, Role } from '../src/generated/prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import * as bcrypt from 'bcrypt';

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || 'file:./dev.db',
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const plainPassword = 'teste123';
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  await prisma.team.upsert({
    where: { email: 'teste@gmail.com' },
    update: {
      name: 'wesley',
      lastName: 'rodrigues',
      password: hashedPassword,
      role: Role.ADMIN,
    },
    create: {
      name: 'wesley',
      lastName: 'rodrigues',
      email: 'teste@gmail.com',
      password: hashedPassword,
      role: Role.ADMIN,
    },
  });

  console.log('Seed: admin team user created/updated successfully');

  const existingConfig = await prisma.storeConfiguration.findFirst();

  if (!existingConfig) {
    await prisma.storeConfiguration.create({
      data: {
        isActive: true,
        maintenanceMode: false,
        maintenanceMessage: 'Estamos em manutenção. Voltamos em breve!',

        storeName: 'Minha Loja de Cosméticos (Teste)',
        cnpj: '12.345.678/0001-90',
        description: 'Loja de teste para configuração inicial.',
        phone: '(11) 99999-9999',
        whatsapp: '(11) 99999-9999',

        logoUrl: 'https://placehold.co/300x120?text=Logo+Teste',
        faviconUrl: 'https://placehold.co/32x32',

        googleMapsEmbedUrl: null,

        businessHours: 'Seg–Sex, 9h às 18h',

        contactEmail: 'contato@loja-teste.com',
        automaticNewsletter: false,

        seoKeywords: 'teste, loja, cosméticos',

        currency: 'BRL',
        locale: 'pt-BR',

        socialMedias: {
          create: [
            { platform: 'Instagram', url: 'https://instagram.com/minhaloja', isActive: true },
            { platform: 'Facebook', url: 'https://facebook.com/minhaloja', isActive: true },
            { platform: 'WhatsApp', url: 'https://wa.me/5511999999999', isActive: true },
          ],
        },
      },
    });

    console.log('Seed: default store configuration created');
  } else {
    console.log('Seed: store configuration already exists, skipping');
  }
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });