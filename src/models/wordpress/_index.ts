import { Sequelize } from 'sequelize';
import { Config } from '../../config/config';

const env = process.env.NODE_ENV || 'dev';
const config = Config[env].wordpressDb;

const sequelize = config.url
    ? new Sequelize(config.url, config)
    : new Sequelize(config.database, config.username, config.password, config);

export { Sequelize, sequelize }