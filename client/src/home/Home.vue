<template>
  <div class="wrap">
    <ul>
      <li v-for="word of recognizedWords">
        {{ word }}
      </li>
    </ul>
    <div>{{ scores }}</div>
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
      scores: {
        anger: 0,
        disgust: 0,
        fear: 0,
        joy: 0,
        sadness: 0,
      },
    }
  },

  computed: {
    background () {
      const scores = this.scores

      const orderedScores = Object.keys(scores).map(emotion => [emotion, scores[emotion]])
            .sort(([e1, s1], [e2, s2]) => s2 - s1)

      const [colorLeft, colorRight] = orderedScores.slice(0,2).map(pair => this.colors[pair[0]])

      return {
        background: `linear-gradient(to right, ${colorLeft}, ${colorRight})`,
      }
    },

    colors() {
      return {
        anger: `hsla(353, ${this.scores.anger * 100}%, 43%, 1)`,
        disgust: `hsla(11, ${this.scores.disgust * 100}%, 59%, 1)`,
        fear: `hsla(48, ${this.scores.fear * 100}%, 56%, 1)`,
        joy: `hsla(137, ${this.scores.joy * 100}%, 41%, 1)`,
        sadness: `hsla(228, ${this.scores.sadness * 100}%, 40%, 1)`,
      }
    },

  },

  components: {
    MyEmo
  },

  subscriptions () {
    return {
      text$: text$
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
        .map(
          result => result.scores.reduce((acc, curr) => {
            const key = curr.tone
            const val = curr.score
            acc[key] = val
            return acc
          }, {})
        )
        .do(res => this.scores = res)
    }
  },

}

</script>


<style>
.wrap {
  height: 100vh;
  width: 100vw;
}

</style>
