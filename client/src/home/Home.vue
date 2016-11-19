<template>
  <div class="wrap">
    <ul>
      <li v-for="word of recognizedWords">
        {{ word }}
      </li>
    </ul>

  </div>

</template>

<script>
import { text$ } from '../speechToText'

export default {
  data () {
    return {
      recognizedWords: ['bye!'],
    }
  },

  subscriptions () {
    return {
      text$: text$
        .do(text => console.log(text))
        .do(text => {
          const prevRecognizedWords = this.recognizedWords
          this.recognizedWords = [text, ...prevRecognizedWords]
        }),
    }
  },

}

</script>
