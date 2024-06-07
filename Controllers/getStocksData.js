const { HideCol, Trade } = require("../Model/stock_data")


async function getStockData(req,res){

    const stockData= await Trade.find();
    const {hideCol} =await HideCol.findOne();

    res.status(200).json({
        success:true,
        data:{
            stockData,
            hideCol
        },
        message:"getting data successfull"
    })
}

module.exports =getStockData