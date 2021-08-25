import dotenv from 'dotenv'
dotenv.config()

export const prod = {
    youtubeKey: process.env.YOUTUBE_KEY,
    puppeteer: {
        headless: true,
    },
    facebook: {
        email: process.env.FACEBOOK_EMAIL,
        password: process.env.FACEBOOK_PASSWORD,
    },
    instagram: {
        sessionId: process.env.INSTAGRAM_SESSION_ID
    },
    allowOrigins: [
        'http://localhost:3000',
    ],
    mongoDb: {
        mongoUri: process.env.MONGO_DB_URI,
        authSource: 'admin',
        user: process.env.MONGO_DB_USER,
        pass: process.env.MONGO_DB_PASS,
    },
    wordpressDb: {
        username: process.env.WORDPRESS_DB_USER,
        password: process.env.WORDPRESS_DB_PASSWORD,
        database: process.env.WORDPRESS_DB_NAME,
        host: process.env.WORDPRESS_DB_HOST,
        port: process.env.WORDPRESS_DB_PORT,
        dialect: "mysql"
    },
    jwt: {
        secret: 'jwtSecret',
        expiresIn: '7d'
    }
}