
async function verify(req,res,next){
    const cookie =req.headers.cookies;
    console.log(cookie)
}

module.exports = {verify}