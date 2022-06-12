import JournalPost from '../model/data/schema/JournalPost';
import CrudFactory from './factory/CrudFactory';
import catchAsync from '../lib/helpers/catch-async';
import Caregiver from '../model/data/schema/Caregiver';

namespace JournalPostController {
  export const addJournalPost = catchAsync(async (req, res, next) => {
    const caregiver = await Caregiver.findOne({ user: req.user.id }).populate(
      'childRelations',
    );
    if (!caregiver) {
      return next(new Error('No caregiver found'));
    }
    const { childId, ...post } = req.body;
    const relation = caregiver.childRelations.find(
      relation => relation.child === childId,
    );
    if (!relation) {
      return next(new Error('No relation found'));
    }
    const journalPost = new JournalPost({ ...post, relation });
    await journalPost.save();
    res.status(201).json({
      status: 'success',
      data: journalPost,
    });
  });

  export const createJournalPost = CrudFactory.createOne(JournalPost);
  export const getJournalPost = CrudFactory.getOne(JournalPost);
  export const getAllJournalPosts = CrudFactory.getAll(JournalPost);
  export const updateJournalPost = CrudFactory.updateOne(JournalPost);
  export const deleteJournalPost = CrudFactory.deleteOne(JournalPost);
}
export default JournalPostController;
