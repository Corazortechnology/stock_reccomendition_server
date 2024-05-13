const csv =require("csvtojson");
const Trade = require("../Model/stock_data");

const dataUpload=async(req,res)=>{
   try{
    const filedata=await csv().fromFile(req.file.path)
    
    for (const record of filedata) {
      
        const existingTrade = await Trade.findOne({ symbol: record.symbol });

        if (existingTrade) {
          for (const key in record) {
            if (record.hasOwnProperty(key)) {
              existingTrade[key] = record[key];
            }
          }

          await existingTrade.save();
          console.log(`Updated trade with symbol ${record.symbol}`);
        } else {
          const newTrade = new Trade(record);
          await newTrade.save();
          console.log(`Added new trade with symbol ${record.symbol}`);
          console.log(newTrade)
        }
      } 

    res.status(200).json({success:true,message:"getting data true"})
   }catch(err){
    res.status(400).json({success:false,message:err.message})
   }
}

module.exports={dataUpload}