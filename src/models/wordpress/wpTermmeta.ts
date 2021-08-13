import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from "./_index";  

interface WpTermmetaAttributes {
    meta_id: number
    term_id: number
    meta_key: string
    meta_value: Text
}

/*
  We have to declare the WpTermmetaCreationAttributes to
  tell Sequelize and TypeScript that the property id,
  in this case, is optional to be passed at creation time
*/
interface WpTermmetaCreationAttributes
  extends Optional<WpTermmetaAttributes, 'meta_id'> {}

interface WpTermmetaModel
  extends Model<WpTermmetaAttributes, WpTermmetaCreationAttributes>{}


const WpTermmeta = sequelize.define<WpTermmetaModel>('wp_termmeta', {
    meta_id: { 
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    term_id: {
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
    tableName: 'wp_termmeta'
})

export default WpTermmeta;