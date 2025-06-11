import { z } from 'zod';

const payrollSchema = z.object({
  pay_frequency: z.string().min(1, 'Pay frequency is required'),
  pay_period: z.string().min(1, 'Pay period is required'),
  payroll_start_date: z.string().min(1, 'Start date is required'),
  check_number: z.string().min(1, 'Check number is required'),
});

const companyInfoSchema = z.object({
  entity_name: z.string().min(1, 'Entity Name is required'),
  entity_type: z.string().min(1, 'Entity Type is required'),
  fein: z
    .string()
    .optional()
    .refine((val) => !val || /^\d+$/.test(val), { message: 'FEIN must be a number' }),
  address_line_1: z.string().optional(),
  address_line_2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zip_code: z.string().optional(),
  phone_number: z.string().optional(),
  nys_unemployment_registration_number: z
    .string()
    .optional()
    .refine((val) => !val || /^\d+$/.test(val), { message: 'NYS must be a number' }),
});

const userDetailsSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  role: z.string().min(1, 'Role is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  // confirmPassword: z.string().min(1, 'Confirm password is required'),
})
// .refine((data) => data.password === data.confirmPassword, {
//   message: "Passwords don't match",
//   path: ['confirmPassword'],
// });

const makeRegisterValidation = (activeStep: number) => {
  if (activeStep === 0) {
    return companyInfoSchema;
  } else if (activeStep === 1) {
    return userDetailsSchema;
  } else if (activeStep === 2) {
    return payrollSchema;
  } else {
    throw new Error('Invalid step');
  }
};

export default makeRegisterValidation;
