let express = require('express');
let router = express.Router()
let userController = require('../controllers/users')
let bcrypt = require('bcrypt');
const { CheckLogin } = require('../utils/authHandler');
let jwt = require('jsonwebtoken')
let fs = require('fs')
let path = require('path')
const { ChangePasswordValidator, validatedResult } = require('../utils/validator')

// Load private and public keys
const privateKey = fs.readFileSync(path.join(__dirname, '../privateKey.pem'), 'utf8');
const publicKey = fs.readFileSync(path.join(__dirname, '../publicKey.pem'), 'utf8');

router.post('/register', async function (req, res, next) {
    try {
        let { username, password, email } = req.body;
        let newUser = await userController.CreateAnUser(username, password, email,
            "69b1265c33c5468d1c85aad8"
        )
        res.send(newUser)
    } catch (error) {
        res.status(404).send({
            message: error.message
        })
    }
})

router.post('/login', async function (req, res, next) {
    try {
        let { username, password } = req.body;
        let user = await userController.GetAnUserByUsername(username);
        if (!user) {
            res.status(404).send({
                message: "thong tin dang nhap khong dung"
            })
            return;
        }
        if (user.lockTime > Date.now()) {
            res.status(404).send({
                message: "ban dang bi ban"
            })
            return;
        }
        if (bcrypt.compareSync(password, user.password)) {
            user.loginCount = 0;
            await user.save()
            // Use RS256 (RSA) algorithm with private key
            let token = jwt.sign({
                id: user._id
            }, privateKey, {
                algorithm: 'RS256',
                expiresIn: '1d'
            })
            res.send({ token, message: "dang nhap thanh cong" })
        } else {
            user.loginCount++;
            if (user.loginCount == 3) {
                user.loginCount = 0;
                user.lockTime = Date.now() + 3600 * 1000;
            }
            await user.save()
            res.status(404).send({
                message: "thong tin dang nhap khong dung"
            })
        }
    } catch (error) {
        res.status(404).send({
            message: error.message
        })
    }
})

router.post('/changePassword', ChangePasswordValidator, validatedResult, CheckLogin, async function (req, res, next) {
    try {
        let { oldPassword, newPassword } = req.body;
        let userId = req.user._id;
        
        // Get user from database
        let user = await userController.GetAnUserById(userId);
        if (!user) {
            res.status(404).send({
                message: "nguoi dung khong ton tai"
            })
            return;
        }
        
        // Verify old password
        if (!bcrypt.compareSync(oldPassword, user.password)) {
            res.status(404).send({
                message: "mat khau cu khong chinh xac"
            })
            return;
        }
        
        // Check if new password is same as old password
        if (bcrypt.compareSync(newPassword, user.password)) {
            res.status(404).send({
                message: "mat khau moi khong duoc giong mat khau cu"
            })
            return;
        }
        
        // Hash new password and update
        let hashedPassword = await bcrypt.hash(newPassword, 10);
        await userController.UpdateUserPassword(userId, hashedPassword);
        
        res.send({
            message: "doi mat khau thanh cong"
        })
    } catch (error) {
        res.status(404).send({
            message: error.message
        })
    }
})

router.get('/me', CheckLogin, function (req, res, next) {
    res.send(req.user)
})
module.exports = router