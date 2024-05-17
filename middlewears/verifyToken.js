
async function verify(req,res,next){
    const cookie =req.cookies;
    console.log(cookie)
}

module.exports = {verify}