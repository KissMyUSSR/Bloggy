import { RequestHandler } from 'express';

import { deleteUser } from 'use-cases/users';

export const deleteUserController: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user.isLoggedIn) {
      return res.status(req.user.err.statusCode).json(req.user.err.message);
    }

    if (!req.body.oldPassword) {
      return res.status(400).json('Old password was not sent');
    }

    const result = await deleteUser(req.user.data.id, req.body.oldPassword);
    if (result.err) return res.status(result.status).json(result.err);

    res.clearCookie('access-token', {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });
    res.clearCookie('refresh-token', {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });

    res.status(200).json({ success: true });
  } catch (err) {
    next(err);
  }
};
