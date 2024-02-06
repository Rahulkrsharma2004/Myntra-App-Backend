const mongoose = require('mongoose');

const blacklistTokenSchema =  mongoose.Schema({
  ACCESS_TOKEN: { type: String, required: true },

},{
    versionKey:false
});

const BlacklistToken = mongoose.model('BlacklistToken', blacklistTokenSchema);

module.exports = {BlacklistToken};
