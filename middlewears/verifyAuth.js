const jwt = require('jsonwebtoken');
const { user } = require('../Model/user_auth');
require('dotenv').config();

const authenticateToken = async (req, res, next) => {
    const accessToken = req.cookies['access-token'];
    const refreshToken = req.cookies['refresh-token'];

    if (!accessToken && !refreshToken) {
        return res.status(401).json({
            success: false,
            message: "unauthorized"
        });
    }

    if (!accessToken) {
        try {
            const decodedRefreshToken = jwt.verify(refreshToken, process.env.REFRESH_KEY);
            const User = await user.findById(decodedRefreshToken.user);
            
            if (!User) {
                return res.status(403).json({
                    success: false, 
                    message: "User not found"
                });
            }

            const newAccessToken = jwt.sign({ user: User._id }, process.env.SECTRT_KEY, { expiresIn: '15m' });
            res.cookie('access-token', newAccessToken, {
                httpOnly: true,
                expires: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
                secure: true,
            });

            req.user = User._id;
            return next();
        } catch (refreshErr) {
            return res.status(403).json({
                success: false,
                message: "Invalid refresh token"
            });
        }
    } else {
        try {
            const decodedAccessToken = jwt.verify(accessToken, process.env.SECTRT_KEY);
            req.user = decodedAccessToken.user;
            return next();
        } catch (err) {
            if (err.name === 'TokenExpiredError' && refreshToken) {
                try {
                    const decodedRefreshToken = jwt.verify(refreshToken, process.env.REFRESH_KEY);
                    const User = await user.findById(decodedRefreshToken.user);

                    if (!User) {
                        return res.status(403).json({
                            success: false,
                            message: "User not found"
                        });
                    }

                    const newAccessToken = jwt.sign({ user: User._id }, process.env.SECTRT_KEY, { expiresIn: '15m' });
                    res.cookie('access-token', newAccessToken, {
                        httpOnly: true,
                        expires: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
                        secure: true,
                    });

                    req.user = User._id;
                    return next();
                } catch (refreshErr) {
                    return res.status(403).json({
                        success: false,
                        message: "Invalid refresh token"
                    });
                }
            }

            return res.status(403).json({
                success: false,
                message: "Invalid access token"
            });
        }
    }
};

module.exports = authenticateToken;
