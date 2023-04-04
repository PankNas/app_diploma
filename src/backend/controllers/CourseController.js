import CourseModel from "../models/Course.js";

export const create = async (req, res) => {
  try {
    const doc = new CourseModel({
      title: req.body.title,
      description: req.body.description,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags,
      user: req.userId,
    });

    const course = await doc.save();

    res.json(course);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: 'Не удалось создать курс',
    })
  }
};
