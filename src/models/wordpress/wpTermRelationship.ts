import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from "./_index";  

interface WpTermRelationshipAttributes {
    object_id: number
    term_taxonomy_id: number
    term_order?: number
}

/*
  We have to declare the WpTermRelationshipCreationAttributes to
  tell Sequelize and TypeScript that the property id,
  in this case, is optional to be passed at creation time
*/

interface WpTermRelationshipModel
  extends Model<WpTermRelationshipAttributes>{}


const WpTermRelationship = sequelize.define<WpTermRelationshipModel>('wp_term_relationship', {
    object_id: { 
        type: DataTypes.INTEGER,
    },
    term_taxonomy_id: {
        type: DataTypes.INTEGER
    },
    term_order: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
},{
    timestamps: false,
    tableName: 'wp_term_relationships'
})

export default WpTermRelationship;