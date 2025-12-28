const express = require("express");
const router = express.Router();

const Task = require(`../../../models/task.model`);

router.get("/", async (req, res) => {
  // viết controller
  const tasks = await Task.find({
    deleted: false,
  });
  console.log(tasks);
  res.json(tasks); // trả về 1 mảng data json sever
});

router.get("/detail/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const task = await Task.findOne({
      _id: id,
      deleted: false,
    });
    res.json(task);
  } catch (error) {
    res.json("Không tìm thấy");
  }
});

module.exports = router;
