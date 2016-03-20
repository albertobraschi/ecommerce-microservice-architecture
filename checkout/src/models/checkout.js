var Checkout = function (data) {
    this.data = data;
};

Checkout.prototype.data = {};

Checkout.prototype.save = function (dataStore, done) {
    return dataStore.saveCheckout(this, done);
};

module.exports = Checkout;
