import utils from './utils'

export const deleteTodos = async (todo) => {
  const response = await fetch('/.netlify/functions/deleteTodos', {
    body: JSON.stringify({todo}),
    method: 'POST'
  })
  return response.json()
}

export const getTodos = async (sessionId) => {
  const response = await fetch(`/.netlify/functions/getTodos/${sessionId}`)
  return response.json()
}

export const createTodo = async (todo, sessionId) => {
  if (!todo.id) {
    todo.id = utils.uuid()
  }
  todo['list_id'] = sessionId

  const columns = {
    columns: Object.keys(todo).map(i => {
      return {
        name: i,
        value: todo[i]
      }
    })
  }
  const response = await fetch('/.netlify/functions/createTodo', {
    body: JSON.stringify(columns),
    method: 'POST'
  })
  return response.json()
}
