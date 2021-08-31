/** source/controllers/posts.ts */
import { Request, Response, NextFunction } from 'express';
import axios, { AxiosResponse } from 'axios';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

interface Post {
    userId: Number;
    id: Number;
    title: String;
    body: String;
}

// getting all posts
const getPosts = async (req: Request, res: Response, next: NextFunction) => {
    // get some posts
    let result: AxiosResponse = await axios.get(`https://jsonplaceholder.typicode.com/posts`);
    let posts: [Post] = result.data;
    return res.status(200).json({
        message: posts
    });
};

// getting a single post
const getPost = async (req: Request, res: Response, next: NextFunction) => {
    // get the post id from the req
    let id: string = req.params.id;
    // get the post
    let result: AxiosResponse = await axios.get(`https://jsonplaceholder.typicode.com/posts/${id}`);
    let post: Post = result.data;
    return res.status(200).json({
        message: post
    });
};

// updating a post
const updatePost = async (req: Request, res: Response, next: NextFunction) => {
    // get the post id from the req.params
    let id: string = req.params.id;
    // get the data from req.body
    let title: string = req.body.title ?? null;
    let body: string = req.body.body ?? null;

    let post_created_date = new Date()
    // email template
    let post_details = {
        'subject': 'Updated the post!',
        'message': 'Updated the post successfully ' + post_created_date.toDateString()
    }

    // update the post
    let response: AxiosResponse = await axios.put(`https://jsonplaceholder.typicode.com/posts/${id}`, {
        ...(title && { title }),
        ...(body && { body })
    });
    
    // sending email if post is updated
    if (response.status == 200) {    
        sendEmail(post_details);
    }
    // return response
    return res.status(200).json({
        message: response.data
    });
};

// deleting a post
const deletePost = async (req: Request, res: Response, next: NextFunction) => {
    // get the post id from req.params
    let id: string = req.params.id;
    let post_created_date = new Date()
    // email template
    let post_details = {
        'subject': 'deleted the post!',
        'message': 'deleted the post successfully ' + post_created_date.toDateString()
    }
    // delete the post
    let response: AxiosResponse = await axios.delete(`https://jsonplaceholder.typicode.com/posts/${id}`);

    
    // sending email if post is deleted
    if (response.status == 200) {    
        sendEmail(post_details);
    }
    // return response
    return res.status(200).json({
        message: 'post deleted successfully'
    });
};

// adding a post
const addPost = async (req: Request, res: Response, next: NextFunction) => {
    // get the data from req.body
    let title: string = req.body.title;
    let body: string = req.body.body;
    let post_created_date = new Date()
    // email template
    let post_details = {
        'subject': 'Created new post!',
        'message': 'New post created successfully ' + post_created_date.toDateString()
    }    
    
    // add the post
    let response: AxiosResponse = await axios.post(`https://jsonplaceholder.typicode.com/posts`, {
        title,
        body
    });
    // sending email if post is created
    if (response.status == 201) {    
        sendEmail(post_details);
    }    

    // return response
    return res.status(200).json({
        message: response.data
    });
};

function sendEmail (data: any) {
    console.log()
    var mailer = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: `${process.env.EMAIL_USERNAME}`,
          pass: `${process.env.EMAIL_PASSWORD}`
        }
      });
    var mailOptions = {
      from: `${process.env.EMAIL_USERNAME}`,
      to: 'justinbeckh@gmail.com',
      subject: data.subject,
      text: data.message
    };

    mailer.sendMail(mailOptions);
}

export default { getPosts, getPost, updatePost, deletePost, addPost };