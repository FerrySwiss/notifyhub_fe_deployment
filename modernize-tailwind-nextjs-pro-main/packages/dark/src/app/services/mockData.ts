
import { Reminder } from "@/types/apps/invoice";

export const MOCK_TOKEN = "mock_access_token_12345";

export const mockUser = {
    id: "user_123",
    username: "johndoe",
    email: "johndoe@example.com",
    firstName: "John",
    lastName: "Doe",
    company: {
        id: "comp_1",
        name: "Acme Corp",
    },
};

export const mockUsers = [
    mockUser,
    {
        id: "user_456",
        username: "janedoe",
        email: "janedoe@example.com",
        firstName: "Jane",
        lastName: "Doe",
        company: {
            id: "comp_1",
            name: "Acme Corp",
        },
    },
];

export const mockDepartments = [
    {
        id: "dept_1",
        name: "Engineering",
        company: {
            id: "comp_1",
            name: "Acme Corp",
        },
    },
    {
        id: "dept_2",
        name: "Marketing",
        company: {
            id: "comp_1",
            name: "Acme Corp",
        },
    },
    {
        id: "dept_3",
        name: "Sales",
        company: {
            id: "comp_1",
            name: "Acme Corp",
        },
    },
];

export const mockReminders: Reminder[] = [
    {
        id: "rem_1",
        title: "Project Deadline",
        description: "Submit final report for Q3.",
        senderEmail: "johndoe@example.com",
        senderName: "John Doe",
        receiverEmail: "team@example.com",
        intervalType: "None",
        reminderStartDate: new Date().toISOString(),
        reminderEndDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
        phoneNo: "123-456-7890",
        active: true,
    },
    {
        id: "rem_2",
        title: "Weekly Sync",
        description: "Team sync meeting.",
        senderEmail: "manager@example.com",
        senderName: "Manager",
        receiverEmail: "johndoe@example.com",
        intervalType: "Weekly",
        reminderStartDate: new Date().toISOString(),
        reminderEndDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days from now
        phoneNo: "987-654-3210",
        active: true,
    },
    {
        id: "rem_3",
        title: "Client Call",
        description: "Discuss requirements.",
        senderEmail: "johndoe@example.com",
        senderName: "John Doe",
        receiverEmail: "client@example.com",
        intervalType: "None",
        reminderStartDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // Started 10 days ago
        reminderEndDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // Ended 2 days ago
        phoneNo: "555-555-5555",
        active: false,
        completed: true,
    },
    {
        id: "rem_4",
        title: "Budget Review",
        description: "Review Q4 budget allocations.",
        senderEmail: "finance@example.com",
        senderName: "Finance Team",
        receiverEmail: "managers@example.com",
        intervalType: "Monthly",
        reminderStartDate: new Date().toISOString(),
        reminderEndDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(), // 25 days from now
        phoneNo: "111-222-3333",
        active: true,
    },
    {
        id: "rem_5",
        title: "Annual Review",
        description: "Employee performance reviews.",
        senderEmail: "hr@example.com",
        senderName: "HR Department",
        receiverEmail: "all@example.com",
        intervalType: "Yearly",
        reminderStartDate: new Date().toISOString(),
        reminderEndDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(), // 45 days from now (outside 30 days)
        phoneNo: "444-555-6666",
        active: true,
    },
    {
        id: "rem_6",
        title: "Training Session",
        description: "New software training.",
        senderEmail: "training@example.com",
        senderName: "Training Team",
        receiverEmail: "employees@example.com",
        intervalType: "None",
        reminderStartDate: new Date().toISOString(),
        reminderEndDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
        phoneNo: "777-888-9999",
        active: true,
    },
];
