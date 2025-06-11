import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import RegisterPage from 'src/auth/view/my-auth/register/RegisterPage';

// ----------------------------------------------------------------------

const metadata = { title: `Sign up | Jwt - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <RegisterPage />

    </>
  );
}
