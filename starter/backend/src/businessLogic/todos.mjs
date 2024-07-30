import * as uuid from 'uuid'
import { TodoAccess } from '../dataLayer/todoAccess.mjs'
import { getUploadUrl } from '../fileStorage/attachmentUtils.mjs'

const todoAccess = new TodoAccess()

export async function getAllTodos(userId) {
  return todoAccess.getAllTodos(userId)
}

export async function createTodo(createTodoRequest, userId) {
  const todoId = uuid.v4()
  const bucketName = process.env.ATTACHMENTS_S3_BUCKET

  return await todoAccess.createTodo({
    userId: userId,
    todoId: todoId,
    attachmentUrl: `https://${bucketName}.s3.amazonaws.com/${todoId}`,
    createdAt: new Date().getTime().toString(),
    done: false,
    ...createTodoRequest
  })
}

export async function updateTodo(updateTodoRequest, todoId, userId) {
  return await todoAccess.updateTodo(updateTodoRequest, todoId, userId)
}

export async function deleteTodo(todoId, userId) {
  return await todoAccess.deleteTodo(todoId, userId)
}

export async function generateUploadUrl(todoId) {
  return await getUploadUrl(todoId)
}
