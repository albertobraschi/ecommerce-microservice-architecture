var mandatoryShippingFields  = ['full-name', 'address', 'city', 'postcode', 'country'];

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

Checkout.prototype.validate = function () {
    for (var i = 0; i < mandatoryShippingFields.length; i++) {
        if (typeof this.shipping[mandatoryShippingFields[i]] === 'undefined') {
            return false;
        }
    }
    return true;
};

module.exports = Checkout;
