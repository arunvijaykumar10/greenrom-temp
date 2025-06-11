import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useBoolean } from 'minimal-shared/hooks';

import LoadingButton from '@mui/lab/LoadingButton';
import { Box, IconButton, InputAdornment } from '@mui/material';

import { EmailInboxIcon } from 'src/assets/icons';

import { Iconify } from 'src/components/iconify';
import { Field, RHFTextField, RHFDatePicker, RHFAutocomplete } from 'src/components/hook-form';

import { FormHead } from 'src/auth/components/form-head';
import { signUp, confirmSignUp } from 'src/auth/context/amplify';

import { StepIndex } from './types';


const entityTypes = ['LLC', 'Corporation', 'Sole Proprietor', 'Partnership'];
const states = ['NY', 'CA', 'TX', 'FL'];
const payFrequencies = ['Weekly', 'Bi-Weekly', 'Monthly'];
const payPeriods = ['Current', 'Previous', 'Next'];
const roles = ['Owner', 'Manager', 'Employee'];

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

      await signUp({
        username: formValues.email,
        password: formValues.password,
        firstName: formValues.firstName,
        lastName: formValues.lastName,
        middleName: formValues.middleName || '',
      });

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
      await confirmSignUp({ username: formValues.email, confirmationCode: formValues.code });
      setIsOtpVerified(true);
    } catch (error) {
      console.error('Error signing up user:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  switch (activeStep) {
    case StepIndex.CompanyInfo:
      return (
        <>
          <RHFTextField name="entity_name" label="Entity Name" />
          <RHFAutocomplete options={entityTypes} name="entity_type" label="Entity type" />
          <RHFTextField name="fein" label="FEIN" />
          <RHFTextField name="address_line_1" label="Address Line 1" />
          <RHFTextField name="address_line_2" label="Address Line 2" />
          <RHFTextField name="city" label="City" />
          <RHFAutocomplete options={states} name="state" label="State" />
          <RHFTextField name="zip_code" label="Zip Code" />
          <RHFTextField name="phone_number" label="Phone Number" />
          <RHFTextField
            name="nys_unemployment_registration_number"
            label="NYS Unemployment Registration Number"
          />
        </>
      );

    case StepIndex.UserInfo:
      return (
        <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
          <Box
            sx={{ display: 'flex', gap: { xs: 3, sm: 2 }, flexDirection: { xs: 'column', sm: 'row' } }}
          >
            <Field.Text
              name="firstName"
              label="First name"
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <Field.Text
              name="middleName"
              label="Middle name"
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <Field.Text
              name="lastName"
              label="Last name"
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Box>

          <Field.Text name="email" label="Email address" slotProps={{ inputLabel: { shrink: true } }} />

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
          <RHFAutocomplete name="pay_frequency" label="Pay Frequency" options={payFrequencies} />
          <RHFAutocomplete name="pay_period" label="Pay Period" options={payPeriods} />
          <RHFDatePicker name="payroll_start_date" label="Payroll Start Date" />
          <RHFTextField name="check_number" label="Check Number" />
        </>
      );

    default:
      return null;
  }
}

export default RegistrationFormContent;
