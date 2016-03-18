var mandatoryFields  = ['title', 'price', 'sku', 'description'];

const KEY_PREFIX = 'product';
const KEY_SEPARATOR = ':';
const NEXT_PRODUCT_ID = 'next_product_id';

var Product = function (data) {
    this.data = data;
};

Product.prototype.data = {};

Product.prototype.save = function (dataStore, done) {
    return dataStore.saveProduct(this, done);
};

Product.prototype.validate = function () {
    for (var i = 0; i < mandatoryFields.length; i++) {
        if (typeof this.data[mandatoryFields[i]] === 'undefined') {
            return false;
        }
    }
    var isValid = typeof this.data.price === 'number';
    return isValid;
};

module.exports = Product;
