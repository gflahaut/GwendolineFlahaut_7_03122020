const mysql = require("../config/db.config");

exports.createPost = async function createPost(req,newPost) {
  const title = newPost.title;
  const description = newPost.description;
  let imageUrl = null;
  if(newPost.image){
    imageUrl = `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`;
  }
  const postUserId = newPost.postUserId;

  try {
    const query = mysql.request(
      "INSERT INTO posts (`postUserId`,`title`, `description`, `imageUrl` ) VALUES ( ?, ?, ?,?);",
      [postUserId, title, description, imageUrl]
    );
    return query;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

exports.getAllPost = async function getAllPost() {
  try {
    const query = await mysql.request(
      "SELECT p.*,username FROM users u INNER JOIN posts p ON u.userId = p.postuserid ORDER BY date DESC;"
    );
    if (query.length > 0) {
      return query;
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
};

exports.getPostsFromUser = async function getPostsFromUser(userid) {
  try {
    const query = await mysql.request(
      "SELECT * FROM posts WHERE postuserid = ? ORDER BY date DESC;",
      [userid]
    );
    console.log(query);
    return query;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

exports.getOnePost = async function getOnePost(userid) {
  try {
    const query = mysql.request(
      "SELECT * FROM posts WHERE postuserid = ? ORDER BY date DESC LIMIT 1;",
      [userid]
    );
    return query;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

exports.modifyPost = async function modifyPost(post) {
  try {
    let params = [];
    let optionalModifs = "";
    if (post.postTitle.length > 0) {
      optionalModifs += "title = ?,";
      params.push(post.postTitle);
    }
    if (post.postDesc.length > 0) {
      optionalModifs += "description = ?";
      params.push(post.postDesc);
    }
    params.push(post.postId);
    console.log(params);
    const query = mysql.request(
      "UPDATE posts SET " + optionalModifs + " WHERE idposts = ?",
      params
    );
    return query;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

exports.deletePost = async function deletePost(post) {
  try {
    const query = mysql.request("DELETE FROM posts WHERE idposts = ?", [
      post,
    ]);
    return query;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

exports.likePost = async function likePost(post, user, likes) {
  let action = likes.includes(user);
  if (!action) {
    likes = likes.split(",");
    likes.push(user);
    likes = likes.join(",");
    try {
      const query = mysql.request(
        "UPDATE posts SET likes = ? WHERE idposts = ?",
        [likes, post]
      );
      return query;
    } catch (err) {
      throw err;
    }
  } else {
    likes = likes.split(",");
    likes.splice(likes.indexOf(user), 1);
    likes = likes.join(",");
    try {
      const query = mysql.request(
        "UPDATE posts SET likes = ? WHERE idposts = ?",
        [likes, post]
      );
      return query;
    } catch (err) {
      throw err;
    }
  }
};
