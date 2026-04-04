import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Center, Paper, Title, PasswordInput, Button, Stack, Alert, Anchor, Box, Group, Container } from '@mantine/core';
import { IconAlertCircle, IconCheck, IconPlane } from '@tabler/icons-react';
import { api } from '@/services/api';

const ResetPasswordPage = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) { setError(t('auth.passwordMinLength')); return; }
    if (password !== confirm) { setError(t('auth.passwordsNoMatch')); return; }
    const token = searchParams.get('token');
    if (!token) { setError(t('common.error')); return; }
    try { await api.auth.resetPassword(token, password); setSuccess(true); }
    catch (err) { setError(err.message); }
  };

  return (
    <Box mih="100vh" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <Center mih="100vh" p="md">
        <Container size={440} w="100%">
          <Center mb="xl">
            <Group gap="xs"><IconPlane size={36} color="white" /><Title order={1} c="white">TripPlanner</Title></Group>
          </Center>
          <Paper p="xl" radius="lg" shadow="xl">
            <Title order={3} ta="center" mb="lg">{t('auth.resetPasswordTitle')}</Title>
            {success ? (
              <Stack align="center" gap="md">
                <Alert icon={<IconCheck size={16} />} color="green">{t('auth.resetSuccess')}</Alert>
                <Anchor onClick={() => navigate('/login')}>{t('auth.login')}</Anchor>
              </Stack>
            ) : (
              <form onSubmit={handleSubmit}>
                <Stack gap="md">
                  {error && <Alert icon={<IconAlertCircle size={16} />} color="red">{error}</Alert>}
                  <PasswordInput label={t('auth.newPassword')} required value={password} onChange={(e) => setPassword(e.target.value)} size="md" />
                  <PasswordInput label={t('auth.confirmPassword')} required value={confirm} onChange={(e) => setConfirm(e.target.value)} size="md" />
                  <Button type="submit" fullWidth size="md">{t('auth.resetPassword')}</Button>
                </Stack>
              </form>
            )}
          </Paper>
        </Container>
      </Center>
    </Box>
  );
};

export default ResetPasswordPage;
