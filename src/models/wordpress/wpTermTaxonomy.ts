import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from "./_index";  

interface WpTermTaxonomyAttributes {
    term_taxonomy_id: number
    term_id: number
    taxonomy: string
    description?: Text
    parent?: number
    count?: number
}

/*
  We have to declare the WpTermTaxonomyCreationAttributes to
  tell Sequelize and TypeScript that the property id,
  in this case, is optional to be passed at creation time
*/
interface WpTermTaxonomyCreationAttributes
  extends Optional<WpTermTaxonomyAttributes, 'term_taxonomy_id'> {}

interface WpTermTaxonomyModel
  extends Model<WpTermTaxonomyAttributes, WpTermTaxonomyCreationAttributes>{
    term_taxonomy_id: number
    term_id: number
    taxonomy: string
    description?: Text
    parent?: number
    count?: number
  }


const WpTermTaxonomy = sequelize.define<WpTermTaxonomyModel>('wp_term_taxonomy', {
    term_taxonomy_id: { 
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    term_id: {
        type: DataTypes.INTEGER
    },
    taxonomy: {
        type: DataTypes.STRING
    },
    description: {
        type: DataTypes.TEXT,
        defaultValue: 'no data'
    },
    parent: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    count: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    }
},{
    timestamps: false,
    tableName: 'wp_term_taxonomy'
})

export default WpTermTaxonomy;