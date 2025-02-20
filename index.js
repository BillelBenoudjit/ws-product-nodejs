const express = require('express')
const pg = require('pg')
const cors = require('cors')

require('dotenv').config()

const app = express()
app.use(cors())
// configs come from standard PostgreSQL env vars
// https://www.postgresql.org/docs/9.6/static/libpq-envars.html
const pool = new pg.Pool()

const customLimiter = require('./Middlewares/rate_limiter')

var corsOptions = {
  origin: process.env.ORIGIN,
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

const queryHandler = (req, res, next) => {
  pool.query(req.sqlQuery).then((r) => {
    return res.json(r.rows || [])
  }).catch(next)
}

app.get('/', cors(corsOptions), customLimiter, (req, res) => {
  res.send('Welcome to EQ Works 😎')
})

app.get('/events/hourly', cors(corsOptions), customLimiter, (req, res, next) => {
  req.sqlQuery = `
    SELECT date, hour, events
    FROM public.hourly_events
    ORDER BY date, hour
    LIMIT 168;
  `
  return next()
}, queryHandler)

//For DataTable
app.get('/events/hourly/poi', cors(corsOptions), customLimiter, (req, res, next) => {
  req.sqlQuery = `
    SELECT e.date, e.hour, e.events, p.name
    FROM public.hourly_events e
    INNER JOIN public.poi p ON e.poi_id = p.poi_id 
  `
  return next()
}, queryHandler)

app.get('/events/daily', cors(corsOptions), customLimiter, (req, res, next) => {
  req.sqlQuery = `
    SELECT date, SUM(events) AS events
    FROM public.hourly_events
    GROUP BY date
    ORDER BY date
    LIMIT 7;
  `
  return next()
}, queryHandler)

app.get('/stats/hourly', cors(corsOptions), customLimiter, (req, res, next) => {
  req.sqlQuery = `
    SELECT date, hour, impressions, clicks, revenue
    FROM public.hourly_stats
    ORDER BY date, hour
    LIMIT 168;
  `
  return next()
}, queryHandler)

//For DataTable
app.get('/stats/hourly/poi', cors(corsOptions), customLimiter, (req, res, next) => {
  req.sqlQuery = `
    SELECT s.date, s.hour, s.impressions, s.clicks, s.revenue, p.name 
    FROM public.hourly_stats s
    INNER JOIN public.poi p ON s.poi_id = p.poi_id
    ORDER BY date, hour
    LIMIT 168;
  `
  return next()
}, queryHandler)

app.get('/stats/daily', cors(corsOptions), customLimiter, (req, res, next) => {
  req.sqlQuery = `
    SELECT date,
        SUM(impressions) AS impressions,
        SUM(clicks) AS clicks,
        SUM(revenue) AS revenue
    FROM public.hourly_stats
    GROUP BY date
    ORDER BY date
    LIMIT 7;
  `
  return next()
}, queryHandler)

app.get('/poi', cors(corsOptions), customLimiter, (req, res, next) => {
  req.sqlQuery = `
    SELECT *
    FROM public.poi;
  `
  return next()
}, queryHandler)

app.listen(process.env.PORT || 5555, (err) => {
  if (err) {
    console.error(err)
    process.exit(1)
  } else {
    console.log(`Running on ${process.env.PORT || 5555}`)
  }
})

// last resorts
process.on('uncaughtException', (err) => {
  console.log(`Caught exception: ${err}`)
  process.exit(1)
})
process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason)
  process.exit(1)
})
