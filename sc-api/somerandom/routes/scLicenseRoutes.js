'use strict';
module.exports = function(app) {
  var somerandom = require('../controllers/scLicenseController');

  // Routes
  app.route('/somerandom')
    .get(somerandom.show_sample_response);

  app.route('/somerandom/:UserName')
    .get(somerandom.check_a_license);
};
