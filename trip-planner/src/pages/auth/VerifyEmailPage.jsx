import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Center, Paper, Title, Text, Loader, Stack, Button, ThemeIcon } from '@mantine/core';
import { IconCheck, IconX } from '@tabler/icons-react';
import { api } from '@/services/api';

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [status, setStatus] = useState('verifying');

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) { setStatus('error'); return; }
    api.auth.verifyEmail(token).then(() => setStatus('success')).catch(() => setStatus('error'));
  }, []);

  return (
    <Center mih="100vh" p="md" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <Paper p="xl" radius="lg" shadow="xl" w={400}>
        <Stack align="center" gap="md">
          {status === 'verifying' && <><Loader size="lg" /><Text>{t('common.loading')}</Text></>}
          {status === 'success' && (
            <>
              <ThemeIcon size={60} radius="xl" color="green"><IconCheck size={32} /></ThemeIcon>
              <Title order={3}>{t('auth.verifyEmailSuccess')}</Title>
              <Button onClick={() => navigate('/trips')}>{t('nav.myTrips')}</Button>
            </>
          )}
          {status === 'error' && (
            <>
              <ThemeIcon size={60} radius="xl" color="red"><IconX size={32} /></ThemeIcon>
              <Title order={3}>{t('common.error')}</Title>
              <Button variant="light" onClick={() => navigate('/login')}>{t('auth.login')}</Button>
            </>
          )}
        </Stack>
      </Paper>
    </Center>
  );
};

export default VerifyEmailPage;
