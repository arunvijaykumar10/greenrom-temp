import { z } from 'zod';

function isValidPayrollStartDate(dateStr: string): boolean {
  if (!dateStr) return true;
  
  const date = new Date(dateStr);
  const today = new Date();
  
  const threeBusinessDays = new Date(today);
  threeBusinessDays.setDate(today.getDate() + 3);
  
  if (date < threeBusinessDays) return false;
  
  const dayOfWeek = date.getDay();
  return dayOfWeek >= 1 && dayOfWeek <= 4;
}

const payrollSchema = z.object({
  pay_frequency: z.enum(['Weekly', 'Bi-Weekly'], {
    errorMap: () => ({ message: 'Please select a valid pay frequency' }),
  }).optional(),
  pay_period: z.enum(['In arrears', 'Same week'], {
    errorMap: () => ({ message: 'Please select a valid pay period' }),
  }).optional(),
  payroll_start_date: z.string().optional()
    .refine(val => !val || isValidPayrollStartDate(val), {
      message: 'Start date must be at least 3 days from today and Monday-Thursday only'
    }),
  check_number: z.number().optional(),
  terms_accepted: z.boolean().optional().default(false),
});

const companyInfoSchema = z.object({
  entity_name: z.string().min(1, 'Entity Name is required').max(64, 'Entity Name cannot exceed 64 characters'),
  entity_type: z.string().min(1, 'Entity Type is required'),
  fein: z
    .string()
    .optional()
    .refine((val) => !val || /^\d{2}-\d{7}$/.test(val), { message: 'FEIN must be in format 99-9999999' }),
  address_line_1: z.string().max(64, 'Address line 1 cannot exceed 64 characters').optional(),
  address_line_2: z.string().max(64, 'Address line 2 cannot exceed 64 characters').optional(),
  city: z.string().max(24, 'City cannot exceed 24 characters').optional(),
  state: z.string().optional().default('NY'),
  zip_code: z
    .string()
    .optional()
    .refine((val) => !val || /^\d{5}$/.test(val), { message: 'Zip code must be 5 digits' }),
  phone_number: z
    .string()
    .optional()
    .refine((val) => !val || /^\(\d{3}\)-\d{3}-\d{4}$/.test(val), { message: 'Phone number must be in format (999)-999-9999' }),
  nys_unemployment_registration_number: z
    .string()
    .optional()
    .refine((val) => !val || /^\d{7}$/.test(val), { message: 'NYS unemployment number must be 7 digits' }),
});

const userDetailsSchema = z.object({
  first_name: z.string().min(1, 'First name is required').max(64, 'First name cannot exceed 64 characters'),
  last_name: z.string().min(1, 'Last name is required').max(64, 'Last name cannot exceed 64 characters'),
  email: z.string().email('Invalid email address').max(64, 'Email cannot exceed 64 characters'),
  role_title: z.string().optional(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().optional(),
  code: z.string().optional(),
})
.refine((data) => !data.confirmPassword || data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

const summarySchema = z.object({
  terms_accepted: z.boolean().refine(val => val === true, {
    message: 'You must accept the terms and conditions to proceed'
  }),
});

const makeRegisterValidation = (activeStep: number) => {
  if (activeStep === 0) {
    return companyInfoSchema;
  } else if (activeStep === 1) {
    return userDetailsSchema;
  } else if (activeStep === 2) {
    return payrollSchema;
  } else if (activeStep === 3) {
    return summarySchema;
  } else {
    throw new Error('Invalid step');
  }
};

export default makeRegisterValidation;
