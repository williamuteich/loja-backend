import { PrismaClient, Role } from '../generated/prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import * as bcrypt from 'bcrypt';

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || 'file:./dev.db',
});

const prisma = new PrismaClient({ adapter });

async function main() {
  // ===== ADMIN =====
  const plainPassword = 'peganobreu123';
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  await prisma.team.upsert({
    where: { email: 'williamuteich14@gmail.com' },
    update: {
      name: 'William',
      lastName: 'Uteich',
      password: hashedPassword,
      role: Role.ADMIN,
    },
    create: {
      name: 'William',
      lastName: 'Uteich',
      email: 'williamuteich14@gmail.com',
      password: hashedPassword,
      role: Role.ADMIN,
    },
  });

  console.log('Seed: admin team user created/updated');

  // ===== STORE CONFIGURATION =====
  const existingConfig = await prisma.storeConfiguration.findFirst();

  if (!existingConfig) {
    await prisma.storeConfiguration.create({
      data: {
        // Controle do Site
        isActive: true,
        maintenanceMode: false,
        maintenanceMessage: 'Estamos em manutenção. Voltamos em breve!',

        // Dados da Loja
        storeName: 'Minha Loja de Cosméticos',
        cnpj: '12.345.678/0001-90',
        description: 'Loja especializada em cosméticos e produtos de beleza.',
        phone: '(11) 99999-9999',
        whatsapp: '(11) 99999-9999',

        // Identidade Visual
        logoUrl: 'https://placehold.co/300x120?text=Logo',
        faviconUrl: 'https://placehold.co/32x32',

        // Localização
        googleMapsEmbedUrl:
          '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3453.622638360239!2d-51.135637423563786!3d-30.047682231428215!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95199d80c93812e7%3A0xf269f376ddcbe461!2sRua%20Ney%20da%20Gama%20Ahrends%2C%20706%20-%20Morro%20Santana%2C%20Porto%20Alegre%20-%20RS%2C%2091450-345!5e0!3m2!1spt-BR!2sbr!4v1765844543750!5m2!1spt-BR!2sbr" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',

        // Horário de Funcionamento
        businessHours: 'Seg–Sex, 9h às 18h',

        // Email
        contactEmail: 'contato@minhaloja.com',
        notifyNewOrders: true,
        automaticNewsletter: true,

        // Frete
        freeShippingEnabled: true,
        freeShippingValue: 150,
        shippingDeadline: 3,

        // Pagamentos
        creditCardEnabled: true,
        pixEnabled: true,
        boletoEnabled: true,

        // SEO
        seoTitle: 'Minha Loja de Cosméticos',
        seoDescription: 'Cosméticos e produtos de beleza com qualidade premium.',
        seoKeywords: 'cosméticos, beleza, maquiagem, skincare',

        // Internacionalização
        currency: 'BRL',
        locale: 'pt-BR',
      },
    });

    console.log('Seed: store configuration created');
  } else {
    console.log('Seed: store configuration already exists');
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
