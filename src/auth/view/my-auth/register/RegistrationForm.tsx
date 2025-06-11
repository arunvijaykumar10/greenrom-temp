import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Stack, Button } from '@mui/material';

import { Form } from 'src/components/hook-form';
import { Scrollbar } from 'src/components/scrollbar';

import { StepIndex } from './types';
import RegistrationFormContent from './RegistrationFormContent';
import makeRegisterValidation from './makeRegistrationValidation';

interface FormProps {
  activeStep: StepIndex;
  onBack: () => void;
  onSubmit: (data: any) => Promise<void>;
}

export const RegistrationForm = ({ activeStep, onBack, onSubmit }: FormProps) => {
  const schema = makeRegisterValidation(activeStep);
  const [isUserVerified, setIsUserVerified] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  const methods = useForm({
    resolver: zodResolver(schema),
    mode: 'onChange',
  });

  const { handleSubmit } = methods;

  const onValid = async (data: any) => {
    const formData = methods.getValues();
    await onSubmit(formData);
  };

  return (
    <Form methods={methods} onSubmit={handleSubmit(onValid)}>
      <Scrollbar>
        <Stack spacing={3} py={3}>
          <RegistrationFormContent activeStep={activeStep} isUserVerfied={isUserVerified} setIsUserVerified={setIsUserVerified} isOtpVerified={isOtpVerified} setIsOtpVerified={setIsOtpVerified} />

          <Stack direction="row" justifyContent="space-between">
            <Button
              variant="contained"
              onClick={onBack}
              disabled={activeStep === StepIndex.CompanyInfo}
            >
              Back
            </Button>
            <Button variant="contained" type="submit"
              onClick={onValid}
              disabled={activeStep === StepIndex.UserInfo && (!isUserVerified || !isOtpVerified)}
            >
              Next
            </Button>
          </Stack>
        </Stack>
      </Scrollbar>
    </Form>
  );
};

export default RegistrationForm;
