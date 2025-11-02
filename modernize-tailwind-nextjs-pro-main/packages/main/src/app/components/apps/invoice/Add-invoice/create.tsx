'use client';
import { useState, useContext, useCallback } from "react";
import { Alert, Button, Label, Select, TextInput } from "flowbite-react";
import { useRouter } from "next/navigation";
import { InvoiceContext } from "@/app/context/InvoiceContext/index";

// Define the shape of the form data
interface ReminderFormData {
  title: string;
  description: string;
  senderName: string;
  senderEmail: string;
  receiverEmail: string;
  intervalType: "Daily" | "Weekly" | "Monthly";
  sendReminderAt: string;
  reminderEndDate: string;
  status: "Pending";
}

// Initial state for the form
const initialFormData: ReminderFormData = {
  title: "",
  description: "",
  senderName: "",
  senderEmail: "",
  receiverEmail: "",
  intervalType: "Daily",
  sendReminderAt: "",
  reminderEndDate: new Date().toISOString().split('T')[0],
  status: "Pending",
};

// --- Helper component for a form group ---
interface FormGroupProps {
  id: keyof ReminderFormData;
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  isSubmitting: boolean;
  options?: string[]; // For select inputs
}

const FormGroup: React.FC<FormGroupProps> = ({
  id,
  label,
  type = "text",
  value,
  onChange,
  isSubmitting,
  options
}) => {
  const InputComponent = options ? Select : TextInput;
  const inputProps = {
    id,
    name: id,
    value,
    onChange,
    className: options ? "select-md" : "form-control",
    required: true,
    disabled: isSubmitting,
    ...(type && !options && { type }), // Only pass 'type' for TextInput
  };

  return (
    <div>
      <div className="mb-2 block">
        <Label htmlFor={id} value={label} />
      </div>
      <InputComponent {...inputProps}>
        {options && options.map(option => <option key={option}>{option}</option>)}
      </InputComponent>
    </div>
  );
};

// --- Main Component ---
function CreateReminder() {
  const { addInvoice } = useContext(InvoiceContext);
  const router = useRouter();
  const [showAlert, setShowAlert] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorAlert, setErrorAlert] = useState<string | null>(null);

  const [formData, setFormData] = useState<ReminderFormData>(initialFormData);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    } as ReminderFormData)); // Explicit cast to avoid type issues with dynamic key
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorAlert(null);

    const newReminder = {
      ...formData,
      id: Math.floor(Math.random() * 10000),
      isSelected: false,
      reminderEndDate: new Date(formData.reminderEndDate),
    };

    try {
      await addInvoice(newReminder);
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
        router.push("/apps/invoice/list");
      }, 2000);
    } catch (error: any) {
      setErrorAlert(error.message || "Failed to create reminder.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formFields: FormGroupProps[] = [
    { id: "title", label: "Title", value: formData.title, onChange: handleChange, isSubmitting },
    { id: "description", label: "Description", value: formData.description, onChange: handleChange, isSubmitting },
    { id: "senderName", label: "Sender Name", value: formData.senderName, onChange: handleChange, isSubmitting },
    { id: "senderEmail", label: "Sender Email", type: "email", value: formData.senderEmail, onChange: handleChange, isSubmitting },
    { id: "receiverEmail", label: "Receiver Email (comma-separated)", value: formData.receiverEmail, onChange: handleChange, isSubmitting },
    { id: "intervalType", label: "Interval Type", value: formData.intervalType, onChange: handleChange, isSubmitting, options: ["Daily", "Weekly", "Monthly"] },
    { id: "sendReminderAt", label: "Send Reminder At", type: "time", value: formData.sendReminderAt, onChange: handleChange, isSubmitting },
    { id: "reminderEndDate", label: "Reminder End Date", type: "date", value: formData.reminderEndDate, onChange: handleChange, isSubmitting },
  ];

  return (
    <div>
      <h2 className="text-xl mb-6">📅 Add New Reminder</h2>

      {errorAlert && (<Alert color="failure" rounded className="my-4"><span className="font-medium">Error!</span> {errorAlert}</Alert>)}
      {showAlert && (<Alert color="success" rounded className="my-4">Reminder added successfully. Redirecting...</Alert>)}

      <form onSubmit={handleSubmit}>
        <div className="bg-lightgray dark:bg-gray-800/70 p-6 my-6 rounded-md">
          {/* Change for 2-column layout: grid-cols-12 on the container with gap-6, 
              and then each form group takes 6 columns (lg:col-span-6) */}
          <div className="grid grid-cols-12 gap-6">
            {formFields.map((field) => (
              <div key={field.id} className="lg:col-span-6 col-span-12">
                <FormGroup {...field} />
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <Button color="primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Reminder'}
          </Button>
          <Button color="error" onClick={() => router.push('/apps/invoice/list')} disabled={isSubmitting}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}

export default CreateReminder;