import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Role from '../models/Role.js';

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '90d'
  });
};

const sendResponse = (user, statusCode, res) => {
  const token = signToken(user.id);

  // Remove password from output
  const userJson = user.toJSON();
  delete userJson.password;

  res.status(statusCode).json({
    success: true,
    token,
    data: {
      user: userJson
    }
  });
};

export const register = async (req, res, next) => {
  try {
    const { email, password, role_id } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already in use'
      });
    }

    const newUser = await User.create({
      email,
      password,
      role_id: role_id || 4 // Default to Buyer
    });

    const userWithRole = await User.findByPk(newUser.id, {
      include: [{ model: Role, as: 'role' }]
    });

    sendResponse(userWithRole, 201, res);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    const user = await User.findOne({
      where: { email },
      include: [{ model: Role, as: 'role' }]
    });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect email or password'
      });
    }

    if (user.status === 'banned') {
      return res.status(403).json({
        success: false,
        message: 'Your account has been banned'
      });
    }

    sendResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: [{ model: Role, as: 'role' }]
    });

    sendResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (email) {
      await User.findOne({ where: { email } });
    }

    res.status(200).json({
      success: true,
      message: 'If the email exists, reset instructions have been sent.'
    });
  } catch (error) {
    next(error);
  }
};
