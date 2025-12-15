import { client } from '@/app/libs/apollo-client';
import { gql } from '@apollo/client';
import { Reminder } from '@/types/apps/invoice';
import {
  MOCK_TOKEN,
  mockUser,
  mockUsers,
  mockDepartments,
  mockReminders
} from './mockData';

// ---------- BASE CONFIG ----------
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

const OAUTH_CLIENT_ID = process.env.NEXT_PUBLIC_OAUTH_CLIENT_ID || '';
const OAUTH_CLIENT_SECRET = process.env.NEXT_PUBLIC_OAUTH_CLIENT_SECRET || '';

// MODIFIED: Allow sending secret even if it looks like a hash, per user request
const SHOULD_SEND_CLIENT_SECRET = !!OAUTH_CLIENT_SECRET;
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';
// HYBRID MODE: Allow mocking data independently of Auth
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true' || USE_MOCK;

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
    if (USE_MOCK) return { message: 'Signup success (mock)' };

    const resp = await fetch(`${API_BASE_URL}/signup/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return handleJsonResponse(resp);
  },

  async loginPassword(username: string, password: string) {
    if (USE_MOCK) return { message: 'Login success (mock)', access_token: MOCK_TOKEN };

    const resp = await fetch(`${API_BASE_URL}/login/password/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    return handleJsonResponse(resp);
  },

  // Alias for compatibility
  async passwordStep(username: string, password: string) {
    return this.loginPassword(username, password);
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
    if (USE_MOCK) return { access_token: MOCK_TOKEN, expires_in: 3600, token_type: "Bearer" };

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
    if (USE_MOCK_DATA) {
      if (active !== undefined) {
        return mockReminders.filter(r => r.active === active);
      }
      return mockReminders;
    }

    const variables = active !== undefined ? { active } : {};
    const result = await client.query({
      query: LIST_REMINDERS_QUERY,
      variables,
      fetchPolicy: 'network-only',
    });
    return (result.data as any).reminders;
  },

  async getReminderById(id: string) {
    if (USE_MOCK_DATA) return mockReminders.find(r => r.id === id);

    const result = await client.query({
      query: GET_REMINDER_BY_ID_QUERY,
      variables: { id },
    });
    return (result.data as any).reminder;
  },

  async createReminder(data: CreateReminderInput) {
    if (USE_MOCK_DATA) {
      const newReminder = { ...data, id: `rem_${Date.now()}`, active: true };
      mockReminders.push(newReminder as any);
      return { ok: true, reminder: newReminder };
    }

    const result = await client.mutate({
      mutation: CREATE_REMINDER_MUTATION,
      variables: data,
    });
    return (result.data as any).createReminder;
  },

  async updateReminder(data: UpdateReminderInput) {
    if (USE_MOCK_DATA) {
      const rem = mockReminders.find(r => r.id === data.id);
      if (rem) {
        Object.assign(rem, data); // Simple merge
      }
      return { ok: true, reminder: rem };
    }

    const result = await client.mutate({
      mutation: UPDATE_REMINDER_MUTATION,
      variables: data,
    });
    return (result.data as any).updateReminder;
  },

  async deleteReminder(id: string) {
    if (USE_MOCK_DATA) {
      const index = mockReminders.findIndex(r => r.id === id);
      if (index > -1) mockReminders.splice(index, 1);
      return { ok: true };
    }

    const result = await client.mutate({
      mutation: DELETE_REMINDER_MUTATION,
      variables: { id },
    });
    return (result.data as any).deleteReminder;
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

const CREATE_USER_MUTATION = gql`
  mutation CreateUser(
    $name: String!
    $username: String!
    $email: String!
    $password: String
  ) {
    createUser(
      name: $name
      username: $username
      email: $email
      password: $password
    ) {
      ok
      user {
        id
        username
        email
      }
    }
  }
`;

interface CreateUserInput {
  name: string;
  username: string;
  email: string;
  password?: string;
}

export const userService = {
  async getMe() {
    if (USE_MOCK_DATA) return mockUser;

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
    return (result.data as any).me || null;
  },

  async getAllUsers() {
    if (USE_MOCK_DATA) return mockUsers;

    const result = await client.query({ query: LIST_USERS_QUERY });
    return (result.data as any).users;
  },

  async createUser(data: CreateUserInput) {
    if (USE_MOCK_DATA) {
      // Split name into firstName and lastName
      const nameParts = data.name.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      const newUser = {
        id: `user_${Date.now()}`,
        username: data.username,
        email: data.email,
        firstName,
        lastName,
        company: {
          id: "comp_1",
          name: "Acme Corp"
        }
      };
      mockUsers.push(newUser);
      return { ok: true, user: newUser };
    }

    const result = await client.mutate({
      mutation: CREATE_USER_MUTATION,
      variables: data,
    });
    return (result.data as any).createUser;
  },
};

export const departmentService = {
  async getDepartments() {
    if (USE_MOCK_DATA) return mockDepartments;

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
    return (result.data as any).departments;
  },

  async createDepartment(data: CreateDepartmentInput) {
    if (USE_MOCK_DATA) {
      const newDepartment = {
        id: `dept_${Date.now()}`,
        name: data.name,
        company: {
          id: "comp_1",
          name: "Acme Corp"
        }
      };
      mockDepartments.push(newDepartment);
      return { ok: true, department: newDepartment };
    }

    const result = await client.mutate({
      mutation: CREATE_DEPARTMENT_MUTATION,
      variables: data,
    });
    return (result.data as any).createDepartment;
  },

  async updateDepartment(data: UpdateDepartmentInput) {
    if (USE_MOCK_DATA) {
      // Find and update mock department
      const dept = mockDepartments.find(d => d.id === data.id);
      if (dept && data.name) dept.name = data.name;
      return { ok: true, department: dept };
    }

    const result = await client.mutate({
      mutation: UPDATE_DEPARTMENT_MUTATION,
      variables: data,
    });
    return (result.data as any).updateDepartment;
  },

  async deleteDepartment(id: string) {
    if (USE_MOCK_DATA) {
      const index = mockDepartments.findIndex(d => d.id === id);
      if (index > -1) mockDepartments.splice(index, 1);
      return { ok: true };
    }

    const result = await client.mutate({
      mutation: DELETE_DEPARTMENT_MUTATION,
      variables: { id },
    });
    return (result.data as any).deleteDepartment;
  },
};
