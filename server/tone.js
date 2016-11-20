const watson = require('watson-developer-cloud')

const tone_analyzer = watson.tone_analyzer({
  username: process.env.WATSON_USERNAME,
  password: process.env.WATSON_PASSWORD,
  version: 'v3',
  version_date: '2016-05-19',
})

function analyze(text) {
  return new Promise((resolve, reject) => {
    tone_analyzer.tone({
      text,
    }, (err, tone) => {
      if (err) {
        console.log(err)
        reject(err)
      }
      else
        resolve(tone)
    })
  })
}

module.exports = {
  analyze,
}
