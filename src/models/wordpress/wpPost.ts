import { DataTypes, Model, Optional  } from "sequelize";
import { sequelize } from './_index';

interface WpPostAttributes {
    ID?: number,
    post_author: number,
    post_title: string,
    post_content: string,
    post_excerpt: string,
    post_status: string,
    guid?: string,
    post_type: string,
    post_name?: string,
    post_date?: Date,
    post_date_gmt?: Date
    post_modified?: Date,
    post_modified_gmt?: Date,
    to_ping?: string,
    pinged?: string,
    post_content_filtered?: string
};

/*
  We have to declare the WpPostCreationAttributes to
  tell Sequelize and TypeScript that the property id,
  in this case, is optional to be passed at creation time
*/
interface WpPostCreationAttributes
  extends Optional<WpPostAttributes, 'ID'> {}

export interface WpPostModel
  extends Model<WpPostAttributes, WpPostCreationAttributes>{
    ID?: number;
    post_author: number;
    post_title: string;
    post_content: string;
    post_excerpt: string;
    post_status: string;
    guid?: string;
    post_type: string;
    post_name?: string;
    post_date?: Date;
    post_date_gmt?: Date
    post_modified?: Date;
    post_modified_gmt?: Date;
    to_ping?: string;
    pinged?: string;
    post_content_filtered?: string
  }


const WpPost = sequelize.define<WpPostModel>('wp_post', {
    ID: { 
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    post_author: {
        type: DataTypes.INTEGER
    },
    post_title: {
        type: DataTypes.STRING,
        defaultValue: 'no post title'
    },
    post_content: {
        type: DataTypes.STRING,
        defaultValue: 'no post content'
    },
    post_excerpt: {
        type: DataTypes.STRING
    },
    post_status: {
        type: DataTypes.STRING
    },
    guid: {
        type: DataTypes.STRING
    },
    post_type: {
        type: DataTypes.STRING
    },
    post_name: {
        type: DataTypes.TEXT
    },
    post_date: {
        type: DataTypes.DATE,
        defaultValue: new Date()
    },
    post_date_gmt: {
        type: DataTypes.DATE
    },
    post_modified: {
        type: DataTypes.DATE,
        defaultValue: new Date()
    },
    post_modified_gmt: {
        type: DataTypes.DATE
    },
    to_ping: {
        type: DataTypes.STRING,
        defaultValue: '111'
    },
    pinged: {
        type: DataTypes.STRING,
        defaultValue: '111'
    },
    post_content_filtered: {
        type: DataTypes.STRING,
        defaultValue: '111'
    }
},{
    timestamps: false,
    tableName: 'wp_posts',
    hooks: {
        beforeCreate: (wpPost) =>{
            let postDate = wpPost.getDataValue('post_date')
            let postModified = wpPost.getDataValue('post_modified')
            wpPost.setDataValue('post_date_gmt', new Date(postDate.getTime() + postDate.getTimezoneOffset()*60000))
            wpPost.setDataValue('post_modified_gmt', new Date(postModified.getTime() + postModified.getTimezoneOffset()*60000))
        },
        afterCreate: async (wpPost) =>{
            wpPost.setDataValue('guid', `http://localhost/?p=${wpPost.getDataValue('ID')}`)
            wpPost.setDataValue('post_name', wpPost.getDataValue('ID'))
            await wpPost.save()
        },
        beforeUpdate: (wpPost) =>{
            let postModified = new Date()
            let postModifiedGmt = new Date(postModified.getTime() + postModified.getTimezoneOffset()*60000)
            wpPost.setDataValue('post_modified', postModified)
            wpPost.setDataValue('post_modified_gmt', postModifiedGmt)
        },
    }
})

export default WpPost;