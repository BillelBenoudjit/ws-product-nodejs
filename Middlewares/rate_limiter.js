const moment = require('moment');
const redis = require('redis');

require('dotenv').config()

const redis_client = redis.createClient({
    host: `${process.env.REDIS_ENDPOINT_URI}`,
    port: process.env.REDIS_PORT,
    password: `${process.env.REDIS_PASSWORD}`
});
redis_client.on('error', (error) => console.log(error))
redis_client.on('connect', () => console.log('connected to redis'))

const WINDOW_DURATION_IN_HOURS = 24;
const MAX_WINDOW_REQUEST_COUNT = 10000;
const WINDOW_LOG_DURATION_IN_HOURS = 1;

module.exports = customLimiter = (req, res, next) => {
    try {
        //Checks if the Redis client is present
        if (!redis_client) {
            console.log('Redis client does not exist!');
            process.exit(1);
        }
        //Gets the records of the current user base on the IP address, returns a null if the is no user found
        redis_client.get(req.ip, function (error, record) {
            if (error) throw error;
            const currentTime = moment();
            //When there is no user record then a new record is created for the user and stored in the Redis storage
            let data
            if (record == null) {
                let newRecord = [];
                let requestLog = {
                    requestTimeStamp: currentTime.unix(),
                    requestCount: 1
                };
                newRecord.push(requestLog);
                record = [{ ...requestLog }]
                redis_client.set(req.ip, JSON.stringify(newRecord));
                data = record
                next();
            } else {
                data = JSON.parse(record);
            }
            //When the record is found then its value is parsed and the number of requests the user has made within the last window is calculated
            let windowBeginTimestamp = moment()
                .subtract(WINDOW_DURATION_IN_HOURS, 'hours')
                .unix();
            let requestsinWindow = data?.filter(entry => {
                return entry.requestTimeStamp > windowBeginTimestamp;
            });
            console.log('requestsinWindow', requestsinWindow);
            let totalWindowRequestsCount = requestsinWindow && requestsinWindow.reduce((accumulator, entry) => {
                return accumulator + entry.requestCount;
            }, 0)
            console.log('totalWindowRequestsCount', totalWindowRequestsCount)
            //if maximum number of requests is exceeded then an error is returned
            if (totalWindowRequestsCount >= MAX_WINDOW_REQUEST_COUNT) {
                res
                    .status(429)
                    .json({
                        msg: `You have exceeded the ${MAX_WINDOW_REQUEST_COUNT} requests in ${WINDOW_DURATION_IN_HOURS} hrs limit!`
                    });
            } else {
                //When the number of requests made are less than the maximum the a new entry is logged
                let lastRequestLog = data[data.length - 1];
                let potentialCurrentWindowIntervalStartTimeStamp = currentTime
                    .subtract(WINDOW_LOG_DURATION_IN_HOURS, 'hours')
                    .unix();
                //When the interval has not passed from the last request, then the counter increments
                if (lastRequestLog.requestTimeStamp > potentialCurrentWindowIntervalStartTimeStamp) {
                    lastRequestLog.requestCount++;
                    data[data.length - 1] = lastRequestLog;
                } else {
                    //When the interval has passed, a new entry for current user and timestamp is logged
                    data.push({
                        requestTimeStamp: currentTime.unix(),
                        requestCount: 1
                    });
                }
                redis_client.set(req.ip, JSON.stringify(data));
                next();
            }
        });
    } catch (error) {
        next();
    }
};