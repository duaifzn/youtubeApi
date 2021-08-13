import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from "./_index";  

interface WpTermAttributes {
    term_id: number
    name: string
    slug?: string
    term_group?: number    
}

/*
  We have to declare the WpTermCreationAttributes to
  tell Sequelize and TypeScript that the property id,
  in this case, is optional to be passed at creation time
*/
interface WpTermCreationAttributes
  extends Optional<WpTermAttributes, 'term_id'> {}

interface WpTermModel
  extends Model<WpTermAttributes, WpTermCreationAttributes>{
    term_id?: number
    name: string
    slug?: string
    term_group?: number 
  }


const WpTerm = sequelize.define<WpTermModel>('wp_term', {
    term_id: { 
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING
    },
    slug: {
        type: DataTypes.STRING
    },
    term_group: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
},{
    timestamps: false,
    tableName: 'wp_terms',
    hooks: {
        beforeCreate: (wpTerm) =>{
            wpTerm.setDataValue('slug', wpTerm.getDataValue('name'))
        },
        beforeUpdate: (wpTerm) =>{
            wpTerm.setDataValue('slug', wpTerm.getDataValue('name'))
        }
    }
})

export default WpTerm;