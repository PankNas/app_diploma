import VideoLessonModel from "../models/VideoLesson.js";
import {throwError} from "../utils/throwError.js";
import {createLesson} from "./LessonsController.js";

export const create = async (req, res) => {
  try {
    const doc = new VideoLessonModel({
      type: req.body.type,
      title: req.body.title,
      desc: req.body.desc,
      videoUrl: req.body.videoUrl,
      course: req.body.course,
    });

    const lesson = await createLesson(doc, VideoLessonModel);

    res.json(lesson);
  } catch (err) {
    throwError(res, err, 500, 'Не удалось создать видеоурок');
  }
};

export const update = async (req, res) => {
  try {
    const lessonId = req.params.id;

    await VideoLessonModel.updateOne(
      {_id: lessonId},
      {
        title: req.body.title,
        desc: req.body.desc,
        videoUrl: req.body.videoUrl,
      }
    );

    res.json({success: true});
  } catch (err) {
    throwError(res, err, 500, 'Не удалось обновить видеоурок');
  }
};
