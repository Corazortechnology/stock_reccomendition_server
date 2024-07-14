const jwt = require('jsonwebtoken');
const { user } = require('../Model/user_auth');
const { dataUpload } = require('../Controllers/dataUpload');
require('dotenv').config();

const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const accessToken = authHeader && authHeader.split(' ')[1];
    const refreshToken = req.headers['x-refresh-token'];

    if (!accessToken && !refreshToken) {
        return res.status(401).json({
            success: false,
            message: "unauthorized"
        });
    }

    if (accessToken == "null") {
        console.log("1st")
        try {
            console.log(process.env.REFRESH_KEY+"    dsfn")
            const decodedRefreshToken = jwt.verify(refreshToken, process.env.REFRESH_KEY);
            console.log(decodedRefreshToken)
            const User = await user.findById(decodedRefreshToken.user);
        
            if (!User) {
                return res.status(403).json({
                    success: false, 
                    message: "User not found"
                });
            }

            const newAccessToken = jwt.sign({ user: User._id }, process.env.SECTRT_KEY, { expiresIn: '15m' });
           
            req.newAccessToken = newAccessToken;
            req.user = User._id;
            return next();
        } catch (refreshErr) {
            return res.status(403).json({
                success: false,
                message: "Invalid refresh token"
            }); 
        } 
    } else {
        console.log("2nd")
        try {
            const decodedAccessToken = jwt.verify(accessToken, process.env.SECTRT_KEY);
            const newAccessToken = jwt.sign({ user: decodedAccessToken.user }, process.env.SECTRT_KEY, { expiresIn: '15m' });
                   req.newAccessToken = newAccessToken;
            req.user = decodedAccessToken.user;
            return next();
        } catch (err) {
            if (err.name === 'TokenExpiredError' && refreshToken) {
                try {
                    console.log(process.env.REFRESH_KEY)
                    const decodedRefreshToken = jwt.verify(refreshToken, process.env.REFRESH_KEY);

                    const User = await user.findById(decodedRefreshToken.user);
                 
                    if (!User) {
                        return res.status(403).json({
                            success: false,
                            message: "User not found"
                        });
                    }

                    const newAccessToken = jwt.sign({ user: User._id }, process.env.SECTRT_KEY, { expiresIn: '15m' });
                
                   req.newAccessToken = newAccessToken;
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
