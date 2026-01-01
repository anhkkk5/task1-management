const Task = require("../../../models/task.model.js");
const paginationHelper = require("../../../helpers/pagination.js");
const searchHelper = require("../../../helpers/search.js");

// GET /api/v1/tasks
module.exports.index = async (req, res) => {
  console.log(req.query);
  const find = { deleted: false };

  // Tìm kiếm theo từ khóa
  const search = searchHelper(req.query);
  if (search.regex) {
    find.title = { $regex: search.regex };
  }

  if (req.query.status) {
    find.status = req.query.status;
  }
  //sắp xếp theo tiêu chí
  const sort = {};
  const sortKey = req.query.sortkey || req.query.sortKey;
  const sortValueRaw = req.query.sortValue || req.query.sortvalue;
  if (sortKey && sortValueRaw) {
    const normalized = String(sortValueRaw).toLowerCase();
    let sortValue = undefined;
    if (normalized === "asc" || normalized === "1") sortValue = 1;
    if (normalized === "desc" || normalized === "-1") sortValue = -1;
    if (sortValue !== undefined) {
      sort[sortKey] = sortValue;
    }
  }

  // if (req.query.sortKey && req.query.sortValue) {
  //   sort[req.query.sortKey] = req.query.sortValue;
  // }

  //pagination
  const countTasks = await Task.countDocuments(find); // số lượng tasks
  let objPagination = paginationHelper(
    {
      currentPage: 1,
      limitItem: 2,
    },
    req.query,
    countTasks
  );

  //end pagination

  const tasks = await Task.find(find)
    .sort(sort)
    .limit(objPagination.limitItem)
    .skip(objPagination.skip);
  res.json(tasks);
};

// GET /api/v1/tasks/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const id = req.params.id;
    const task = await Task.findOne({ _id: id, deleted: false });
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (error) {
    res.status(400).json({ message: "Invalid task id" });
  }
};

//PATCH /api/v1/tasks/changeStatus/:id
module.exports.changeStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const status = req.body.status;
    await Task.updateOne({
      _id: id,
      status: status,
    });

    res.json({
      code: 200,
      message: "Cập nhập trạng thái thành công",
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Không tồn tại",
    });
  }
};
//PATCH /api/v1/tasks/change-multi
module.exports.changeMutil = async (req, res) => {
  try {
    const { ids, key, value } = req.body;
    console.log(ids);
    console.log(key);
    console.log(value);

    switch (key) {
      case "status":
        await Task.updateMany(
          {
            _id: { $in: ids }, //lấy id trong mảng này
          },
          {
            status: value,
          }
        );
        break;
      case "delete":
        await Task.updateMany(
          {
            _id: { $in: ids }, //lấy id trong mảng này
          },
          {
            deleted: true,
            deletedAt: new Date(),
          }
        );
        res.json({
          code: 200,
          message: "Xóa thành công",
        });
        break;

      default:
        res.json({
          code: 400,
          message: "Không tồn tại",
        });
        break;
    }

    res.json({
      code: 200,
      message: "Cập nhập trạng thái thành công",
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Không tồn tại",
    });
  }
};

//Post /api/v1/tasks/create
module.exports.create = async (req, res) => {
  try {
    req.body.createdBy = req.user.id;
    const task = new Task(req.body);
    const data = await task.save();

    res.json({
      code: 200,
      message: "tạo mới thành công",
      data: data,
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Không tồn tại",
    });
  }
};

//Patch /api/v1/tasks/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;

    await Task.updateOne(
      {
        _id: id,
      },
      req.body
    );

    res.json({
      code: 200,
      message: "update thành công",
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Không tồn tại",
    });
  }
};
//Delete  /api/v1/tasks/delete/:id
module.exports.deleteTask = async (req, res) => {
  try {
    const id = req.params.id;

    await Task.updateOne(
      {
        _id: id,
      },
      {
        deleted: true,
        deletedAt: new Date(),
      }
    );

    res.json({
      code: 200,
      message: "Xóa thành công!",
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Không tồn tại",
    });
  }
};
