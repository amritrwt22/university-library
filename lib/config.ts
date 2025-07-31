// this config object holds the environment variables and other configurations
const config = {
  env: {
    apiEndpoint: process.env.NEXT_PUBLIC_API_ENDPOINT!, // The base API endpoint for the application, used for API requests
    prodApiEndpoint: process.env.NEXT_PUBLIC_PROD_API_ENDPOINT!, // The production API endpoint for the application, used for API requests
    // imagekit configuration for image uploads
    imagekit: {
      publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
      urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
    },
    databaseUrl: process.env.DATABASE_URL!, // The URL for neos database connection
    // upstash configuration for Redis and QStash
    upstash: {
      redisUrl: process.env.UPSTASH_REDIS_URL!,
      redisToken: process.env.UPSTASH_REDIS_TOKEN!,
      qstashUrl: process.env.QSTASH_URL!,
      qstashToken: process.env.QSTASH_TOKEN!,
    },
    resendToken: process.env.RESEND_TOKEN!, // The token for Resend service, used for sending emails
  },
};

export default config;

// This config file holds the environment variables and other configurations
