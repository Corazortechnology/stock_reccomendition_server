const express = require("express");
const mongodb=require("./config/database")
const cors = require("cors")
require("dotenv").config()
const auth = require("./routes/auth/authentication")
const uploads = require("./routes/admin/uploads/dataUploads.js");
const path=require("path")
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const app = express();

mongodb();

app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static(path.resolve(__dirname,"public")))

app.use(cors({
    origin: 'https://new-stock-reccomendition.vercel.app',
    credentials: true
  }));
app.use(express.json())
app.use(cookieParser())

app.use("/api/v1/auth", auth);
app.use("/api/v1/admin", uploads);

try {
    app.listen(process.env.PORT, () => {
        console.log("server is running in port : ", process.env.PORT)
    })
}
catch (err) {
    console.log(err);
}
