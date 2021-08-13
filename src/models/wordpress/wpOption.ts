import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from "./_index";  

interface WpOptionAttributes {
    option_id: number
    option_name: string
    option_value: Text
    autoload: string
}

/*
  We have to declare the WpOptionCreationAttributes to
  tell Sequelize and TypeScript that the property id,
  in this case, is optional to be passed at creation time
*/
interface WpOptionCreationAttributes
  extends Optional<WpOptionAttributes, 'option_id'> {}

interface WpOptionModel
  extends Model<WpOptionAttributes, WpOptionCreationAttributes>{}


const WpOption = sequelize.define<WpOptionModel>('wp_option', {
    option_id: { 
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    option_name: {
        type: DataTypes.STRING
    },
    option_value: {
        type: DataTypes.TEXT
    },
    autoload: {
        type: DataTypes.STRING
    }
},{
    timestamps: false,
    tableName: 'wp_options'
})

export default WpOption;