

import _ from 'lodash';
import { useState, useCallback } from 'react';

import { Box, Step, Card, Stack, Stepper, StepLabel, Typography, CardContent, Checkbox, FormControlLabel } from '@mui/material';

import { useRouter } from 'src/routes/hooks';

import { toast } from 'src/components/snackbar';

import { StepIndex } from './types';
import RegistrationForm from './RegistrationForm';

import type { PayrollDetails, UserInformation, CompanyInformation, RegistrationFormData } from './types';

const REGISTRATION_STEPS = ['Company Information', 'User Details', 'Payroll Details', 'Review & Submit'];

export default function RegisterPage() {
  const [currentStep, setCurrentStep] = useState<StepIndex>(StepIndex.CompanyInfo);
  const [formData, setFormData] = useState<Partial<RegistrationFormData>>({});

  const router = useRouter();

  const goToNextStep = () =>
    setCurrentStep((prevStep) => Math.min(prevStep + 1, StepIndex.Summary));

  const goToPreviousStep = () =>
    setCurrentStep((prevStep) => Math.max(prevStep - 1, StepIndex.CompanyInfo));

  const handleStepSubmit = useCallback(
    async (stepData: CompanyInformation | UserInformation | PayrollDetails) => {
      switch (currentStep) {
        case StepIndex.CompanyInfo:
          setFormData((prev) => ({ ...prev, companyInfo: stepData as CompanyInformation }));
          goToNextStep();
          break;

        case StepIndex.UserInfo:
          setFormData((prev) => ({ ...prev, userInfo: stepData as UserInformation }));
          goToNextStep();
          break;

        case StepIndex.Payroll:
          if (formData.companyInfo && formData.userInfo) {
            setFormData((prev) => ({ ...prev, payrollInfo: stepData as PayrollDetails }));
            goToNextStep();
          }
          break;
          
        case StepIndex.Summary:
          // Final submission logic
          if (formData.companyInfo && formData.userInfo && formData.payrollInfo) {
            // Submit the complete registration data
            toast.success('Registration submitted successfully!');
            // Redirect to login or dashboard
            router.push('/auth/login');
          }
          break;

        default:
          toast.error('Invalid step.');
      }
    },
    [currentStep, formData.companyInfo, formData.userInfo]
  );

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        bgcolor: 'background.default',
      }}
    >
      <Card sx={{ width: '100%', maxWidth: 700 }}>
        <CardContent>
          <Stack spacing={4}>
            <Typography variant="h5" textAlign="center">
              Register
            </Typography>

            <Stepper activeStep={currentStep} alternativeLabel>
              {_.map(REGISTRATION_STEPS, (label: any) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            <RegistrationForm
              activeStep={currentStep}
              onBack={goToPreviousStep}
              onSubmit={handleStepSubmit}
            />
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
