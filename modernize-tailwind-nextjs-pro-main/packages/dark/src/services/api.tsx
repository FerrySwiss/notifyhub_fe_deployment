// import { client } from '@/utils/apollo-client'; 
// import { gql } from '@apollo/client';


// interface User {
//   id: string;
//   name: string;
//   email?: string;
//   username?: string;
// }


// interface Reminder {
//   id: string;
//   title: string;
//   completed: boolean;
//   user: User;
// }


// interface PaginatedResponse<T> {
//     data: T[];
//     meta: {
//         totalCount: number;
//     }
// }


// interface CreateReminderInput {
//     title: string;
//     userId: string;
// }


// interface UpdateReminderInput {
//     id: string;
//     title: string;
//     completed: boolean;
// }



// const LIST_REMINDERS_QUERY = gql`
//   query ListReminders($page: Int!, $limit: Int!) {
//     todos(options: { paginate: { page: $page, limit: $limit } }) {
//       data { 
//         id title completed 
//         user { id name email } 
//       }
//       meta { totalCount }
//     }
//   }
// `;


// const CREATE_REMINDER_MUTATION = gql`
//   mutation CreateReminder($title: String!, $completed: Boolean!, $userId: ID!) {
//     createTodo(input: { title: $title, completed: $completed, userId: $userId }) {
//       id title completed user { id name }
//     }
//   }
// `;


// const UPDATE_REMINDER_MUTATION = gql`
//   mutation UpdateReminder($id: ID!, $title: String!, $completed: Boolean!) {
//     updateTodo(id: $id, input: { title: $title, completed: $completed }) {
//       id title completed
//     }
//   }
// `;


// const DELETE_REMINDER_MUTATION = gql`
//   mutation DeleteReminder($id: ID!) {
//     deleteTodo(id: $id)
//   }
// `;



// export const reminderService = {
  
//   async getReminders(page: number = 1, limit: number = 20): Promise<PaginatedResponse<Reminder>> {
//     try {
//       const result = await client.query({ 
//         query: LIST_REMINDERS_QUERY, 
//         variables: { page, limit } 
//       });
//       return result.data.todos as PaginatedResponse<Reminder>;
//     } catch (error) {
//       console.error("Error fetching reminders:", error);
//       throw error;
//     }
//   },

 
//   async createReminder(reminderData: CreateReminderInput): Promise<Reminder> {
//     try {
//       const result = await client.mutate({ 
//         mutation: CREATE_REMINDER_MUTATION, 
//         variables: {
//           title: reminderData.title,
//           completed: false, 
//           userId: reminderData.userId || "1"
//         }
//       });
//       return result.data.createTodo as Reminder;
//     } catch (error) {
//       console.error("Error creating reminder:", error);
//       throw error;
//     }
//   },

  
//   async updateReminder(reminderData: UpdateReminderInput): Promise<Reminder> {
//     try {
//       const result = await client.mutate({
//         mutation: UPDATE_REMINDER_MUTATION,
//         variables: {
//           id: reminderData.id,
//           title: reminderData.title,
//           completed: reminderData.completed
//         }
//       });
//       return result.data.updateTodo as Reminder;
//     } catch (error) {
//       console.error("Error updating reminder:", error);
//       throw error;
//     }
//   },

  
//   async deleteReminder(id: string): Promise<boolean> {
//     try {
//       const result = await client.mutate({
//         mutation: DELETE_REMINDER_MUTATION,
//         variables: { id }
//       });
      
//       return !!result.data.deleteTodo; 
//     } catch (error) {
//       console.error("Error deleting reminder:", error);
//       throw error;
//     }
//   },
// };




// const LIST_USERS_QUERY = gql`
//   query ListUsers($page: Int!, $limit: Int!) {
//     users(options: { paginate: { page: $page, limit: $limit } }) {
//       data { id name email username }
//       meta { totalCount }
//     }
//   }
// `;

// export const userService = {
   
//     async listUsers(page: number = 1, limit: number = 20): Promise<PaginatedResponse<User>> {
//         try {
//             const result = await client.query({ 
//                 query: LIST_USERS_QUERY, 
//                 variables: { page, limit } 
//             });
//             return result.data.users as PaginatedResponse<User>;
//         } catch (error) {
//             console.error("Error listing users:", error);
//             throw error;
//         }
//     }
// };

// // ... continue adding departmentService, domainAuthService, etc.