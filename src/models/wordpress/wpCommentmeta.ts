import { DataTypes, Model, Optional  } from "sequelize";
import { sequelize } from './_index';

interface WpCommentmetaAttributes {
    meta_id: number
    comment_id: number
    meta_key: string
    meta_value: Text

};

/*
  We have to declare the WpCommentmetaCreationAttributes to
  tell Sequelize and TypeScript that the property id,
  in this case, is optional to be passed at creation time
*/
interface WpCommentmetaCreationAttributes
  extends Optional<WpCommentmetaAttributes, 'meta_id'> {}

interface WpCommentmetaModel
  extends Model<WpCommentmetaAttributes, WpCommentmetaCreationAttributes>{}


const WpCommentmeta = sequelize.define<WpCommentmetaModel>('wp_commentmeta', {
    meta_id: { 
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    comment_id: {
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
    tableName: 'wp_commentmeta'
})

export default WpCommentmeta;