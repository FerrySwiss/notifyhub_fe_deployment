"use client"
import { useState, useEffect } from "react";
import { Alert, Button, Label, Select, TextInput, Table, Tooltip } from "flowbite-react";
import { Icon } from "@iconify/react";
import { format, isValid } from "date-fns";
import { useRouter } from "next/navigation";
import Image from "next/image";

// Dummy data for users to assign the reminder to
const users = [
  { id: 1, name: "Rajesh Kumar", role: "Web Designer", avatar: "/images/profile/user-3.jpg" },
  { id: 2, name: "Priya Sharma", role: "Web Developer", avatar: "/images/profile/user-5.jpg" },
  { id: 3, name: "Anil Verma", role: "Web Manager", avatar: "/images/profile/user-6.jpg" },
];

function CreateInvoice() {
  const router = useRouter();
  const [showAlert, setShowAlert] = useState(false);
  const [formData, setFormData] = useState({
    id: 0,
    assigned: "",
    reminder: "",
    priority: "Low",
    dueDate: new Date().toISOString().split('T')[0],
    status: "Pending", 
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      const existingReminders = JSON.parse(sessionStorage.getItem('reminders')) || [];
      const newReminder = { ...formData, id: Date.now() }; // Use timestamp for unique ID
      const updatedReminders = [...existingReminders, newReminder];
      sessionStorage.setItem('reminders', JSON.stringify(updatedReminders));

      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
        router.push('/apps/invoice/list');
      }, 5000);
    } catch (error) {
      console.error("Error adding reminder:", error);
    }
  };

  const parsedDate = isValid(new Date(formData.dueDate)) ? new Date(formData.dueDate) : new Date();
  const formattedDueDate = format(parsedDate, "EEEE, MMMM dd, yyyy");

  return (
    <div>
      <h2 className="text-xl mb-6">Add New Reminder Details</h2>
      <p>ID: {formData.id}</p>
      <p>Date: {formattedDueDate}</p>
      <form onSubmit={handleSubmit}>
        <div className="bg-lightgray dark:bg-gray-800/70 p-6 my-6 rounded-md">
          <div className="grid grid-cols-12 gap-6">
            <div className="lg:col-span-6 md:col-span-6 col-span-12">
              <div className="mb-2 block">
                <Label htmlFor="assignedTo" value="Assigned To" />
              </div>
              <Select
                id="assignedTo"
                name="assigned" 
                value={formData.assigned}
                onChange={handleChange}
                className="select-md"
              >
                <option value="">Select a user</option>
                {users.map((user) => (
                  <option key={user.id} value={user.name}>{user.name}</option>
                ))}
              </Select>
            </div>
            <div className="lg:col-span-6 md:col-span-6 col-span-12">
              <div className="mb-2 block">
                <Label htmlFor="reminder" value="Reminder" />
              </div>
              <TextInput
                id="reminder"
                name="reminder"
                value={formData.reminder}
                onChange={handleChange}
                type="text"
                className="form-control"
              />
            </div>
            <div className="lg:col-span-6 md:col-span-6 col-span-12">
              <div className="mb-2 block">
                <Label htmlFor="priority" value="Priority" />
              </div>
              <Select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="select-md"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </Select>
            </div>
            <div className="lg:col-span-6 md:col-span-6 col-span-12">
              <div className="mb-2 block">
                <Label htmlFor="dueDate" value="Due Date" />
              </div>
              <TextInput
                id="dueDate"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                type="date"
                className="form-control"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <Button color="primary" type="submit">
            Create Reminder
          </Button>
          <Button color={"error"} onClick={() => { router.push('/apps/invoice/list'); }}>
            Cancel
          </Button>
        </div>
      </form>
      {showAlert && (
        <Alert color="warning" rounded className="fixed top-3">
          Reminder added successfully.
        </Alert>
      )}
    </div>
  );
}

export default CreateInvoice;