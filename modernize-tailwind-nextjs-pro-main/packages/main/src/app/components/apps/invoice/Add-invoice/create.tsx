"use client"
import { useState, useEffect } from "react";
import { Alert, Button, Label, Select, TextInput, Tooltip } from "flowbite-react";
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

const CURRENT_USER_NAME = "Admin User";

function CreateInvoice() {
  const router = useRouter();
  const [showAlert, setShowAlert] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorAlert, setErrorAlert] = useState(null);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setShowAlert(false);
    setErrorAlert(null); 

    // **FIXED:** Corrected Data structure for the GraphQL API.
    // 'userId: 1' has been removed to fix the API validation error.
    const postInput = {
      title: `Reminder for ${formData.assigned} (${formData.priority})`,
      body: `${formData.reminder}. Due Date: ${formData.dueDate}`,
    };

    const CREATE_POST_MUTATION = `
      mutation ($input: CreatePostInput!) {
        createPost(input: $input) {
          id
          title
          body
        }
      }
    `;

    try {
      const response = await fetch('https://graphqlzero.almansi.me/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: CREATE_POST_MUTATION,
          variables: {
            input: postInput,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.errors) {
         setErrorAlert(result.errors[0].message || "Failed to create reminder via API.");
         return;
      }
      
      // Save the new reminder data (including the mock ID and creator) to sessionStorage
      const existingReminders = JSON.parse(sessionStorage.getItem('reminders')) || [];
      const newReminder = { 
        ...formData, 
        id: result.data.createPost.id, 
        createdBy: CURRENT_USER_NAME, 
      }; 
      const updatedReminders = [...existingReminders, newReminder];
      sessionStorage.setItem('reminders', JSON.stringify(updatedReminders));

      // Success logic and redirection
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
        router.push('/apps/invoice/list'); // Redirect after success
      }, 3000);

    } catch (error) {
      setErrorAlert(`Network or API error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const parsedDate = isValid(new Date(formData.dueDate)) ? new Date(formData.dueDate) : new Date();
  const formattedDueDate = format(parsedDate, "EEEE, MMMM dd, yyyy");

  return (
    <div>
      <h2 className="text-xl mb-6">Add New Reminder Details</h2>
      <p>Date: {formattedDueDate}</p>
      
      {/* API Error Alert */}
      {errorAlert && (
        <Alert color="failure" rounded className="fixed top-3 left-1/2 -translate-x-1/2 z-50">
          <span className="font-medium">API Error!</span> {errorAlert}
        </Alert>
      )}

      {/* Success Alert */}
      {showAlert && (
        <Alert color="success" rounded className="fixed top-3 left-1/2 -translate-x-1/2 z-50">
          Reminder added successfully via API. Redirecting...
        </Alert>
      )}

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
                required
                disabled={isSubmitting}
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
                required
                disabled={isSubmitting}
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
                disabled={isSubmitting}
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
                required
                disabled={isSubmitting}
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <Button color="primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Reminder'}
          </Button>
          <Button color={"error"} onClick={() => { router.push('/apps/invoice/list'); }} disabled={isSubmitting}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}

export default CreateInvoice;