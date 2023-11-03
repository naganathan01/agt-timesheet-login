const mysql = require('mysql');
const bcrypt = require("bcryptjs");

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS,
    database: process.env.DATABASE,
});

exports.login = async(req,res) =>{
    try {
        const{email,password} = req.body;
        if(!email || !password){
            return res.status(400).render("login",{
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
    } else {
        // If the user exists, compare passwords
        const passwordMatch = await bcrypt.compare(password, result[0].PASS);
        if (passwordMatch) {
            // Passwords match - login successful
            return res.status(200).redirect("/home");
        } else {
            // Passwords do not match
            return res.status(401).render("login", {
                msg: "Incorrect email or password",
                msg_type: "error",
            });
        }
    }
});


        
    } catch(error){
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
            return res.render('register', { msg: 'Email ID already taken',msg_type:"error" });
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
