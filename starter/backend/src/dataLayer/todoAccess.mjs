import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import AWSXRay from 'aws-xray-sdk-core'

export class TodoAccess {
  constructor(
    documentClient = AWSXRay.captureAWSv3Client(new DynamoDB()),
    todosTable = process.env.TODOS_TABLE
  ) {
    this.documentClient = documentClient
    this.todosTable = todosTable
    this.dynamoDbClient = DynamoDBDocument.from(this.documentClient)
  }

  async getAllTodos(userId) {
    console.log('Getting all todos')

    const result = await this.dynamoDbClient.query({
      TableName: this.todosTable,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
    })

    return result.Items
  }

  async createTodo(todo) {
    console.log(`Creating a todo with id ${todo.id}`)

    await this.dynamoDbClient.put({
      TableName: this.todosTable,
      Item: todo
    })

    return todo
  }

  async updateTodo(todo, todoId, userId) {
    console.log(`Updating a todo with id ${todoId}`)

    const result = await this.dynamoDbClient.update({
      TableName: this.todosTable,
      Key: {
        userId,
        todoId
      },
      UpdateExpression: 'SET name = :name, dueDate = :dueDate, done = :done',
      ExpressionAttributeValues: {
        ':name': todo.name,
        ':dueDate': todo.dueDate,
        ':done': todo.done
      },
      ReturnValues: 'ALL_NEW'
    })

    return result.Attributes
  }

  async deleteTodo(todoId, userId) {
    console.log(`Deleting a todo with id ${todoId}`)

    await this.dynamoDbClient.delete({
      TableName: this.todosTable,
      Key: {
        userId,
        todoId
      }
    })

    return ''
  }
}
