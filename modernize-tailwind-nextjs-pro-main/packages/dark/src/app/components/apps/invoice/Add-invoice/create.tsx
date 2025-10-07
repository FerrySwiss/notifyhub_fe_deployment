"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Label, TextInput, Select, Button, Alert } from "flowbite-react";
import { gql, useMutation } from "@apollo/client";
import { GET_REMINDERS } from "@/app/components/apps/invoice/Invoice-list";

const CREATE_REMINDER = gql`
  mutation CreateReminder($input: CreateTodoInput!) {
    createTodo(input: $input) {
      id
      title
      completed
    }
  }
`;

const CreateInvoice = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    sender_email: "",
    sender_name: "",
    receiver_email: "",
    interval_type: "daily",
    reminder_start_date: "",
    reminder_end_date: "",
  });
  const [formStatus, setFormStatus] = useState({ success: "", error: "" });

  const [createReminder, { loading }] = useMutation(CREATE_REMINDER, {
    update: (cache, { data: { createTodo } }) => {
      const data = cache.readQuery({ query: GET_REMINDERS });
      if (data) {
        const { todos } = data;
        cache.writeQuery({
          query: GET_REMINDERS,
          data: {
            todos: {
              ...todos,
              data: [createTodo, ...todos.data],
            },
          },
        });
      }
    },
    onCompleted: () => {
      setFormStatus({ success: "Reminder created successfully!", error: "" });
      setTimeout(() => router.push("/apps/invoice/list"), 1500);
    },
    onError: (err) => {
      setFormStatus({ success: "", error: err.message });
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createReminder({
      variables: {
        input: {
          title: formData.title,
          completed: false,
        },
      },
    });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Create New Reminder</h2>

      {formStatus.success && (
        <Alert color="success" className="mb-4">
          {formStatus.success}
        </Alert>
      )}
      {formStatus.error && (
        <Alert color="failure" className="mb-4">
          {formStatus.error}
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="title" value="Title" />
          <TextInput
            id="title"
            name="title"
            placeholder="Reminder Title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="description" value="Description" />
          <TextInput
            id="description"
            name="description"
            placeholder="Reminder Description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="sender_name" value="Sender Name" />
          <TextInput
            id="sender_name"
            name="sender_name"
            placeholder="Sender Name"
            value={formData.sender_name}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="sender_email" value="Sender Email" />
          <TextInput
            id="sender_email"
            name="sender_email"
            type="email"
            placeholder="Sender Email"
            value={formData.sender_email}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="receiver_email" value="Receiver Email" />
          <TextInput
            id="receiver_email"
            name="receiver_email"
            type="email"
            placeholder="Receiver Email"
            value={formData.receiver_email}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="interval_type" value="Interval Type" />
          <Select
            id="interval_type"
            name="interval_type"
            value={formData.interval_type}
            onChange={handleChange}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </Select>
        </div>
        <div>
          <Label htmlFor="reminder_start_date" value="Reminder Start Date" />
          <TextInput
            id="reminder_start_date"
            name="reminder_start_date"
            type="date"
            value={formData.reminder_start_date}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="reminder_end_date" value="Reminder End Date" />
          <TextInput
            id="reminder_end_date"
            name="reminder_end_date"
            type="date"
            value={formData.reminder_end_date}
            onChange={handleChange}
          />
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Reminder"}
        </Button>
      </form>
    </div>
  );
};

export default CreateInvoice;
