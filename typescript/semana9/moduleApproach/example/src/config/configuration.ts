export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    type: 'sqlite' as const,
    database: process.env.DATABASE_PATH || 'database.sqlite',
    synchronize: process.env.NODE_ENV === 'development',
    logging: process.env.NODE_ENV === 'development',
  },
}); 