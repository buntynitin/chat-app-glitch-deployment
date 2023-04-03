const router = require('express').Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../../db/models/User')
const { userValidation, loginValidation } = require('../../validation/userValidation')

router.post('/register', async (req, res) => {
    const { error } = userValidation(req.body)
    if (error) return res.status(400).json({ error: error.details[0].message })
    try {    
        const emailExists = await User.findOne({ email: (req.body.email) })
        if (emailExists)
            return res.status(409).json({error: 'Email already registered' })
        else{
            const salt = await bcrypt.genSalt(10)
            const hashPassword = await bcrypt.hash(req.body.password, salt)
            const user = new User({
                name: req.body.name,
                email: req.body.email,
                password: hashPassword,
            })
            await user.save();
            return res.status(201).json({message: 'User Created'})
        }
    } catch {
        return res.status(500).json({error: "Internal Error"})
    }
})

router.post('/login', async (req, res) => {
    const { error } = loginValidation(req.body)
    if (error) return res.status(400).json({ error: error.details[0].message })
    try {
        const user = await User.findOne({ email: (req.body.email) })
        if (!user)
            return res.status(404).json({ error: "Account not found" })

        const validPass = await bcrypt.compare(req.body.password, user.password);
        if (!validPass)
            return res.status(401).json({ error: "Invalid Credentials" })

        const token = jwt.sign({ _id: user._id, name: user.name, email: user.email}, process.env.TOKEN_SECRET)
        return res.status(200).json({ token: token })

    } catch {
        return res.status(500).json({error: "Internal Error"})
    }
})

module.exports = router