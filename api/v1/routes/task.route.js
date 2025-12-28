const express = require("express");
const router = express.Router();

const {
  index,
  detail,
  changeStatus,
  changeMutil,
  create,
  edit,
  deleteTask,
} = require("../controllers/task.controller");
//[Get] /api/v1/tasks
router.get("/", index);
//[Get] /api/v1/tasks/detail/id
router.get("/detail/:id", detail);

router.patch("/changeStatus/:id", changeStatus);

router.patch("/change-multi", changeMutil);

router.post("/create", create);

router.patch("/edit/:id", edit);

router.delete("/delete/:id", deleteTask);
module.exports = router;
