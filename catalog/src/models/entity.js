var Entity = function (data, redisClient) {
    this.type = null;
    this.data = data;
    this.redisClient = redisClient;
};

Entity.prototype.data = {};

Entity.prototype.save = function (callback) {
    if (this.type === null) {
        throw "Invalid entity";
    }
    var idCounter = 'next_' + this.type + '_id';
    var redisClient = this.redisClient;
    this.redisClient.incr(idCounter, function (err, reply) {
        var entityId = reply;
        var key = this.type + ':' + entityId;
        redisClient.hmset(key,
            this.data, function (err, res) {
                callback(entityId);
            });
    });
};

module.exports = Entity;
