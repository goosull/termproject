const mongoose = require('mongoose');

const CanvasSchema = new mongoose.Schema({
  title: String,
  canvas: Object,
  user: Array,
});

const Canvas = mongoose.model('Canvas', CanvasSchema);

module.exports = Canvas;