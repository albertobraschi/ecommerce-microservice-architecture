var Checkout = function (cart) {
    this.cart = cart;
};

Checkout.prototype.data = {};

Checkout.prototype.save = function (dataStore, done) {
    return dataStore.saveCheckout(this, done);
};

module.exports = Checkout;
