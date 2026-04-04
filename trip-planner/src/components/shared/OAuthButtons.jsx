import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Group, Divider } from '@mantine/core';
import { IconBrandGoogle, IconBrandFacebook, IconBrandX } from '@tabler/icons-react';
import { useAuth } from '@/context/AuthContext';

const OAuthButtons = ({ onError }) => {
  const { t } = useTranslation();
  const { oauthLogin } = useAuth();

  const handle = async (provider) => {
    const result = await oauthLogin(provider);
    if (result && !result.success) {
      onError?.(result.error || t('auth.oauthError', { provider }));
    }
  };

  return (
    <>
      <Divider label={t('auth.continueWith')} labelPosition="center" my="lg" />
      <Group grow>
        <Button
          variant="default"
          leftSection={<IconBrandGoogle size={18} />}
          onClick={() => handle('google')}
        >
          Google
        </Button>
        <Button
          variant="default"
          leftSection={<IconBrandFacebook size={18} />}
          onClick={() => handle('facebook')}
        >
          Facebook
        </Button>
        <Button
          variant="default"
          leftSection={<IconBrandX size={18} />}
          onClick={() => handle('x')}
        >
          X
        </Button>
      </Group>
    </>
  );
};

export default OAuthButtons;
