export default () => ({
  app: {
    port: parseInt(process.env.PORT || '3000', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    teamExpiresIn: process.env.JWT_TEAM_EXPIRES_IN || '1h',
  },
  database: {
    url: process.env.DATABASE_URL,
  },
});
