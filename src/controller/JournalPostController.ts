import JournalPost from '../model/data/schema/JournalPost';
import CrudFactory from './factory/CrudFactory';
import catchAsync from '../lib/helpers/catch-async';
import User from '../model/data/schema/User';

namespace JournalPostController {
  export const addJournalPost = catchAsync(async (req, res, next) => {
    const caregiver = await User.findById(req.user.id).populate({
      path: 'childRelations',
      populate: { path: 'child' },
    });
    if (!caregiver) {
      return next(new Error('No caregiver found'));
    }
    const { childId, ...post } = req.body;
    const relation = caregiver.childRelations.find(
      relation => relation.child._id === childId,
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

  export const getForChild = catchAsync(async (req, res, next) => {
    const { childId } = req.params;
    const usr = await User.findById(childId).populate({
      path: 'childRelations',
      populate: { path: 'journalPosts' },
    });
    if (!usr) {
      return next(new Error('No caregiver found'));
    }
    const relation = usr.childRelations.find(rel => rel.child._id === childId);
    if (!relation) {
      return next(new Error('No relation found'));
    }
    const journalPosts = relation.journalPosts;
    res.status(200).json({
      status: 'success',
      total: journalPosts.length,
      journalPosts,
    });
  });

  export const createJournalPost = CrudFactory.createOne(JournalPost);
  export const getJournalPost = CrudFactory.getOne(JournalPost);
  export const getAllJournalPosts = CrudFactory.getAll(JournalPost);
  export const updateJournalPost = CrudFactory.updateOne(JournalPost);
  export const deleteJournalPost = CrudFactory.deleteOne(JournalPost);
}
export default JournalPostController;
