'use strict';
module.exports = function(app) {
  var license = require('../controllers/scLicenseController');

  // Routes
  app.route('/license')
    .get(license.show_sample_response);

  app.route('/license/:UserName')
    .get(license.check_a_license);
};
