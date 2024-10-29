export interface Trip {
  id: string;
  name: string;
  status: "active" | "completed" | "planned";
  dates: {
    start: string;
    end: string;
  };
  locations: Location[];
  participants: Participant[];
  expenses: Expenses;
  schedule: Schedule;
  documents: Document[];
  chat: Chat;
  importantInfo: ImportantInfo;
}

export interface Location {
  id: string;
  name: string;
  country: string;
  duration: string;
  notes: string;
  photos: string[];
}

export interface Participant {
  id: string;
  name: string;
  email: string;
  role: "organizer" | "participant";
  avatar: string;
}

export interface Expenses {
  total: number;
  categories: ExpenseCategory[];
}

export interface ExpenseCategory {
  id: string;
  name: string;
  items: ExpenseItem[];
}

export interface ExpenseItem {
  id: string;
  name: string;
  amount: number;
  paidBy: string;
  splitBetween: string[];
}

export interface Schedule {
  days: Day[];
}

export interface Day {
  id: string;
  date: string;
  location: string;
  events: Event[];
}

export interface Event {
  id: string;
  time: string;
  title: string;
  description: string;
  type: "transport" | "accommodation" | "food" | "activity";
  duration: string;
  location: string;
}

export interface Document {
  id: string;
  name: string;
  category: "transport" | "accommodation" | "other";
  size: string;
  addedDate: string;
  url: string;
}

export interface Chat {
  messages: Message[];
}

export interface Message {
  id: string;
  userId: string;
  date: string;
  time: string;
  message: string;
}

export interface ImportantInfo {
  nextEvent: {
    id: string;
    title: string;
    date: string;
    time: string;
  };
  weather: {
    location: string;
    temperature: number;
    condition: string;
  };
  alerts: Alert[];
}

export interface Alert {
  id: string;
  message: string;
  type: "warning" | "info" | "error";
}
