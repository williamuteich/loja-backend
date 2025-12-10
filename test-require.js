try {
    const { PrismaClient } = require('./generated/prisma/client');
    console.log('Successfully required PrismaClient');
    process.exit(0);
} catch (e) {
    console.error('Failed to require PrismaClient:', e);
    process.exit(1);
}
