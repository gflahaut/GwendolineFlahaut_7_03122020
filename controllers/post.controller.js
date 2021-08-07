const express = require('express');
const router = express.Router();
const model = require("../models/posts.model");

function formatDate(timestamp){
  timestamp = new Date(timestamp);
  var d = timestamp.getDate().toString();
  var dd = (d.length === 2) ? d : "0"+d;
  var m = (timestamp.getMonth()+1).toString();
  var mm = (m.length === 2) ? m : "0"+m;     
  return(dd+"/"+mm+ "/" + (timestamp.getFullYear()).toString());
}

exports.createPost = async function createPost(req, res){
  try {
    let newPost = { ...req.body };
    if (!newPost.title) {
      throw "Title Not Found !"
    } else if (!newPost.description) {
      throw"Description Not Found !"
    } else if (!newPost.postUserId) {
     throw "You are not allowed to post !"
    }
    console.log("Ctrl.createPost");
    const createdPost = await model.createPost(req,newPost);
    if(!createdPost){
      throw error;
    }
    res.status(201).json({ message: "Post created successfully !" });
    return newPost;
  } catch (err) {
    console.log(err);
    res.status(400).json({ err });
  }
};

exports.getAllPost = async function getAllPost(req, res){
    try{
      let posts = await model.getAllPost();
      console.log("Ctrl.getAllPost");
      for(let i = 0; i < posts.length; i++){
        posts[i].date = formatDate(posts[i].date);
      }
      res.status(200).json(posts);
    }
    catch(error){
      console.log(error);
      res.status(400).json({ error });
    };
};


exports.getPostsFromUser = async function getPostsFromUser(req, res){
  try {
    let params = { ...req.body };
    console.log("Ctrl.getPostsFromUser");
    console.log(params.userid);
    let posts = await model.getPostsFromUser(params.userid);
    for(let i = 0; i < posts.length; i++){
      posts[i].date = formatDate(posts[i].date);
    }
    res.status(201).json(posts);
  } catch (err) {
    console.log(err);
    res.status(400).json({ err });
  }
};

exports.getOnePost = async function getOnePost (req, res) {
  try {
    let post = { ...req.body };
    console.log('Ctrl.getOnePost');
    await model.getOnePost(post);
    res.status(200).json(post);
  } catch (err) {
    console.log(err);
    res.status(400).json({ err });
  }
};

exports.modifyPost = async function modifyPost (req, res){
  try {
    let post = { ...req.body };
    console.log(post);
    await model.modifyPost(post);
    res.status(200).json(post);
  } catch (err) {
    console.log(err);
    res.status(400).json({ err });
  }
};

exports.deletePost = async function deletePost (req, res){
  try {
    let post = req.params.id ;
    console.log(post);
    await model.deletePost(post);
    res.status(200).json({ message: "Post Delete successfully !" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ err });
  }
};

exports.likePost =  async function likePost(req, res){
  try {
    let post = { ...req.body };
    console.log(post);
    await model.likePost(post.postId, post.userid, post.likes);
    res.status(200).json({ message: "Like successfully !" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ err });
  }
};


