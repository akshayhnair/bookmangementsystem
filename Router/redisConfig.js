const redisConfig = {
    host: 'localhost', // Redis host (default: 'localhost')
    port: 6379, // Redis port (default: 6379)
    password: 'your_redis_password', // Redis password (if any)
    db: 0 // Redis database index (default: 0)
};

// const redisCloudURL = 'redis://default:YlNIh0i5T0mdCmJ5Kjk1h6H8sIahr5zf@redis-19535.c274.us-east-1-3.ec2.cloud.redislabs.com:19535';
module.exports = { redisConfig };