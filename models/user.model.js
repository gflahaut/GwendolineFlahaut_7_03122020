const mysql = require("../config/db.config");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.createUser = async function createUser(newUser) {
  try {
    console.log("user.model", newUser);
    newUser.password = await bcrypt.hash(newUser.password, 10);
    const query = mysql.request(
      "INSERT INTO `users` (`username`, `password`, `name`, `firstname`, `email`) VALUES (?, ? , ? , ?, ? );",
      [
        newUser.username,
        newUser.password,
        newUser.name,
        newUser.firstname,
        newUser.email,
      ]
    );
  } catch (error) {
    console.log(error);
    throw error;
  }
};

exports.compareUser = async function compareUser(user) {
  try {
    
    const token = jwt.sign(
      {
        data: user.id,
      },
      process.env.JWT_KEY,
      { expiresIn: "5h" }
    ); 
    const query = await mysql.request(
      "SELECT * FROM Users WHERE username ='" + user.username + "';"
    );
    console.log(query);
    if (query.length == 0) {
      return { code: 1, message: " Username not found !" };
    }
    let passwordChecked = await bcrypt.compare(
      user.password,
      query[0].password
    );
    if (passwordChecked) {
      return {
        userid: query[0].userId,
        token: token,
        username: query[0].username,
        role: query[0].role,
      };
    } else {
      return { code: 2, message: " Wrong Password ! " };
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

exports.getInfos = async function getInfos(userid) {
  console.log(userid);
  try {
    const query = await mysql.request("SELECT * FROM users WHERE userid = ?;", [
      userid,
    ]);
    if (query.length > 0) {
      return query;
    } else {
      return { code: 1, message: " Found no users matching your search !" };
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

exports.getRole = async function getRole(userid) {
  console.log(userid);
  try {
    const query = await mysql.request(
      "SELECT role FROM users WHERE userid = ?;",
      [userid]
    );
    if (query.length > 0) {
      return query;
    } else {
      return { code: 1, message: " Found no user matching this id !" };
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

exports.getUsersFromSearch = async function getUsersFromSearch(search) {
  try {
    let query = "";
    if (search === search.split(" ")[0]) {
      query = await mysql.request(
        "SELECT * FROM users WHERE username LIKE '" +
          search +
          "%' OR name LIKE '" +
          search +
          "%' OR firstname LIKE '" +
          search +
          "%';"
      );
    } else {
      search = search.split(" ");
      query = await mysql.request(
        "SELECT * FROM users WHERE firstname LIKE '" +
          search[0] +
          "%' && name LIKE '" +
          search[1] +
          "%';"
      );
    }
    console.log(query);
    if (query.length > 0) {
      return query;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

exports.deleteUser = async function deleteUser(user) {
  try {
    const query = mysql.request("DELETE FROM users WHERE userid = ?", [
      user,
    ]);
    return query;
  } catch (err) {
    console.log(err);
    throw err;
  }
};