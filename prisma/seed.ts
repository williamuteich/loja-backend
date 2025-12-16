import { PrismaClient, Role } from '../src/generated/prisma/client';
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

  // ===== STORE CONFIGURATION (dados de teste) =====
  const existingConfig = await prisma.storeConfiguration.findFirst();

  if (!existingConfig) {
    await prisma.storeConfiguration.create({
      data: {
        // Controle do Site
        isActive: true,
        maintenanceMode: false,
        maintenanceMessage: 'Estamos em manutenção. Voltamos em breve!',

        // Dados da Loja
        storeName: 'Minha Loja de Cosméticos (Teste)',
        cnpj: '12.345.678/0001-90',
        description: 'Loja de teste para configuração inicial.',
        phone: '(11) 99999-9999',
        whatsapp: '(11) 99999-9999',

        // Identidade Visual
        logoUrl: 'https://placehold.co/300x120?text=Logo+Teste',
        faviconUrl: 'https://placehold.co/32x32',

        // Localização
        googleMapsEmbedUrl: null,

        // Horário de Funcionamento
        businessHours: 'Seg–Sex, 9h às 18h',

        // Email
        contactEmail: 'contato@loja-teste.com',
        notifyNewOrders: false,
        automaticNewsletter: false,

        // Frete
        freeShippingEnabled: false,
        freeShippingValue: null,
        shippingDeadline: null,

        // Pagamentos
        creditCardEnabled: true,
        pixEnabled: true,
        boletoEnabled: false,

        // SEO
        seoTitle: 'Minha Loja de Cosméticos (Teste)',
        seoDescription: 'Configuração inicial de teste da loja.',
        seoKeywords: 'teste, loja, cosméticos',

        // Internacionalização
        currency: 'BRL',
        locale: 'pt-BR',
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