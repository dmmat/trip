import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Center, Paper, Stack, Title, Text, Button, Loader, ThemeIcon } from '@mantine/core';
import { IconCheck, IconX, IconPlane } from '@tabler/icons-react';
import { useAuth } from '@/context/AuthContext';

const JoinTripPage = () => {
  const { inviteCode } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [status, setStatus] = useState('loading'); // loading, needLogin, success, error

  useEffect(() => {
    if (!user) {
      setStatus('needLogin');
      return;
    }
    // TODO: call API to join trip with invite code
    // For now, simulate success
    setTimeout(() => setStatus('success'), 1000);
  }, [user, inviteCode]);

  return (
    <Center mih="100vh" p="md" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <Paper p="xl" radius="lg" shadow="xl" w={420}>
        <Stack align="center" gap="lg">
          {status === 'loading' && <><Loader size="lg" /><Text>{t('common.loading')}</Text></>}
          {status === 'needLogin' && (
            <>
              <ThemeIcon size={60} radius="xl" variant="light"><IconPlane size={30} /></ThemeIcon>
              <Title order={3} ta="center">{t('invite.loginRequired')}</Title>
              <Text c="dimmed" ta="center">{t('invite.loginRequiredDesc')}</Text>
              <Group>
                <Button onClick={() => navigate(`/login?redirect=/join/${inviteCode}`)}>{t('auth.login')}</Button>
                <Button variant="light" onClick={() => navigate(`/register?redirect=/join/${inviteCode}`)}>{t('auth.register')}</Button>
              </Group>
            </>
          )}
          {status === 'success' && (
            <>
              <ThemeIcon size={60} radius="xl" color="green"><IconCheck size={30} /></ThemeIcon>
              <Title order={3}>{t('invite.success')}</Title>
              <Button onClick={() => navigate('/trips')}>{t('nav.myTrips')}</Button>
            </>
          )}
          {status === 'error' && (
            <>
              <ThemeIcon size={60} radius="xl" color="red"><IconX size={30} /></ThemeIcon>
              <Title order={3}>{t('invite.error')}</Title>
              <Button variant="light" onClick={() => navigate('/trips')}>{t('nav.myTrips')}</Button>
            </>
          )}
        </Stack>
      </Paper>
    </Center>
  );
};

export default JoinTripPage;
