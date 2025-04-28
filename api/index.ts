import { Hono } from 'hono'

const app = new Hono<{ Bindings: Env }>()

app.get('/api/chats', async (c) => {
  const { results } = await c.env.CHAT_DB.prepare("SELECT * FROM chats").all()
  return c.json(results)
})

app.post('/api/chats', async (c) => {
  const { user_id, message } = await c.req.json()
  await c.env.CHAT_DB.prepare(`
    INSERT INTO chats(id, user_id, message) VALUES (?, ?, ?)`
  ).bind(crypto.randomUUID(), user_id, message).run()

  return c.json({message: 'ok'})
})

// untuk fallback ke frontend
app.get('*', async (c) => await c.env.ASSETS.fetch(c.req.raw))

export default app
