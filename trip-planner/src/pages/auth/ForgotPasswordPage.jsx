import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Center, Paper, Title, TextInput, Button, Stack, Alert, Text, Anchor, Box, Group, Container } from '@mantine/core';
import { IconAlertCircle, IconCheck, IconPlane } from '@tabler/icons-react';
import { api } from '@/services/api';

const ForgotPasswordPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    try { await api.auth.forgotPassword(email); setSent(true); }
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
            {sent ? (
              <Stack align="center" gap="md">
                <Alert icon={<IconCheck size={16} />} color="green">{t('auth.resetSent')}</Alert>
                <Anchor onClick={() => navigate('/login')}>{t('auth.login')}</Anchor>
              </Stack>
            ) : (
              <form onSubmit={handleSubmit}>
                <Stack gap="md">
                  {error && <Alert icon={<IconAlertCircle size={16} />} color="red">{error}</Alert>}
                  <TextInput label={t('auth.email')} type="email" required value={email} onChange={(e) => setEmail(e.target.value)} size="md" />
                  <Button type="submit" fullWidth size="md">{t('auth.resetPassword')}</Button>
                  <Text ta="center" size="sm"><Anchor onClick={() => navigate('/login')}>{t('auth.login')}</Anchor></Text>
                </Stack>
              </form>
            )}
          </Paper>
        </Container>
      </Center>
    </Box>
  );
};

export default ForgotPasswordPage;
