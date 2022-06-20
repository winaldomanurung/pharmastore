const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const db = require("../../config").promise();
const { loginSchema } = require("../../helpers/validation-schema");
const { createToken } = require("../../helpers/createToken");
const transporter = require("../../helpers/nodemailer");
// LOGIN
module.exports.login = async (req, res) => {
  // username menampung nilai email dan username
  const { username, password } = req.body;

  try {
    // 1.validation login schema
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    // 2. check if user exist or not
    const CHECK_USER = `SELECT * FROM users WHERE username = ${db.escape(
      username
    )} OR email = ${db.escape(username)};`;
    const [USER] = await db.execute(CHECK_USER);
    if (!USER.length) {
      return res.status(400).send("user is not registered");
    }

    // 3.compare password
    const valid = await bcrypt.compare(password, USER[0].password);
    console.log("is valid : ", valid);
    if (!valid) {
      return res.status(400).send("invalid password.");
    }

    // 4. create JWT token
    const { email, status, id, uid } = USER[0];
    console.log("emailku:", email);
    let token = createToken({ username, email, id });
    console.log("Token:", token);

    // create respond
    delete USER[0].password;
    const respond = USER[0];
    res
      .header("Auth-Token", `Bearer ${token}`)
      .send({ dataLogin: respond, token, message: "Login Success" });
    console.log(USER[0]);
    // res.status(200).send(USER)
  } catch (error) {
    console.log("error:", error);
    return res.status(500).send(error);
  }
};

// KEEP LOGIN
module.exports.keeplogin = async (req, res) => {
  const token = req.header("Auth-Token");
  const id = req.id;
  try {
    const GET_USER = `SELECT * FROM users WHERE id = ?;`;
    const [USER] = await db.execute(GET_USER, [id]);

    // 4. create respond
    delete USER[0].password;
    const respond = USER[0];
    // console.log('mystatus:',USER[0].status)
    res.header("Auth-Token", `Bearer ${token}`).send(USER[0]);
  } catch (error) {
    console.log("error:", error);
    return res.status(500).send(error);
  }
};

// FORGET PASSWORD
module.exports.forgetpassword = async (req, res) => {
  const { emailUser, username } = req.body;
  try {
    // check users
    const CHECK_USER = `SELECT * FROM users WHERE email = ?`;
    const [USER] = await db.execute(CHECK_USER, [emailUser]);
    if (!USER.length) {
      return res.status(400).send("email not registered");
    }

    // user exist
    // bahan membuat token
    const { email, id, uid } = USER[0];
    console.log("emailku:", email);
    let token = createToken({ username, email, id });
    console.log("Token:", token);
    let mail = {
      from: `Admin <zilongbootcamp@gmail.com>`,
      to: `${email}`,
      subject: `Reset Password`,
      html: `<a href='http://localhost:3000/resetpassword/${token}'> Click here to reset your password</a>`,
    };

    transporter.sendMail(mail, (errMail, resmail) => {
      if (errMail) {
        console.log(errMail);
        return res.status(500).send({
          message: "failed",
          success: false,
          err: errMail,
        });
      }
      return res.status(200).send({
        message: "Check your email",
        success: true,
      });
    });
  } catch (error) {
    console.log("error:", error);
    return res.status(500).send(error);
  }
};

// RESET PASSWORD
module.exports.resetpassword = async (req, res) => {
  const { email, password, repassword } = req.body;
  try {
    // 1. verify password & repassword
    if (password !== repassword) {
      return res.status(400).send(`password and re-password doesn't match.`);
    }
    // 2.check email
    const CHECK_USER = `SELECT * FROM users WHERE email = ?`;
    const [USER] = await db.execute(CHECK_USER, [email]);
    if (!USER.length) {
      return res.status(400).send("email not registered");
    }
    const { id } = USER[0];
    // 3. encypt-ing or hash-ing password
    const salt = await bcrypt.genSalt(10);
    console.log("salt : ", salt);

    const hashpassword = await bcrypt.hash(password, salt);
    console.log("plain : ", password);
    console.log("hash: ", hashpassword);
    console.log("id:", id);

    // 4. UPDATE PASSWORD
    const EDIT_USER = `
        UPDATE users SET password= ${db.escape(hashpassword)} WHERE id= ${id}`;
    const [RESULT] = await db.execute(EDIT_USER);

    return res.status(200).send("Reset Password Berhasil");
  } catch (error) {
    console.log("error:", error);
    return res.status(500).send(error);
  }
};
