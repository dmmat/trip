import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Center, Loader, Text, Stack, Anchor } from '@mantine/core';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from 'react-i18next';

const OAuthCallback = () => {
  const { provider } = useParams();
  const [searchParams] = useSearchParams();
  const { oauthCallback } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [error, setError] = useState('');

  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    if (!code || !state) { setError(t('auth.oauthError', { provider })); return; }
    oauthCallback(provider, code, state).then((r) => {
      if (r.success) navigate('/trips', { replace: true });
      else setError(r.error || t('auth.oauthError', { provider }));
    });
  }, []);

  return (
    <Center mih="100vh">
      <Stack align="center">
        {error ? (
          <>
            <Text c="red">{error}</Text>
            <Anchor onClick={() => navigate('/login')}>{t('auth.login')}</Anchor>
          </>
        ) : (
          <>
            <Loader size="lg" />
            <Text c="dimmed">{t('common.loading')}</Text>
          </>
        )}
      </Stack>
    </Center>
  );
};

export default OAuthCallback;
