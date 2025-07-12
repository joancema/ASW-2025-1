export enum RabbitMQ {
  StudentQueue = 'students',
}

export enum StudentMsg {
  CREATE = 'CREATE_STUDENT',
  FIND_ALL = 'FIND_STUDENTS',
  FIND_ONE = 'FIND_STUDENT',
  UPDATE = 'UPDATE_STUDENT',
  DELETE = 'DELETE_STUDENT',
}
