import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from "./_index";  

interface WpUsermetaAttributes {
    umeta_id: number
    user_id: number
    meta_key: string
    meta_value: Text
}

/*
  We have to declare the WpUsermetaCreationAttributes to
  tell Sequelize and TypeScript that the property id,
  in this case, is optional to be passed at creation time
*/
interface WpUsermetaCreationAttributes
  extends Optional<WpUsermetaAttributes, 'umeta_id'> {}

interface WpUsermetaModel
  extends Model<WpUsermetaAttributes, WpUsermetaCreationAttributes>{}


const WpUsermeta = sequelize.define<WpUsermetaModel>('wp_usermeta', {
    umeta_id: { 
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER
    },
    meta_key: {
        type: DataTypes.STRING
    },
    meta_value: {
        type: DataTypes.TEXT
    }
},{
    timestamps: false,
    tableName: 'wp_usermeta'
})

export default WpUsermeta;