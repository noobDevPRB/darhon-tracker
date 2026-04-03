const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

function getToken(): string | null {
  return localStorage.getItem('token');
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Erro ${res.status}`);
  }

  return res.json();
}

// Auth
export function login(email: string, password: string) {
  return request<{ token: string; user: { email: string; permissions: string[] } }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

// Darhon
export function getDarhonData() {
  return request<Record<string, Record<string, number>>>('/darhon');
}

export function saveDarhonData(data: Record<string, Record<string, number>>) {
  return request<{ message: string }>('/darhon', {
    method: 'PUT',
    body: JSON.stringify({ data }),
  });
}

// Reunioes
export interface MeetingDetail {
  label: string;
  desc: string;
}

export interface MeetingItem {
  dev: boolean;
  tested: boolean;
  text: string;
  details?: MeetingDetail[];
}

export interface MeetingSection {
  icon: string;
  title: string;
  items: MeetingItem[];
}

export interface Meeting {
  _id: string;
  title: string;
  date: string;
  collapsed: boolean;
  sections: MeetingSection[];
}

export function getMeetings() {
  return request<Meeting[]>('/reunioes');
}

export function getMeeting(id: string) {
  return request<Meeting>(`/reunioes/${id}`);
}

export function createMeeting(data: { title: string; date?: string; sections?: MeetingSection[] }) {
  return request<Meeting>('/reunioes', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateMeeting(id: string, data: Partial<Meeting>) {
  return request<Meeting>(`/reunioes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deleteMeeting(id: string) {
  return request<{ message: string }>(`/reunioes/${id}`, { method: 'DELETE' });
}

export function deleteSection(meetingId: string, secIdx: number) {
  return request<Meeting>(`/reunioes/${meetingId}/sections/${secIdx}`, { method: 'DELETE' });
}

export function deleteItem(meetingId: string, secIdx: number, itemIdx: number) {
  return request<Meeting>(`/reunioes/${meetingId}/sections/${secIdx}/items/${itemIdx}`, { method: 'DELETE' });
}

export function finalizarRevisao(meetingId: string) {
  return request<{ message: string; original: Meeting; newMeeting: Meeting | null }>(
    `/reunioes/${meetingId}/finalizar`,
    { method: 'POST' }
  );
}
