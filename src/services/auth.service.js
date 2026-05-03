const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/user.repository');
const AppError = require('../utils/AppError');
const logger = require('../utils/logger');

class AuthService {
  async register(userData) {
    const existingUser = await userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new AppError('User already exists with this email', 400);
    }

    const hashedPassword = await bcrypt.hash(userData.password, 12);
    
    const user = await userRepository.create({
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
      role: 'USER',
    });

    const token = this.generateToken(user.id);
    
    logger.info(`New user registered: ${user.email}`);
    
    return { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
  }

  async login(email, password) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', 401);
    }

    const token = this.generateToken(user.id);
    
    logger.info(`User logged in: ${user.email}`);
    
    return { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
  }

  async resetPassword(email, newPassword) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new AppError('No user found with this email', 404);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await userRepository.updatePassword(email, hashedPassword);
    
    logger.info(`Password reset for user: ${email}`);
    
    return { message: 'Password reset successfully' };
  }

  generateToken(userId) {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
  }
}

module.exports = new AuthService();