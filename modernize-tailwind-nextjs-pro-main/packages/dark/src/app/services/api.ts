import { client } from '@/app/libs/apollo-client';
import { gql } from '@apollo/client';

export const userService = {
  async getUsers(page = 1, limit = 10) {
    const query = gql`
      query ListUsers($page: Int!, $limit: Int!) {
        users(options: { paginate: { page: $page, limit: $limit } }) {
          data { id name email username }
          meta { totalCount }
        }
      }
    `;
    const result = await client.query({ query, variables: { page, limit } });
    return result.data.users;
  },

  async createUser(userData: { name: string; username: string; email: string }) {
    const mutation = gql`
      mutation CreateUser($name: String!, $username: String!, $email: String!) {
        createUser(input: { name: $name, username: $username, email: $email }) {
          id
          name
          username
          email
        }
      }
    `;
    const result = await client.mutate({
      mutation,
      variables: {
        name: userData.name,
        username: userData.username,
        email: userData.email,
      },
    });
    return result.data.createUser;
  },
};

export const departmentService = {
  async getDepartments(page = 1, limit = 10) {
    const query = gql`
      query ListDepartments($page: Int!, $limit: Int!) {
        posts(options: { paginate: { page: $page, limit: $limit } }) {
          data { id title body user { id name } }
          meta { totalCount }
        }
      }
    `;
    const result = await client.query({ query, variables: { page, limit } });
    return result.data.posts;
  },

  async createDepartment(deptData: { userId: string; title: string; body: string }) {
    const mutation = gql`
      mutation CreateDepartment($userId: ID!, $title: String!, $body: String!) {
        createPost(input: { userId: $userId, title: $title, body: $body }) {
          id
          title
          body
          user {
            id
            name
          }
        }
      }
    `;
    const result = await client.mutate({
      mutation,
      variables: {
        userId: deptData.userId,
        title: deptData.title,
        body: deptData.body,
      },
    });
    return result.data.createPost;
  },
};
