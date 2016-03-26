var Checkout = function (cart, shipping) {
    if (typeof cart !== 'undefined') {
        this.cart = cart;
    }
    if (typeof shipping !== 'undefined') {
        this.shipping = shipping;
    }
};

Checkout.prototype.cart = {};
Checkout.prototype.shipping = {};

Checkout.prototype.save = function (dataStore, done) {
    return dataStore.saveCheckout(this, done);
};

Checkout.prototype.setShipping = function (shipping) {
    this.shipping = shipping;
}

module.exports = Checkout;
