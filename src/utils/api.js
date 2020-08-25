import fetch from 'cross-fetch'
import utils from './utils'
const ASTRA_DB_USERNAME = process.env.ASTRA_DB_USERNAME
const ASTRA_DB_PASSWORD = process.env.ASTRA_DB_PASSWORD
const ASTRA_DB_KEYSPACE = process.env.ASTRA_DB_KEYSPACE
const API_ENDPOINT = `/api/rest/v1`
const TABLE_NAME = process.env.TABLE_NAME || 'jamstack_todos'

export const getAuthToken = async () => {
  return await fetch(`${API_ENDPOINT}/auth`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      username: ASTRA_DB_USERNAME,
      password: ASTRA_DB_PASSWORD,
    }),
  }).then(res => res.json())
}

export const deleteTodo = async (todo) => {
  const { authToken } = await getAuthToken()
  return await fetch(`${API_ENDPOINT}/keyspaces/${ASTRA_DB_KEYSPACE}/tables/${TABLE_NAME}/rows/${todo.list_id};${todo.id}`, {
    method: 'DELETE',
    headers: {
      'x-cassandra-token': authToken,
    }
  })
}

export const getTodos = async (sessionId) => {
  const { authToken } = await getAuthToken()
  return await fetch(`${API_ENDPOINT}/keyspaces/${ASTRA_DB_KEYSPACE}/tables/${TABLE_NAME}/rows/${sessionId}`, {
    headers: {
      'x-cassandra-token': authToken,
    }
  }).then(res => res.json())
}

export const createTodo = async (todo, sessionId) => {
  const { authToken } = await getAuthToken()
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
  return await fetch(`${API_ENDPOINT}/keyspaces/${ASTRA_DB_KEYSPACE}/tables/${TABLE_NAME}/rows`, {
    method: 'POST',
    headers: {
      'x-cassandra-token': authToken
    },
    body: JSON.stringify(columns)
  })
}
