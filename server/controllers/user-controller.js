const User = require('../models/user-model')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const nodemailer = require('nodemailer')
var xoauth2 = require('xoauth2');

sendEmail = async (email, key, req, res) => {
    let testAccount = await nodemailer.createTestAccount();

    let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'weng1043282095@gmail.com', // generated ethereal user
            pass: 'xkrmqnvpiwrohsxh', // generated ethereal password
        },
    })

    host=req.get('host');
    let link = "http://" + host + "/verify?email=" + body.email +"&key=" + key
    transporter.sendMail({
        to: email,
        subject: "verify email",
        text: link
    })
    console.log('email sent')
    return res
        .status(200)
        .send(JSON.stringify({
            status: 'OK'
        }))
}

registerUser = async (req, res) => {
    body = req.body;
    res.setHeader('X-CSE356', '6306cc6d58d8bb3ef7f6b85b');
    if (!body.username || !body.password || !body.email) {
        return res
            .status(400)
            .send(JSON.stringify({
                status: 'ERROR',
                errorMessage: 'invalid fields'
            }))
    }

    const existingEmail = await User.findOne({ email: body.email });
    const existingUser = await User.findOne({ username: body.username });
    if (existingEmail || existingUser) {
        return res
            .status(400)
            .send(JSON.stringify({
                status: 'ERROR',
                errorMessage: 'user exists'
            }))
    }   

    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const passwordHash = await bcrypt.hash(body.password, salt);
    
    const genKey = crypto.generateKeySync('hmac', { length: 128 });
    const key = genKey.export().toString('hex')

    const newUser = new User({
        username: body.username,
        email: body.email,
        password: passwordHash,
        verified: false,
        key: key
    })
    const savedUser = await newUser.save();
    sendEmail(body.email, key, req, res)
}


verifyUser = async (req, res) => {
    res.setHeader('X-CSE356', '6306cc6d58d8bb3ef7f6b85b');
    body = req.query
    if(!body.email){
        return res
            .status(400)
            .send(JSON.stringify({
                status: 'ERROR',
                errorMessage: 'invalid email or user'
            }))
    }

    const user = await User.findOne({ email: body.email });

    if (body.key !== user.key){
        return res
            .status(400)
            .send(JSON.stringify({
                status: 'ERROR'
            }))
    }
    user.verified = true
    user.save()
        .then(() => {
            return res
                .status(200)
                .send(JSON.stringify({
                    status: 'OK'
                }))
        }).catch(error => {
            return res
                .status(400)
                .send(JSON.stringify({
                    status: 'ERROR',
                    errorMessage: error
                }))
        })
}

login = async (req, res) => {
    res.setHeader('X-CSE356', '6306cc6d58d8bb3ef7f6b85b');
    body = req.body

    if (!body.username || ! body.password){
        return res
                .status(400)
                .send(JSON.stringify({
                    status: 'ERROR',
                    errorMessage: 'invalid username or password'
                }))
    }

    const user = await User.findOne({username: "d"})
    if(!user){
        return res
                .status(400)
                .send(JSON.stringify({
                    status: 'ERROR',
                    errorMessage: 'unable to find user'
                }))
    }

    const match = await bcrypt.compare(body.password, user.password);
    if(!match) {
        return res
            .status(400)
            .send(JSON.stringify({
                status: 'ERROR',
                errorMessage: 'incorrect password'
            }))
    }
    console.log(req.session)
    req.session.user = body.username
    return res
        .status(200)
        .send(JSON.stringify({
            status: 'OK'
        }))
}

logout = (req, res) => {
    console.log('logout')
    res.setHeader('X-CSE356', '6306cc6d58d8bb3ef7f6b85b');
    req.session.destroy()
    return res
        .status(200)
        .send(JSON.stringify({
            status: 'OK'
        }))
}

registerPage = (req, res) => {
    res.render('register')
}

loginPage = (req, res) => {
    res.render('login')
}

module.exports = {
    verifyUser,
    registerUser,
    login,
    logout,
    loginPage,
    registerPage
}