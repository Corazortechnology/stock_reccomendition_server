const { user } = require("../Model/user_auth")


async function getUser(req, res) {
    const id = req.user

    try {

        const isUser = await user.findOne({ _id: id }).select("-password -refresh_token");
        if (!isUser) {
           return res.status(404).json({
                success: false,
                message: "user not found!!"   
            }) 
        }

        if(isUser.subscription.expires < Date.now()){
            console.log("expire")
            isUser.subscription.plan = "Free"
            isUser.subscription.expires = Date.now()+10*(365.25 * 24 * 60 * 60 * 1000)
            await isUser.save();
        }

       return res.status(200).json({
            success: true,
            data: isUser,
            message: "getting user data success"
        })

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "server error"  
        })
    }
}

module.exports = getUser  