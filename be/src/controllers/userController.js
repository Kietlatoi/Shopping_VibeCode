export const getMe = async (req, res, next) => {
  try {
    const userJson = req.user.toJSON();
    delete userJson.password;

    res.status(200).json({
      success: true,
      data: userJson
    });
  } catch (error) {
    next(error);
  }
};

export const updateMe = async (req, res, next) => {
  try {
    const allowedFields = ['email'];
    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    await req.user.update(updates);
    const userJson = req.user.toJSON();
    delete userJson.password;

    res.status(200).json({
      success: true,
      data: userJson
    });
  } catch (error) {
    next(error);
  }
};
