const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Canvas = require('../models/Canvas');


/*
// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
    console.log(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
*/

// Create user
router.post('/', async (req, res) => {
  const user = new User(req.body);
  //console.log(req);
  try {
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Login request, return user info if success.
router.post('/login', async (req, res)=>{
  try{
    const user = await User.find({name: req.body.name});
    if (!user) {
      console.log('user not found');
      return res.status(400).json({ message: 'User not found'});
    }
    if (req.body.passwd != user[0].passwd) {
      return res.status(400).json({ message: 'Password incorrect'});
    } 
    res.status(201).json(user[0]);

  } catch(err) {
    res.status(400).json({ message: err.message});
  }
});

// Update user
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndUpdate(id, req.body, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete user (with canvas)
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndDelete(id);
    //const user = await User.findById(id);
    if (!user) {
      console.log(id);
      return res.status(404).json({ message: 'User not found' });
    }

    let user_id = user.id;
    const canvas_list = await Canvas.find({user: user_id});
    for await (const canvas of canvas_list) {
        if (canvas.user.length == 1) {
          await Canvas.findByIdAndDelete(canvas.id)
        } else { 
          await Canvas.findByIdAndUpdate(canvas.id, {user: canvas.user.filter((e)=>e!=user_id)})
        }
    }

    res.status(201).json({});
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;