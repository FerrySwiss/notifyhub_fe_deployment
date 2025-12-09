import { client } from '@/app/libs/apollo-client';
import { gql } from '@apollo/client';
import { Reminder } from '@/types/apps/invoice';

// ---------- BASE CONFIG ----------
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

const OAUTH_CLIENT_ID = process.env.NEXT_PUBLIC_OAUTH_CLIENT_ID || '';
const OAUTH_CLIENT_SECRET = process.env.NEXT_PUBLIC_OAUTH_CLIENT_SECRET || '';
const SHOULD_SEND_CLIENT_SECRET =
  !!OAUTH_CLIENT_SECRET && !OAUTH_CLIENT_SECRET.startsWith('pbkdf2_');

const ensureOAuthEnv = () => {
  if (!OAUTH_CLIENT_ID) {
    throw new Error('OAuth client env vars missing. Set NEXT_PUBLIC_OAUTH_CLIENT_ID.');
  }
};

async function handleJsonResponse(resp: Response) {
  const data = await resp.json().catch(() => ({}));
  if (!resp.ok) {
    const message = data.message || data.error || 'Request failed';
    throw new Error(message);
  }
  return data;
}

// ---------- AUTH SERVICE ----------
export const authService = {
  async signup(payload: { username: string; email: string; password: string }) {
    const resp = await fetch(`${API_BASE_URL}/signup/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return handleJsonResponse(resp);
  },

  async loginPassword(username: string, password: string) {
    const resp = await fetch(`${API_BASE_URL}/login/password/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    return handleJsonResponse(resp);
  },

  async verifyTotp(challengeId: string, totpCode: string) {
    const resp = await fetch(`${API_BASE_URL}/mfa/verify/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mfa_challenge_id: challengeId, totp_code: totpCode }),
    });
    return handleJsonResponse(resp);
  },

  async fetchAccessToken(params: {
    username: string;
    password: string;
    mfaToken?: string;
  }) {
    ensureOAuthEnv();

    const body = new URLSearchParams({
      grant_type: 'password',
      username: params.username,
      password: params.password,
      client_id: OAUTH_CLIENT_ID,
    });

    if (SHOULD_SEND_CLIENT_SECRET) body.append('client_secret', OAUTH_CLIENT_SECRET);
    if (params.mfaToken) body.append('mfa_token', params.mfaToken);

    const resp = await fetch(`${API_BASE_URL}/o/token/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });

    return handleJsonResponse(resp);
  },

  async confirmMfa(code: string, accessToken: string) {
    const resp = await fetch(`${API_BASE_URL}/mfa/confirm/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ code }),
    });
    return handleJsonResponse(resp);
  },
};

// ---------- GRAPHQL SERVICES ----------
interface CreateReminderInput {
  title: string;
  description?: string;
  senderEmail: string;
  senderName?: string;
  receiverEmail: string;
  intervalType?: string;
  reminderStartDate?: string;
  reminderEndDate?: string;
  phoneNo?: string;
  active?: boolean;
}

interface UpdateReminderInput extends Partial<CreateReminderInput> {
  id: string;
  send?: boolean;
  completed?: boolean;
}

interface CreateDepartmentInput {
  name: string;
}

interface UpdateDepartmentInput {
  id: string;
  name?: string;
}

type UpdateDepartmentMutationResult = {
  updateDepartment: { ok: boolean; department: { id: string; name: string } };
};

const LIST_REMINDERS_QUERY = gql`
  query Reminders($active: Boolean) {
    reminders(active: $active) {
      id
      title
      description
      reminderStartDate
      reminderEndDate
      active
    }
  }
`;

const GET_REMINDER_BY_ID_QUERY = gql`
  query Reminder($id: ID!) {
    reminder(id: $id) {
      id
      title
      description
      senderEmail
      receiverEmail
      intervalType
      reminderStartDate
      reminderEndDate
      active
    }
  }
`;

const CREATE_REMINDER_MUTATION = gql`
  mutation CreateReminder(
    $title: String!
    $description: String
    $senderEmail: String!
    $senderName: String
    $receiverEmail: String!
    $intervalType: String
    $reminderStartDate: DateTime
    $reminderEndDate: DateTime
    $phoneNo: String
    $active: Boolean
  ) {
    createReminder(
      title: $title
      description: $description
      senderEmail: $senderEmail
      senderName: $senderName
      receiverEmail: $receiverEmail
      intervalType: $intervalType
      reminderStartDate: $reminderStartDate
      reminderEndDate: $reminderEndDate
      phoneNo: $phoneNo
      active: $active
    ) {
      ok
      reminder {
        id
        title
        active
      }
    }
  }
`;

const UPDATE_REMINDER_MUTATION = gql`
  mutation UpdateReminder(
    $id: ID!
    $title: String
    $description: String
    $senderEmail: String
    $senderName: String
    $receiverEmail: String
    $intervalType: String
    $reminderStartDate: DateTime
    $reminderEndDate: DateTime
    $phoneNo: String
    $active: Boolean
    $send: Boolean
    $completed: Boolean
  ) {
    updateReminder(
      id: $id
      title: $title
      description: $description
      senderEmail: $senderEmail
      senderName: $senderName
      receiverEmail: $receiverEmail
      intervalType: $intervalType
      reminderStartDate: $reminderStartDate
      reminderEndDate: $reminderEndDate
      phoneNo: $phoneNo
      active: $active
      send: $send
      completed: $completed
    ) {
      ok
      reminder {
        id
        title
        active
      }
    }
  }
`;

const DELETE_REMINDER_MUTATION = gql`
  mutation DeleteReminder($id: ID!) {
    deleteReminder(id: $id) {
      ok
    }
  }
`;

const CREATE_DEPARTMENT_MUTATION = gql`
  mutation CreateDepartment($name: String!) {
    createDepartment(name: $name) {
      ok
      department {
        id
        name
        company {
          id
          name
        }
      }
    }
  }
`;

const UPDATE_DEPARTMENT_MUTATION = gql`
  mutation UpdateDepartment($id: ID!, $name: String) {
    updateDepartment(id: $id, name: $name) {
      ok
      department {
        id
        name
      }
    }
  }
`;

const DELETE_DEPARTMENT_MUTATION = gql`
  mutation DeleteDepartment($id: ID!) {
    deleteDepartment(id: $id) {
      ok
    }
  }
`;

export const reminderService = {
  async getReminders(active?: boolean): Promise<Reminder[]> {
    const variables = active !== undefined ? { active } : {};
    const result = await client.query({
      query: LIST_REMINDERS_QUERY,
      variables,
      fetchPolicy: 'network-only',
    });
    return result.data.reminders;
  },

  async getReminderById(id: string) {
    const result = await client.query({
      query: GET_REMINDER_BY_ID_QUERY,
      variables: { id },
    });
    return result.data.reminder;
  },

  async createReminder(data: CreateReminderInput) {
    const result = await client.mutate({
      mutation: CREATE_REMINDER_MUTATION,
      variables: data,
    });
    return result.data.createReminder;
  },

  async updateReminder(data: UpdateReminderInput) {
    const result = await client.mutate({
      mutation: UPDATE_REMINDER_MUTATION,
      variables: data,
    });
    return result.data.updateReminder;
  },

  async deleteReminder(id: string) {
    const result = await client.mutate({
      mutation: DELETE_REMINDER_MUTATION,
      variables: { id },
    });
    return result.data.deleteReminder;
  },
};

const LIST_USERS_QUERY = gql`
  query Users {
    users {
      id
      username
      email
      company {
        id
        name
      }
    }
  }
`;

export const userService = {
  async getMe() {
    const result = await client.query({
      query: gql`
        query Me {
          me {
            id
            username
            email
            company {
              id
              name
            }
          }
        }
      `,
    });
    return result.data.me || null;
  },

  async getAllUsers() {
    const result = await client.query({ query: LIST_USERS_QUERY });
    return result.data.users;
  },
};

export const departmentService = {
  async getDepartments() {
    const result = await client.query({
      query: gql`
        query Departments {
          departments {
            id
            name
            company {
              id
              name
            }
          }
        }
      `,
    });
    return result.data.departments;
  },

  async createDepartment(data: CreateDepartmentInput) {
    const result = await client.mutate({
      mutation: CREATE_DEPARTMENT_MUTATION,
      variables: data,
    });
    return result.data.createDepartment;
  },

  async updateDepartment(data: UpdateDepartmentInput) {
    const result = await client.mutate({
      mutation: UPDATE_DEPARTMENT_MUTATION,
      variables: data,
    });
    return result.data.updateDepartment;
  },

  async deleteDepartment(id: string) {
    const result = await client.mutate({
      mutation: DELETE_DEPARTMENT_MUTATION,
      variables: { id },
    });
    return result.data.deleteDepartment;
  },
};
