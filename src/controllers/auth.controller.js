const authService = require('../services/auth.service');
const catchAsync = require('../utils/catchAsync');

class AuthController {
  register = catchAsync(async (req, res) => {
    const { token, user } = await authService.register(req.body);
    
    res.status(201).json({
      status: 'success',
      data: { token, user },
    });
  });

  login = catchAsync(async (req, res) => {
    const { email, password } = req.body;
    const { token, user } = await authService.login(email, password);
    
    res.status(200).json({
      status: 'success',
      data: { token, user },
    });
  });

  resetPassword = catchAsync(async (req, res) => {
    const { email, newPassword } = req.body;
    const result = await authService.resetPassword(email, newPassword);
    
    res.status(200).json({
      status: 'success',
      message: result.message,
    });
  });
}

module.exports = new AuthController();