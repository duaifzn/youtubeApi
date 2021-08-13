import { DataTypes, Model, Optional  } from "sequelize";
import { sequelize } from './_index';

interface WpPostmetaAttributes {
    meta_id: number
    post_id: number
    meta_key: string
    meta_value: Text

};

/*
  We have to declare the WpPostmetaCreationAttributes to
  tell Sequelize and TypeScript that the property id,
  in this case, is optional to be passed at creation time
*/
interface WpPostmetaCreationAttributes
  extends Optional<WpPostmetaAttributes, 'meta_id'> {}

interface WpPostmetaModel
  extends Model<WpPostmetaAttributes, WpPostmetaCreationAttributes>{}


const WpPostmeta = sequelize.define<WpPostmetaModel>('wp_postmeta', {
    meta_id: { 
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    post_id: {
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
    tableName: 'wp_postmeta'
})

export default WpPostmeta;