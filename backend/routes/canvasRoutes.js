const express = require('express');
const router = express.Router();
const Canvas = require('../models/Canvas');

// Get all canvas (of user)
router.get('/', async (req, res) => {
    const login_user = req.query.user;
    try {
        const canvas = (login_user != null) ? await Canvas.find({user: login_user}) : [];
        res.json(canvas);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//Get canvas by id
router.get('/:id', async (req, res) => {
    const {id} = req.params;
    try {
        const canvas = await Canvas.findById(id);
        if (!canvas) {
            return res.status(404).json({message: 'conavs not found'});
        }
        res.json(canvas);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

router.get('/thumb/:id', async(req, res)=>{
    const {id} = req.params;
    try {
        const canvas = await Canvas.findById(id);
        if (!canvas) {
            return res.status(404).json({message: 'conavs not found'});
        }
        res.json(canvas.thumb);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
})

// Save new canvas
router.post('/', async (req, res) => {
    const canvas = new Canvas(req.body);
    //console.log(req);
    try {
        await canvas.save();
        res.status(201).json(canvas);
    } catch (err) {
        res.status(400).json({ message: err.message});
    }
})

// Update canvas
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const canvas = await Canvas.findByIdAndUpdate(id, req.body, { new: false });
    if (!canvas) {
      return res.status(404).json({ message: 'Canvas not found' });
    }
    res.json(canvas);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/share/:id/', async (req, res)=>{
    const {id} = req.params;
    const name = req.body.name
    try {
        const old_canvas = await Canvas.findById(id);
        const new_canvas = await Canvas.findByIdAndUpdate(id, {user: [...old_canvas.user, name]}, { new: false });
        if (!new_canvas) {
        return res.status(404).json({ message: 'Canvas not found' });
        }
        res.json(new_canvas);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
})

// Delete canvas
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const canvas = await Canvas.findByIdAndDelete(id);
        if (!canvas) {
            return res.status(404).json({message: 'Canvas not found'});
        }
        res.sendStatus(204);
    } catch (err) {
        res.status(400).json({message: err.message});
    }
})

module.exports = router;