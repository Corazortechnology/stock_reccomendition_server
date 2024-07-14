const { user } = require("../Model/user_auth")


async function getUser(req, res) {
    const id = req.user;
  try {
    const isUser = await user.findOne({ _id: id }).select('-password -refresh_token');
    if (!isUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found!!',
      });
    }

    if (isUser.subscription.expires < Date.now()) {
     
      isUser.subscription.plan = 'Free';
      isUser.subscription.expires = Date.now() + 10 * 365.25 * 24 * 60 * 60 * 1000;
      await isUser.save();
    }

    const response = {
      success: true,
      data: isUser,
      message: 'Getting user data success',
    };

    if (req.newAccessToken) {
      response.newAccessToken = req.newAccessToken;
    }

    return res.status(200).json(response);
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
}
 
module.exports = getUser  