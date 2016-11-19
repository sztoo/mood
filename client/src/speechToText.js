import Rx from 'rxjs/Rx'

function initialize(recognitionObject, config) {
  Object.keys(config).forEach(prop => recognitionObject[prop] = config[prop])
  recognitionObject.start()
  return recognitionObject
}

const config = {
  continuous: true,
  interimResults: true,
}

const recognition = initialize(new webkitSpeechRecognition(),
                               config)

const recognitionEvents$ = Rx.Observable.fromEvent(recognition, 'result')

// here we map stream of speech recognition events into a stream of results, each
// of which has text and confidence level
const recognitionResults$ = recognitionEvents$
  // Array.prototype.map.call is required because event.results is an array-like object
  // flatMap flattens those arrays
  // try chaining .do with console.log to see what those events are
  .flatMap(event => Array.prototype.map.call(event.results, result => result[0]))

// here we filter down our results by the confidence level
// and then map them into plain text
export const text$ = recognitionResults$
  // here we log our results to console
  .do(r => console.log(r))
  // get only the results with high enough confidence
  .filter(result => result.transcript && result.confidence > 0.5)
  // and grab the transcripts
  .map(result => result.transcript)
