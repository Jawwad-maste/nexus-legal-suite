
export interface Client {
  id: string;
  name: string;
  age?: number;
  case_title?: string;
  photo_url?: string;
  created_at: string;
}

export interface Event {
  id: string;
  title: string;
  type: 'hearing' | 'meeting';
  date: string;
  client_id?: string;
  google_event_id?: string;
  created_at: string;
  client?: Client;
}

export interface Document {
  id: string;
  client_id: string;
  file_url: string;
  file_name: string;
  file_type: string;
  file_size?: number;
  uploaded_at: string;
  client?: Client;
}
