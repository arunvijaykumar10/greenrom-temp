import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useBoolean } from 'minimal-shared/hooks';

import LoadingButton from '@mui/lab/LoadingButton';
import { Box, IconButton, InputAdornment, Typography, Divider, Paper } from '@mui/material';

import { EmailInboxIcon } from 'src/assets/icons';

import { Iconify } from 'src/components/iconify';
import { Field, RHFTextField, RHFDatePicker, RHFAutocomplete } from 'src/components/hook-form';

import { FormHead } from 'src/auth/components/form-head';
import { signUp, confirmSignUp } from 'src/auth/context/amplify';

import { StepIndex } from './types';


const entityTypes = ['Corp', 'Partnership', 'Sole Proprietor', 'Non Profit', 'Single-member LLC'];
const states = ['NY']; // Only NY state allowed per requirements
const payFrequencies = ['Weekly', 'Bi-Weekly'];
const payPeriods = ['In arrears', 'Same week'];
const roles = ['Owner', 'Manager', 'Producer', 'Accountant', 'Production Manager'];

interface Props {
  activeStep: StepIndex;
  setIsUserVerified: React.Dispatch<React.SetStateAction<boolean>>;
  isUserVerfied: boolean;
  setIsOtpVerified: React.Dispatch<React.SetStateAction<boolean>>;
  isOtpVerified: boolean;
}

