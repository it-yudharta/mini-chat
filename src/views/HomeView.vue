<script setup lang="ts">
import { nextTick, onMounted, ref, useTemplateRef } from 'vue'

const messages = ref([])

onMounted(() => {
  refresh()
})

const messageInput = useTemplateRef('message-input');
const newMessage = ref('')

const refresh = async () => {
  const req = await fetch('api/chats')
  const data = await req.json()
  messages.value = data
}

const sendMessage = async () => {
  if (newMessage.value.trim() === '') {
    newMessage.value = ''
    return
  }

  const userId = crypto.randomUUID()
  await fetch('api/chats', {method: 'POST', body: JSON.stringify({user_id: userId, message: newMessage.value})})
  await refresh()

  newMessage.value = ''
  nextTick(() => {
    messageInput.value?.focus()
  })
}
</script>

<template>
  <main>
    <div>
      <li v-for="message in messages" :key="message">
        {{ message }}
      </li>
    </div>
    <div>
      <form @submit.prevent="sendMessage">
        <input type="text" v-model="newMessage" ref="message-input" placeholder="Ketik pesan..." />
        <input type="submit" value="Kirim">
      </form>
    </div>
  </main>
</template>
