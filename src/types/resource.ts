export type DisplayLocation = 'HOME' | 'OUTROS RECURSOS';
export type ResourceStatus = 'ATIVO' | 'INATIVO';

export interface Resource {
  id: string;
  name: string;
  category: string;
  description: string;
  link: string;
  buttonText: string;
  whatsappMessage: string;
  emailSubject: string;
  emailBody: string;
  displayLocation: DisplayLocation;
  status: ResourceStatus;
  createdAt: string;
}
