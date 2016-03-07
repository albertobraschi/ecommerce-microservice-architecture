var Entity = function (data, redisClient) {
    this.type = null;
    this.data = data;
    this.redisClient = redisClient;
};

Entity.prototype.data = {};

Entity.prototype.save = function (callback) {
    var type = this.type;
    var data = this.data;
    if (typeof type === 'undefined') {
        throw "Invalid entity";
    }
    var redisClient = this.redisClient;
    if (typeof data.id !== 'undefined') {
        // update existing product
        var key = type + ':' + data.id;
        redisClient.hmset(key,
            data, function (err, res) {
                if (err !== null) {
                    throw err;
                }
                callback();
            });
    } else {
        // add new product
        var idCounter = 'next_' + type + '_id';
        redisClient.incr(idCounter, function (err, reply) {
            var entityId = reply;
            var key = type + ':' + entityId;
            redisClient.hmset(key,
                data, function (err, res) {
                    if (err !== null) {
                        throw err;
                    }
                    callback(entityId);
                });
        });
    }
};

Entity.prototype.load = function (callback) {
    var type = this.type;
    var data = this.data;
    if (typeof type === 'undefined') {
        throw "Invalid entity";
    }
    if (typeof data.id !== 'number') {
        throw "Invalid id or id not set";
    }
    var redisClient = this.redisClient;
    var key = type + ':' + this.data.id;
    redisClient.hgetall(key, function (err, res) {
        for (var key in res) {
            data[key] = res[key];
        }
        callback();
    });
};

module.exports = Entity;