const RegistrationFormContent = ({ activeStep, isUserVerfied, setIsUserVerified, setIsOtpVerified, isOtpVerified }: Props) => {

  const showPassword = useBoolean();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const methods = useFormContext();
  const handleClick = async () => {
    try {
      setIsSubmitting(true);
      const formValues = methods.getValues();

      // await signUp({
      //   username: formValues.email,
      //   password: formValues.password,
      //   firstName: formValues.firstName,
      //   lastName: formValues.lastName,
      //   middleName: formValues.middleName || '',
      // });

      setIsUserVerified(true);
    } catch (error) {
      console.error('Error signing up user:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpVerification = async () => {

    try {
      setIsSubmitting(true);
      const formValues = methods.getValues();
      // await confirmSignUp({ username: formValues.email, confirmationCode: formValues.code });
      setIsOtpVerified(true);
    } catch (error) {
      console.error('Error signing up user:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  // Get form values for summary view
  const { getValues } = methods;
  const formValues = getValues();
  
  switch (activeStep) {
    case StepIndex.CompanyInfo:
      return (
        <>
          <RHFTextField 
            name="entity_name" 
            label="Entity Name" 
            helperText="Required, max 64 characters, must be unique"
          />
          <RHFAutocomplete 
            options={entityTypes} 
            name="entity_type" 
            label="Entity type" 
            helperText="Required"
          />
          <RHFTextField 
            name="fein" 
            label="FEIN" 
            helperText="Format: 99-9999999 (optional, must be unique)"
          />
          <Box sx={{ mt: 2, mb: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Address Information (Optional)
            </Typography>
          </Box>
          <RHFTextField 
            name="address_line_1" 
            label="Address Line 1" 
            helperText="Max 64 characters (optional)"
          />
          <RHFTextField 
            name="address_line_2" 
            label="Address Line 2" 
            helperText="Max 64 characters (optional)"
          />
          <RHFTextField 
            name="city" 
            label="City" 
            helperText="Max 24 characters (optional)"
          />
          <RHFAutocomplete 
            options={states} 
            name="state" 
            label="State" 
            helperText="NY only"
            disabled
            defaultValue="NY"
          />
          <RHFTextField 
            name="zip_code" 
            label="Zip Code" 
            helperText="5-digit NY state zip code (optional)"
          />
          <RHFTextField 
            name="phone_number" 
            label="Phone Number" 
            helperText="Format: (999)-999-9999 (optional)"
          />
          <RHFTextField
            name="nys_unemployment_registration_number"
            label="NYS Unemployment Registration Number"
            helperText="7-digit number (optional, must be unique)"
          />
        </>
      );
      
    case StepIndex.Summary:
      return (
        <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
          <Typography variant="h6">Review Your Information</Typography>
          
          <Paper sx={{ mt: 2, p: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Company Information</Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body2"><strong>Entity Name:</strong> {formValues.entity_name}</Typography>
            <Typography variant="body2"><strong>Entity Type:</strong> {formValues.entity_type}</Typography>
            {formValues.fein && <Typography variant="body2"><strong>FEIN:</strong> {formValues.fein}</Typography>}
            {formValues.address_line_1 && (
              <>
                <Typography variant="body2" sx={{ mt: 1 }}><strong>Address:</strong></Typography>
                <Typography variant="body2">{formValues.address_line_1}</Typography>
                {formValues.address_line_2 && <Typography variant="body2">{formValues.address_line_2}</Typography>}
                <Typography variant="body2">
                  {formValues.city}, {formValues.state} {formValues.zip_code}
                </Typography>
              </>
            )}
            {formValues.phone_number && <Typography variant="body2"><strong>Phone:</strong> {formValues.phone_number}</Typography>}
            {formValues.nys_unemployment_registration_number && (
              <Typography variant="body2">
                <strong>NYS Unemployment Registration:</strong> {formValues.nys_unemployment_registration_number}
              </Typography>
            )}
          </Paper>
          
          <Paper sx={{ mt: 2, p: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>User Information</Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body2">
              <strong>Name:</strong> {formValues.first_name} {formValues.last_name}
            </Typography>
            <Typography variant="body2"><strong>Email:</strong> {formValues.email}</Typography>
            {formValues.role_title && <Typography variant="body2"><strong>Role:</strong> {formValues.role_title}</Typography>}
          </Paper>
          
          <Paper sx={{ mt: 2, p: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Payroll Information</Typography>
            <Divider sx={{ mb: 2 }} />
            {formValues.pay_frequency && (
              <Typography variant="body2"><strong>Pay Frequency:</strong> {formValues.pay_frequency}</Typography>
            )}
            {formValues.pay_period && (
              <Typography variant="body2"><strong>Pay Period:</strong> {formValues.pay_period}</Typography>
            )}
            {formValues.payroll_start_date && (
              <Typography variant="body2">
                <strong>Start Date:</strong> {
                  typeof formValues.payroll_start_date === 'string' 
                    ? formValues.payroll_start_date 
                    :(new Date(formValues.payroll_start_date), 'MM/dd/yyyy')
                }
              </Typography>
            )}
            {formValues.check_number && (
              <Typography variant="body2"><strong>Check Number:</strong> {formValues.check_number}</Typography>
            )}
          </Paper>
          
          <Paper sx={{ mt: 3, p: 2, bgcolor: '#f9f9f9' }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Terms and Conditions</Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body2" color="text.secondary" mb={3}>
              By checking this box, I agree to the Terms of Service and Privacy Policy. I understand that my information will be used as described in the Privacy Policy. I acknowledge that the information provided is accurate and complete to the best of my knowledge.
            </Typography>
            <Field.Checkbox 
              name="terms_accepted" 
              label="I accept the terms and conditions" 
              required
            />
          </Paper>
        </Box>
      );

    case StepIndex.UserInfo:
      return (
        <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
          <Box
            sx={{ display: 'flex', gap: { xs: 3, sm: 2 }, flexDirection: { xs: 'column', sm: 'row' } }}
          >
            <Field.Text
              name="first_name"
              label="First name"
              slotProps={{ inputLabel: { shrink: true } }}
              helperText="Required, max 64 characters"
            />
            <Field.Text
              name="middleName"
              label="Middle name"
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <Field.Text
              name="last_name"
              label="Last name"
              slotProps={{ inputLabel: { shrink: true } }}
              helperText="Required, max 64 characters"
            />
          </Box>

          <Field.Text 
            name="email" 
            label="Email address" 
            slotProps={{ inputLabel: { shrink: true } }} 
            helperText="Required, max 64 characters"
          />
          
          <RHFAutocomplete 
            name="role_title" 
            label="Role / Title" 
            options={roles} 
            // helperText="Optional, select from list or enter manually"
            freeSolo
          />

          <Field.Text
            name="password"
            label="Password"
            placeholder="6+ characters"
            type={showPassword.value ? 'text' : 'password'}
            slotProps={{
              inputLabel: { shrink: true },
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={showPassword.onToggle} edge="end">
                      <Iconify icon={showPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
          
          {/* <Field.Text
            name="confirmPassword"
            label="Confirm Password"
            placeholder="Confirm your password"
            type={showPassword.value ? 'text' : 'password'}
            slotProps={{
              inputLabel: { shrink: true },
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={showPassword.onToggle} edge="end">
                      <Iconify icon={showPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          /> */}

          {!isUserVerfied && <LoadingButton
            fullWidth
            color="inherit"
            size="large"
            type="submit"
            variant="contained"
            onClick={handleClick}
            loading={isSubmitting}
            loadingIndicator="Create account..."
          >
            Confirm
          </LoadingButton>}
          {isUserVerfied && !isOtpVerified && <>
            <FormHead
              icon={<EmailInboxIcon />}
              title="Please check your email!"
              description={`We've emailed a 6-digit confirmation code. \nPlease enter the code in the box below to verify your email.`}
            />
            <Field.Code name="code" />

            <LoadingButton
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              loading={isSubmitting}
              loadingIndicator="Verify..."
              onClick={handleOtpVerification}
              disabled={!methods.watch('code')}
            >
              Verify
            </LoadingButton>
          </>}
        </Box>
      );

    case StepIndex.Payroll:
      return (
        <>
          <RHFAutocomplete 
            name="pay_frequency" 
            label="Pay Frequency" 
            options={payFrequencies} 
            helperText="Weekly (default) or Bi-Weekly"
          />
          <RHFAutocomplete 
            name="pay_period" 
            label="Pay Period" 
            options={payPeriods} 
            helperText="In arrears (payment for previous week work) or Same week (payment for current week work)"
          />
          <RHFDatePicker 
            name="payroll_start_date" 
            label="Payroll Start Date" 
            // helperText="Must be at least 3 days from today, Monday-Thursday only"
          />
          <RHFTextField 
            name="check_number" 
            label="Check Number" 
            type="number"
            helperText="Positive numbers only"
          />

        </>
      );

    default:
      return null;
  }
}

export default RegistrationFormContent;
