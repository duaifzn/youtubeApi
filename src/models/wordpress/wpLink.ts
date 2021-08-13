import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from './_index';

interface WpLinkAttributes {
    link_id: number
    link_url: string
    link_name: string
    link_image: string
    link_target: string
    link_description: string
    link_visible: string
    link_owner: number
    link_rating: number
    link_updated: Date
    link_rel: string
    link_notes: Text
    link_rss: string  
};

/*
  We have to declare the WpLinkCreationAttributes to
  tell Sequelize and TypeScript that the property id,
  in this case, is optional to be passed at creation time
*/
interface WpLinkCreationAttributes
  extends Optional<WpLinkAttributes, 'link_id'> {}

interface WpLinkModel
  extends Model<WpLinkAttributes, WpLinkCreationAttributes>{}


const WpLink = sequelize.define<WpLinkModel>('wp_link', {
    link_id: { 
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    link_url: {
        type: DataTypes.STRING
    },
    link_name: {
        type: DataTypes.STRING
    },
    link_image: {
        type: DataTypes.STRING
    },
    link_target: {
        type: DataTypes.STRING
    },
    link_description: {
        type: DataTypes.STRING
    },
    link_visible: {
        type: DataTypes.STRING
    },
    link_owner: {
        type: DataTypes.INTEGER
    },
    link_rating: {
        type: DataTypes.INTEGER
    },
    link_updated: {
        type: DataTypes.DATE
    },
    link_rel: {
        type: DataTypes.STRING
    },
    link_notes: {
        type: DataTypes.TEXT
    },
    link_rss: {
        type: DataTypes.STRING
    },
},{
    timestamps: false,
    tableName: 'wp_links'
})

export default WpLink;