import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from "./_index";  

interface WpUserAttributes {
    ID: number
    user_login: string
    user_pass: string
    user_nicename: string
    user_email: string
    user_url: string
    user_registered: Date
    user_activation_key: string
    user_status: number
    display_name: string
}

/*
  We have to declare the WpUserCreationAttributes to
  tell Sequelize and TypeScript that the property id,
  in this case, is optional to be passed at creation time
*/
interface WpUserCreationAttributes
  extends Optional<WpUserAttributes, 'ID'> {}

interface WpUserModel
  extends Model<WpUserAttributes, WpUserCreationAttributes>{}


const WpUser = sequelize.define<WpUserModel>('wp_user', {
    ID: { 
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_login: {
        type: DataTypes.STRING
    },
    user_pass: {
        type: DataTypes.STRING
    },
    user_nicename: {
        type: DataTypes.STRING
    },
    user_email: {
        type: DataTypes.STRING
    },
    user_url: {
        type: DataTypes.STRING
    },
    user_registered: {
        type: DataTypes.STRING
    },
    user_activation_key: {
        type: DataTypes.DATE
    },
    user_status: {
        type: DataTypes.INTEGER
    },
    display_name: {
        type: DataTypes.STRING
    },
},{
    timestamps: false,
    tableName: 'wp_users'
})

export default WpUser;