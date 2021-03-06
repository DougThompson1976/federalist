const logger = require("winston")
const url = require("url")
const config = require("../../config")

module.exports = {
  redirect: function(req, res) {
    const target = url.resolve(config.app.preview_hostname, req.path)
    res.redirect(target)
  }
}
