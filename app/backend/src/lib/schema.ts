import { buildSchema } from 'graphql';

export const schema = buildSchema(`

    type Query {
        getTasks(filter: String): Model
        getTask(id: String!): Model
    }

    type Mutation {
        createTask(task: InputTask!): Model
        updateTask(id: String!, task: InputTask!): Model
    }

    input InputTask {
        task_id: String
        task_text: String
        estimated_end_at: String
        file_id: String
        deadline: Boolean
        task_status: String
    }

    type Status {
        text: String
        value: String
    }

    type OutputTask {
        task_id: String
        task_text: String
        estimated_end_at: String
        file_id: String
        deadline: Boolean
        task_status: Status
    }

    type ValidationError {
        text_short: Boolean
        text_long: Boolean
        estimated_end_at: Boolean
        status_present: Boolean
    }

    type Model {
        tasks: [OutputTask]
        errors: ValidationError
    }

`);