const mysql = require("../config/db.config");

exports.createMail = async function createMail(newMail) {
  let sender = newMail.from;
  let recipient = newMail.to;
  let subject = newMail.subject;
  let text = newMail.text;
  try {
    const query = mysql.request(
      "INSERT INTO mails (`sender`,`recipient`, `subject, `text` ) VALUES ( ?, ?, ? , ?, );",
      [sender, recipient, subject, text]
    );
    return query;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
