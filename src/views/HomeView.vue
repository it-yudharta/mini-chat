<script setup lang="ts">
import { nextTick, onMounted, ref, useTemplateRef } from 'vue'

interface Message{
  id: string
  user_id: string
  message: string
}
const messages = ref<Message[]>([])

onMounted(() => {
  refresh()
})

const isNew = ref(true)
const updateMessage = ref<Message>()

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

  if (isNew.value) {
    const userId = crypto.randomUUID()
    await fetch('api/chats', {
      method: 'POST',
      body: JSON.stringify({
        user_id: userId,
        message: newMessage.value
      })
    })
  } else {
    const msg = updateMessage.value
    await fetch(`api/chats/${msg?.id}`, {
      method: 'PUT',
      body: JSON.stringify({
        user_id: msg?.user_id,
        message: newMessage.value
      })
    })
  }

  await refresh()

  newMessage.value = ''
  nextTick(() => {
    messageInput.value?.focus()
  })
}

const edit = (msg: Message) => {
  updateMessage.value = msg
  newMessage.value = msg.message
  isNew.value = false
}
</script>

<template>
  <main>
    <div>
      <div v-for="msg in messages" :key="msg.id">
        <div>
          {{ msg.message }}
          <button @click="edit(msg)">edit</button>
        </div>
      </div>
    </div>
    <div>
      <form @submit.prevent="sendMessage">
        <input type="text" v-model="newMessage" ref="message-input" placeholder="Ketik pesan..." />
        <input type="submit" :value="isNew ? 'Kirim': 'Update'">
      </form>
    </div>
  </main>
</template>
