<script setup lang="ts">
import { nextTick, ref, useTemplateRef } from 'vue'

const messageInput = useTemplateRef('message-input');
const newMessage = ref('')

const sendMessage = () => {
  if (newMessage.value.trim() === '') {
    newMessage.value = ''
    return
  }

  console.log(`Kirim Pesan: ${newMessage.value}`)

  newMessage.value = ''
  nextTick(() => {
    messageInput.value?.focus()
  })
}
</script>

<template>
  <main>
    <div>
      isi chat
    </div>
    <div>
      <form @submit.prevent="sendMessage">
        <input type="text" v-model="newMessage" ref="message-input" placeholder="Ketik pesan..." />
        <input type="submit" value="Kirim">
      </form>
    </div>
  </main>
</template>
