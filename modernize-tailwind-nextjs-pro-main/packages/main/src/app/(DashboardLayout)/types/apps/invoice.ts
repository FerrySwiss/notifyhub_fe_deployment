export interface InvoiceList {
  id: number;
  title: string;
  description: string;
  senderEmail: string;
  senderName: string;
  receiverEmail: string; 
  intervalType: string;
  sendReminderAt: string;
  reminderEndDate: Date;
  status: string;
  isSelected: boolean;
}
