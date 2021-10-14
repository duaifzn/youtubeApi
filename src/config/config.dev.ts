export const dev = {
    youtubeKey: 'AIzaSyBKgc_Q_DYQ6kDUAQMPKcbzK75BngqvKUs',
    puppeteer: {
        headless: false,
    },
    facebook: {
        email: 'rachel.forman.96@bk.ru',
        password: '2XO7ZlIGwXV',
    },
    instagram: {
        sessionId: '13371201014%3AHR0DY0KxykP3L4%3A21'
    },
    allowOrigins: [
        'http://localhost:3000',
    ],
    mongoDb: {
        mongoUri: 'mongodb://localhost:27020/social',
        authSource: 'admin',
        user: 'root',
        pass: 'root',
    },
    wordpressDb: {
        username: "root",
        password: "root",
        database: "wordpress",
        host: "127.0.0.1",
        port: 3313,
        dialect: "mysql"
    },
    jwt: {
        secret: 'jwtSecret',
        expiresIn: '7d'
    }
    
}
