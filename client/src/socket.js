import Rx from 'rxjs/Rx'

class Socket {
  constructor({ address }) {
    this.address = address
    this.socket = new WebSocket(address)
    this.socket.binaryType = 'arraybuffer'
  }

  send (msg) {
    return Promise.resolve(this.socket.send(JSON.stringify(msg)))
  }

  close () {
    return Promise.resolve(this.socket.close())
  }

  get _source () {
    return this.socket
  }

  get socketMessages$ () {
    return Rx.Observable.fromEvent(this._source, 'message')
      .map(event => JSON.parse(event.data))
  }

  get socketOpen$ () {
    return Rx.Observable.fromEvent(this._source, 'open')
  }
}

export const socket = new Socket({ address: `ws://${window.location.hostname}:8081` })
