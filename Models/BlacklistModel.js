const mongoose = require('mongoose');

const blacklistTokenSchema =  new mongoose.Schema({
  ACCESS_TOKEN: { type: String, required: true },

},{
    versionKey:false
});

const BlacklistToken = mongoose.model('blacklistedTokens', blacklistTokenSchema);

module.exports = {BlacklistToken};
