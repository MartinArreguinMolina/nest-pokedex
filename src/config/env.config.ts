

export const EnvConfig = () => ({
    environment: process.env.NODE_ENV || 'dev',
    mongodb: process.env.MONGODB,
    port: process.env.PORT || 3002,
    defaul_limit: +process.env.DEFAULT_LIMIT! || 7
});