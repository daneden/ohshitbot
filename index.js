require('dotenv').config()

import Twit from 'twit-promise'
import express from 'express'

// Heroku requires a web server, so uh, here you go
const app = express()

app.get('/', function (req, res) {
  res.send('Bleep bloop, bot is running')
})

app.listen(process.env.PORT || 3000)

// genString generated the "Oh shit" string
const genString = () => {
  let eyes = ""
  let heyches = ""

  // Maximum of 15 occurances
  let hOcc = Math.ceil(Math.random() * 15)
  let iOcc = Math.ceil(Math.random() * 15)

  for(let i = 0; i < hOcc; i++) { heyches += "h" }
  for(let i = 0; i < iOcc; i++) { eyes += "i" }

  let s = `O${heyches} sh${eyes}t`

  // 20% chance of SCREAMING
  return Math.random() > .2 ? s : s.toUpperCase()
}

const T = new Twit({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
})

// An array of the topics/keywords we want to track
const topics = [
  'Trump',
]

// Reputable news sources
const users = [
  "reuters",
  "buzzfeednews",
  "nytimes",
  "qz",
  "bbcbreaking",
  "washingtonpost",
  "cnn",
  "cnnbrk",
  "latimes",
  "foreignpolicy",
  "theeconomist",
  "wsj",
]

const stream = T.stream('statuses/filter', {
  track: topics,
})

stream.on('tweet', tweet => {
  const user = tweet.user.screen_name

  // We only want the reputable sources to cause an OH SHIT
  if(users.indexOf(user) === -1) return

  const status = `https://twitter.com/${user}/status/${tweet.id_str}`
  const commentary = genString()

  console.log(commentary, '\n', status)

  T.post('statuses/update', {status: [commentary, status].join('\n')})
    .then( function(result) {
      console.log(`Tweeted "${[commentary, status].join('\n')}"`)
    })
    .catch( err => console.error(err))
})
