const router = require('express').Router()
const mongoose = require('mongoose');
const Message = require('../../db/models/Message')
const User = require('../../db/models/User')
const Friend = require('../../db/models/Friend')
const verify = require('../../utils/verifyJWT')
const { messageValidation } = require('../../validation/messageValidation')
const { friendValidation } = require('../../validation/friendValidation')
 
router.post('/send', verify, async (req, res) => {
    const { error } = messageValidation(req.body)
    if (error) return res.status(400).json({ error: error.details[0].message })
    try {
        const message = new Message({
            ...req.body, sender_id: req.user._id
        })
        const savedMessage = await message.save()
        return res.status(201).json(savedMessage)
    } catch {
        return res.status(500).json({error: "Internal Error"})
    }
})

router.get('/fetch', verify, async (req,res)=>{
    const receiver_id = req.query.receiver_id;
    try {
        const messages = await Message.aggregate([
            {
              '$match': {
                '$and': [
                  {
                    'sender_id':  { $in: [new mongoose.Types.ObjectId(req.user._id), new mongoose.Types.ObjectId(receiver_id)]}
                  }, {
                    'receiver_id': { $in: [new mongoose.Types.ObjectId(req.user._id), new mongoose.Types.ObjectId(receiver_id)]}
                  }
                ]
              }
            }
          ])
        return res.status(200).json(messages)
      } catch{
        return res.status(500).json({error: "Internal Error"})
      }
})

router.post('/addFriend', verify, async(req, res) => {
  const { error } = friendValidation(req.body)
    if (error) return res.status(400).json({ error: error.details[0].message })

    try {
      const alreadyFriend = await Friend.findOne({ user_id: new mongoose.Types.ObjectId(req.user._id), friend_id:  new mongoose.Types.ObjectId(req.body.friend_id)})
      if (alreadyFriend)
          return res.status(409).json({error: 'Already Friend' })
      else{
          const friend = new Friend({
              user_id: req.user._id,
              friend_id: req.body.friend_id,
          })
          await friend.save();
          return res.status(201).json({message: 'Friend Added'})
      }
  } catch {
      return res.status(500).json({error: "Internal Error"})
  }
})

router.get('/friends', verify, async(req,res)=>{
  try {
    const users = await Friend.aggregate([
      {
          '$match': {
              'user_id': new mongoose.Types.ObjectId(req.user._id)
          }
      }, {
          '$lookup': {
              'from': 'users', 
              'localField': 'friend_id', 
              'foreignField': '_id', 
              'as': 'user'
          }
      }, {
          '$addFields': {
              'friend': {
                  '$first': '$user'
              }, 
              '_id': '$friend._id', 
              'name': '$friend.name', 
              'email': '$friend.email'
          }
      }, {
          '$addFields': {
              '_id': '$friend._id', 
              'name': '$friend.name', 
              'email': '$friend.email'
          }
      }, {
          '$project': {
              'user_id': 0, 
              'friend_id': 0, 
              '__v': 0, 
              'user': 0, 
              'friend': 0
          }
      }
  ])
    return res.status(200).json(users)
    
    } catch {
        return res.status(500).json({error: "Internal Error"})
    }
})


router.get('/users', verify, async (req, res) => {
    try {
        const users = await User.aggregate(
            [
              {
                '$match': {
                  '_id': {
                    '$ne': new mongoose.Types.ObjectId(req.user._id)
                  }
                }
              }, {
                '$project': {
                  'password': 0, 
                  '__v': 0
                }
              }
            ])
        return res.status(200).json(users)
      } catch{
        return res.status(500).json({error: "Internal Error"})
      }
})



module.exports = router
