export type ContactDetailId = 'name' | 'email' | 'phone' | 'linkedin' | 'github' | 'location';

export interface ContactDetail {
  id: ContactDetailId;
  label: string;
  value: string;
  href?: string;
  external?: boolean;
}
