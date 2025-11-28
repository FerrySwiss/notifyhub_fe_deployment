"use client";
import React, { useState } from "react";
import { Label, TextInput, Textarea, Button } from "flowbite-react";
import { Icon } from "@iconify/react/dist/iconify.js";

const CreateReminder = () => {

  const [title, setTitle] = useState("");

  const [description, setDescription] = useState("");

  const [senderName, setSenderName] = useState("");

  const [senderEmail, setSenderEmail] = useState("");

  const [receiverEmail, setReceiverEmail] = useState("");

  const [intervalType, setIntervalType] = useState("Daily"); // Default to "Daily"

  const [startDate, setStartDate] = useState("");

  const [endDate, setEndDate] = useState("");

  const [isExpanded, setIsExpanded] = useState(false); // State to handle description expansion



  const handleSubmit = (e: React.FormEvent) => {

    e.preventDefault();

    // Here you would typically send the reminder data to a backend

    console.log("New Reminder:", {

      title,

      description,

      senderName,

      senderEmail,

      receiverEmail,

      intervalType,

      startDate,

      endDate,

    });

    // Reset form

    setTitle("");

    setDescription("");

    setSenderName("");

    setSenderEmail("");

    setReceiverEmail("");

    setIntervalType("Daily");

    setStartDate("");

    setEndDate("");

    setIsExpanded(false);

  };



  return (

    <div className="p-4 border rounded-lg shadow-md">

      <h4 className="text-xl font-bold mb-4">Create New Reminder</h4>

      <form onSubmit={handleSubmit}>

        <div className="mb-4">

          <div className="mb-2 block">

            <Label htmlFor="reminder-title" value="Reminder Title" className="font-semibold" />

          </div>

          <TextInput

            id="reminder-title"

            type="text"

            sizing="md"

            className="form-control"

            value={title}

            onChange={(e) => setTitle(e.target.value)}

            placeholder="Enter reminder title"

            required

          />

        </div>



        <div className="mb-4">

          <div className="mb-2 block">

            <Label htmlFor="reminder-description" value="Description" className="font-semibold" />

          </div>

          <Textarea

            id="reminder-description"

            rows={isExpanded ? 6 : 3} // Expand rows when isExpanded is true

            className="form-control"

            value={description}

            onChange={(e) => setDescription(e.target.value)}

            placeholder="Enter reminder description"

            onFocus={() => setIsExpanded(true)} // Expand when focused

            onBlur={() => {if (!description) setIsExpanded(false)}} // Collapse if unfocused and empty

          />

        </div>



        <div className="mb-4">

          <div className="mb-2 block">

            <Label htmlFor="sender-name" value="Sender Name" className="font-semibold" />

          </div>

          <TextInput

            id="sender-name"

            type="text"

            sizing="md"

            className="form-control"

            value={senderName}

            onChange={(e) => setSenderName(e.target.value)}

            placeholder="Enter sender name"

            required

          />

        </div>



        <div className="mb-4">

          <div className="mb-2 block">

            <Label htmlFor="sender-email" value="Sender Email" className="font-semibold" />

          </div>

          <TextInput

            id="sender-email"

            type="email"

            sizing="md"

            className="form-control"

            value={senderEmail}

            onChange={(e) => setSenderEmail(e.target.value)}

            placeholder="Enter sender email"

            required

          />

        </div>



        <div className="mb-4">

          <div className="mb-2 block">

            <Label htmlFor="receiver-email" value="Receiver Email" className="font-semibold" />

          </div>

          <TextInput

            id="receiver-email"

            type="email"

            sizing="md"

            className="form-control"

            value={receiverEmail}

            onChange={(e) => setReceiverEmail(e.target.value)}

            placeholder="Enter receiver email"

            required

          />

        </div>



        <div className="mb-4">

          <div className="mb-2 block">

            <Label htmlFor="interval-type" value="Interval Type" className="font-semibold" />

          </div>

          <select

            id="interval-type"

            className="form-control block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"

            value={intervalType}

            onChange={(e) => setIntervalType(e.target.value)}

          >

            <option value="Daily">Daily</option>

            {/* Add more options here if needed, e.g., <option value="Weekly">Weekly</option> */}

          </select>

        </div>



        <div className="mb-4">

          <div className="mb-2 block">

            <Label htmlFor="start-date" value="Reminder Start Date" className="font-semibold" />

          </div>

          <TextInput

            id="start-date"

            type="date"

            sizing="md"

            className="form-control"

            value={startDate}

            onChange={(e) => setStartDate(e.target.value)}

            required

          />

        </div>



        <div className="mb-4">

          <div className="mb-2 block">

            <Label htmlFor="end-date" value="Reminder End Date" className="font-semibold" />

          </div>

          <TextInput

            id="end-date"

            type="date"

            sizing="md"

            className="form-control"

            value={endDate}

            onChange={(e) => setEndDate(e.target.value)}

            required

          />

        </div>



        <div className="flex justify-end gap-2">

          <Button color="alternative" onClick={() => {

            setTitle("");

            setDescription("");

            setSenderName("");

            setSenderEmail("");

            setReceiverEmail("");

            setIntervalType("Daily");

            setStartDate("");

            setEndDate("");

            setIsExpanded(false);

          }}>

            Clear

          </Button>

          <Button color="primary" type="submit">

            Add Reminder

          </Button>

        </div>

      </form>

    </div>

  );

};



export default CreateReminder;