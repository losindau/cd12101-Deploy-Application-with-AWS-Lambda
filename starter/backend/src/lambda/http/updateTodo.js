import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { updateTodo } from '../../businessLogic/todos.mjs'
import { getUserId } from '../utils.mjs'

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      origin: '*',
      credentials: true
    })
  )
  .handler(async (event) => {
    console.log('Processing event: ', event)

    const userId = getUserId(event)
    const todoId = event.pathParameters.todoId
    const updatedTodo = JSON.parse(event.body)
    const result = await updateTodo(updatedTodo, todoId, userId)

    return {
      statusCode: 201,
      body: JSON.stringify({
        item: result
      })
    }
  })
