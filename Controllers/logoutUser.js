async function logoutUser(req, res) {
     // Clear the access-token cookie
    //  res.cookie('access-token', '', {
    //     httpOnly: true,
    //     expires: new Date(0),
    //     sameSite: 'None',
    //     secure: true,
    // });

    // Clear the refresh-token cookie
    // res.cookie('refresh-token', '', {
    //     httpOnly: true,
    //     expires: new Date(0),
    //     sameSite: 'None',
    //     secure: true,
    // });

    res.status(200).json({
        success: true,
        message: 'Logout successfully'
    });
}

module.exports = logoutUser  