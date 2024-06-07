const mongoose = require('mongoose');

const tradeSchema = new mongoose.Schema({
  'Date&time of report': { type: String, default: null },
  'market': { type: String, default: null },
  'symbol': { type: String, default: null },
  'buy initiated on': { type: String, default: null },
  'buy price': { type: String, default: null },
  'Signal Time frame': { type: String, default: null },
  '#of periods for maturity': { type: String, default: null },
  "approx % return": { type: String, default: null },
  'Sell Intitiated on': { type: String, default: null },
  'Sell price': { type: String, default: null },
  'Sell TF': { type: String, default: null },
  'Net profit': { type: String, default: null }
});


const hideColSchema = new mongoose.Schema({
  hideCol: [String]
});

const HideCol = mongoose.model('HideCol', hideColSchema);
const Trade = mongoose.model('Trade', tradeSchema);

module.exports = { Trade,HideCol};

