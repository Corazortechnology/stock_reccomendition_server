const csv = require("csvtojson");
const { Trade, HideCol } = require("../Model/stock_data");

const dataUpload = async (req, res) => {
  try {
    const { data, hideCol } = req.body

    for (const record of data) {

      const existingTrade = await Trade.findOne({ symbol: record.symbol });

      if (existingTrade) {
        for (const key in record) {
          if (record.hasOwnProperty(key)) {
            existingTrade[key] = record[key];
          }
        }

        await existingTrade.save();

      } else {
        const newTrade = new Trade(record);
        await newTrade.save();
      }
    }

    if (hideCol.length !== 0) {
      const existingHideColEntry = await HideCol.findOne();

      if (existingHideColEntry) {
        // Update the existing document
        existingHideColEntry.hideCol = hideCol;
        await existingHideColEntry.save();
      } else {
        // Create a new document if none exists
        await HideCol.create({ hideCol: hideCol });
      }
    }
    
    res.status(200).json({ success: true, message: "Data updating successfully!!" })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
}

module.exports = { dataUpload }