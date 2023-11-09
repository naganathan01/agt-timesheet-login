const mysql = require('mysql');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");


const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS,
    database: process.env.DATABASE,
});



exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).render("login", {
                msg: "Please Enter Your Email And Password",
                msg_type: "error",
            });
        }

        db.query('SELECT * FROM users WHERE email = ?', [email], async (error, result) => {
            if (error) {
                console.error(error);
                return res.status(500).send("An error occurred");
            }

            if (!result || result.length === 0) {
                return res.status(401).render("login", {
                    msg: "Incorrect email or password",
                    msg_type: "error",
                });
            }

            // If the user exists, compare passwords
            const passwordMatch = await bcrypt.compare(password, result[0].PASS);
            if (passwordMatch) {
                // Passwords match - login successful
                const id = result[0].ID;
                const token = jwt.sign({ id: id }, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES_IN,
                });
                console.log("The token is : " + token);
                const cookieOptions = {
                    expires: new Date(
                        Date.now() +
                    process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000, // set expiration time in milliseconds
                    // maxAge: process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000, // set expiration time in milliseconds
                    ),
                    httpOnly: true,
                };
                res.cookie("joes", token, cookieOptions);
                res.status(200).redirect("/home");
            } else {
                
            //     res.cookie("joes", token, cookieOptions);
            //     return res.status(200).redirect("/home");
            // } else {
                // Passwords do not match
                return res.status(401).render("login", {
                    msg: "Incorrect email or password",
                    msg_type: "error",
                });
            }
        });
    } catch (error) {
        console.log(error);
    }
}


exports.register = (req, res) => {
    console.log(req.body);
    const { name, email, password, confirm_password } = req.body;
    console.log(name);
    console.log(email);

    db.query('SELECT email FROM users WHERE email = ?', [email], async (error, results) => {
        if (error) {
            console.log(error);
        }

        if (results.length > 0) {
            return res.render('register', { msg: 'Enter valid Email and passwords',msg_type:"error" });
        } else if (password !== confirm_password) {
            return res.render('register', { msg: "Passwords do not match" ,msg_type:"error"});
        }

        try {
            const hashedPassword = await bcrypt.hash(password, 8);
            // console.log(hashedpassword);

            db.query('INSERT INTO users SET ?', { name: name, email: email, pass: hashedPassword }, (error, result) => {
                if (error) {
                    console.log(error);
                } else {
                    console.log(result);
                    return res.render("register", { msg: "User registration success" ,msg_type:"good"});
                }
            });
        } catch (error) {
            console.log(error);
            return res.render('register', { msg: 'An error occurred during registration',msg_type:"error" });
        }
    });
};

// exports.isLoggedIn = async(req,res,next) =>{
//     // req.name="Check Login......"
//     console.log(req.cookies);
//     next();
        
// }
exports.isLoggedIn = async (req, res, next) => {
    //req.name = "Check Login....";
    //console.log(req.cookies);
    if (req.cookies.joes) {
      try {
        const decode = await promisify(jwt.verify)(
          req.cookies.joes,
          process.env.JWT_SECRET
        );
        //console.log(decode);
        db.query(
          "select * from users where id=?",
          [decode.id],
          (err, results) => {
            //console.log(results);
            if (!results) {
              return next();
            }
            req.user = results[0];
            return next();
          }
        );
      } catch (error) {
        console.log(error);
        return next();
      }
    } else {
      next();
    }
  };
  
exports.logout = async (req, res) => {
res.cookie("joes", "logout", {
    expires: new Date(Date.now() + 2 * 1000),
    httpOnly: true,
});
res.status(200).redirect("/");
};
