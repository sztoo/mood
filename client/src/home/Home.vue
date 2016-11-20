<template>
  <div class="wrap">
    <ul>
      <li v-for="word of recognizedWords">
        {{ word }}
      </li>
    </ul>
    <my-emo></my-emo>
  </div>

</template>

<script>
import { text$ } from '../speechToText'
import { socket } from '../socket'
import { MyEmo } from './components/MyEmo.vue'

export default {
  name: 'Home',

  data () {
    return {
      recognizedWords: [],
    }
  },

  components: {
    MyEmo
  },

  subscriptions () {
    return {
      text$: text$
        .do(text => console.log(text))
        .do(text => {
          const prevRecognizedWords = this.recognizedWords
          this.recognizedWords = [text, ...prevRecognizedWords]
        })
        .do(text => {
          socket.send({ type: 'ANALYZE', payload: text })
        }),

      messages$: socket.socketMessages$
        .map(msg => {
          const scores = msg.payload.document_tone.tone_categories
          return scores.map(score => ({
            category: score.category_id,
            scores: score.tones.map(tone => ({ tone: tone.tone_id, score: tone.score })),
          }))[0]
        })
        .do(res => console.log(JSON.parse(JSON.stringify(res))))
    }
  },

}

</script>
