const payments = require('payments');

var methodsEnabled = [ 'yakassa',  'webmoney', 'yandexmoney', 'paypal','interkassa', 'banksimple', 'banksimpleua'];

module.exports = function*() {

  var paymentMethods = {};

  methodsEnabled.forEach(function(key) {
    paymentMethods[key] = payments.methods[key].info;
  });

  /*
  if (this.user && this.user.isAdmin) {
    paymentMethods.yakassa = payments.methods.yakassa.info;
  }*/

  return paymentMethods;
};
