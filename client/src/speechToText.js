import Rx from 'rxjs/Rx'

function initialize(recognitionObject, config) {
  Object.keys(config).forEach(prop => recognitionObject[prop] = config[prop])
  recognitionObject.start()
  return recognitionObject
}

const config = {
  continuous: false,
  interimResults: false,
  lang: 'en-US'
}

const recognition = initialize(new webkitSpeechRecognition(),
                               config)

const recognitionEvents$ = Rx.Observable.fromEvent(recognition, 'result')

const recognitionEnd$ = Rx.Observable.fromEvent(recognition, 'end')
      .do(_ => recognition.start())
      .subscribe(e => console.log('received end'))

const recognitionResults$ = recognitionEvents$
      .do(res => console.log(res))
      .flatMap(event => Array.prototype.map.call(event.results, result => result[0]))

export const text$ = recognitionResults$
  .do(r => console.log(r))
  .filter(result => result.transcript && result.confidence > 0.7)
  .map(result => result.transcript)
