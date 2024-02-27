const mongoose = require('mongoose');

const blacklistTokenSchema =  new mongoose.Schema({
  ACCESS_TOKEN: { type: String, required: true },

},{
    versionKey:false
});

const BlacklistToken = mongoose.model('blacklistedToken', blacklistTokenSchema);

module.exports = {BlacklistToken};
