import type { ContactFormData } from './contact-form.schema';

export type SendContactMessage = (data: ContactFormData) => Promise<void>;
