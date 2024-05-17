
async function verify(req,res,next){
    const cookie =req.headers.cookies;
    const cookiess= req.headers.cookie
    console.log(cookie ,cookiess)
    next()
}

module.exports = {verify}