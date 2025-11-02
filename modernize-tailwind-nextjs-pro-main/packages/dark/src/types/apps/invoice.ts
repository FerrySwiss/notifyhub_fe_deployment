export interface Reminder {
  id: string;
  title: string;
  description?: string;
  senderEmail: string;
  senderName?: string;
  receiverEmail: string;
  intervalType?: string;
  reminderStartDate?: string; // DateTime
  reminderEndDate?: string; // DateTime
  phoneNo?: string;
  active?: boolean;
  completed?: boolean;
  userId?: string; // Assuming userId is needed for create, but not returned by queries
}