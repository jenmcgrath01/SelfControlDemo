//SPDX-License-Identifier: Apache-2.0

var firearm = require('./controller.js');

module.exports = function(app){

  app.get('/get_firearm/:id', function(req, res){
    firearm.get_firearm(req, res);
  });
  app.get('/add_firearm/:firearm', function(req, res){
    firearm.add_firearm(req, res);
  });
  app.get('/get_all_firearms', function(req, res){
    firearm.get_all_firearms(req, res);
  });
  app.get('/get_firearm_history/:id', function(req, res){
    firearm.get_firearm_history(req, res);
  });
  app.get('/change_holder/:holder', function(req, res){
    firearm.change_holder(req, res);
  });
  app.get('/get_firearms_by_holder/:holderName', function(req, res){
    firearm.get_firearms_by_holder(req, res);
  });
}
