'use strict';
module.exports = function(app) {
  var user = require('../controllers/scUserController');

  // Routes
  app.route('/users')
    .get(user.list_all_users)
    .post(user.create_a_user)
    .delete(user.delete_all_users);

  app.route('/users/:UserName')
    .get(user.get_a_user)
    .delete(user.delete_a_user);
};
