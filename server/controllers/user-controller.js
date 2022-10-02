const User = require('../models/user-model')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const exec = require('child_process').spawn


sendEmail = async (email, key, req, res) => {
    host=req.get('host');
    let link = "http://" + host + "/verify?email=" + encodeURIComponent(email) + "&key=" + key
    console.log(link)
    let commands = ['-c', "echo " + '\"' + link + "\"" + " | mail --encoding=quoted-printable -s \"verify\" " + email] 
    console.log(commands)
    let child = exec('sh', commands)

    console.log('email sent')
    return res
        .status(200)
        .send(JSON.stringify({
            status: 'OK'
        }))
}

registerUser = async (req, res) => {
    const {username, password, email} = req.body;
    res.setHeader('X-CSE356', '6306cc6d58d8bb3ef7f6b85b');
    if (!username || !password || !email) {
        console.log('invalid fields')
        return res
            .status(200)
            .send(JSON.stringify({
                status: 'ERROR',
                errorMessage: 'invalid fields'
            }))
    }

    const existingEmail = await User.findOne({ email: email });
    const existingUser = await User.findOne({ username: username });
    if (existingEmail || existingUser) {
        console.log('exist user')
        return res
            .status(200)
            .send(JSON.stringify({
                status: 'ERROR',
                errorMessage: 'user exists'
            }))
    }   

    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const passwordHash = await bcrypt.hash(password, salt);
    
    const genKey = crypto.generateKeySync('hmac', { length: 128 });
    const key = genKey.export().toString('hex')

    const newUser = new User({
        username: username,
        email: email,
        password: passwordHash,
        verified: false,
        key: key,
        currentGame: null,
        hasGame: false
    })
    const savedUser = await newUser.save();
    console.log('send email')
    sendEmail(email, key, req, res)
}


verifyUser = async (req, res) => {
    res.setHeader('X-CSE356', '6306cc6d58d8bb3ef7f6b85b');
    const {email, key} = req.query
    if(!email){
        return res
            .status(200)
            .send(JSON.stringify({
                status: 'ERROR',
                errorMessage: 'invalid email or user'
            }))
    }
    
    const user = await User.findOne({ email: email });

    if (key !== user.key){
        console.log('not same key')
        return res
            .status(200)
            .send(JSON.stringify({
                status: 'ERROR'
            }))
    }
    user.verified = true
    await user.save()
    console.log('wait')
    return res
        .status(200)
        .json({
            status: 'OK'
        })
}

login = async (req, res) => {
    res.setHeader('X-CSE356', '6306cc6d58d8bb3ef7f6b85b');
    const {username, password} = req.body

    if (!username || !password){
        return res
                .status(200)
                .send(JSON.stringify({
                    status: 'ERROR',
                    errorMessage: 'invalid username or password'
                }))
    }

    const user = await User.findOne({username:username})
    if(!user){
        return res
                .status(200)
                .send(JSON.stringify({
                    status: 'ERROR',
                    errorMessage: 'unable to find user'
                }))
    }

    if(!user.verified){
        return res
                .status(200)
                .send(JSON.stringify({
                    status: 'ERROR',
                    errorMessage: 'unverified'
                }))
    }

    const match = await bcrypt.compare(password, user.password);
    if(!match) {
        return res
            .status(200)
            .send(JSON.stringify({
                status: 'ERROR',
                errorMessage: 'incorrect password'
            }))
    }
    console.log(req.session)
    req.session.user = username
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