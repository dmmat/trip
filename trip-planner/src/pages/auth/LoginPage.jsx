import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Container, Paper, Title, Text, TextInput, PasswordInput, Button,
  Checkbox, Group, Anchor, Stack, Alert, Center, Box,
} from '@mantine/core';
import { IconAlertCircle, IconPlane } from '@tabler/icons-react';
import { useAuth } from '@/context/AuthContext';
import OAuthButtons from '@/components/shared/OAuthButtons';
import LanguageSwitcher from '@/components/shared/LanguageSwitcher';

const LoginPage = () => {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) { setError(t('auth.fillAllFields')); return; }
    setLoading(true);
    setError('');
    const result = await login(email, password);
    if (!result.success) setError(result.error || t('auth.invalidCredentials'));
    setLoading(false);
  };

  return (
    <Box mih="100vh" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <Box pos="absolute" top={16} right={16}>
        <LanguageSwitcher />
      </Box>
      <Center mih="100vh" p="md">
        <Container size={440} w="100%">
          <Center mb="xl">
            <Group gap="xs">
              <IconPlane size={36} color="white" />
              <Title order={1} c="white">TripPlanner</Title>
            </Group>
          </Center>
          <Text c="white" ta="center" mb="xl" opacity={0.9}>{t('auth.loginTitle')}</Text>

          <Paper p="xl" radius="lg" shadow="xl">
            {error && (
              <Alert icon={<IconAlertCircle size={16} />} color="red" mb="md" radius="md">
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <Stack gap="md">
                <TextInput
                  label={t('auth.email')}
                  placeholder="you@example.com"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  size="md"
                />
                <PasswordInput
                  label={t('auth.password')}
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  size="md"
                />
                <Group justify="space-between">
                  <Checkbox label={t('auth.rememberMe')} size="sm" />
                  <Anchor size="sm" onClick={() => navigate('/forgot-password')}>
                    {t('auth.forgotPassword')}
                  </Anchor>
                </Group>
                <Button type="submit" fullWidth size="md" loading={loading}>
                  {t('auth.login')}
                </Button>
              </Stack>
            </form>

            <OAuthButtons onError={setError} />

            <Text ta="center" mt="lg" size="sm">
              {t('auth.noAccount')}{' '}
              <Anchor onClick={() => navigate('/register')} fw={600}>
                {t('auth.register')}
              </Anchor>
            </Text>
          </Paper>
        </Container>
      </Center>
    </Box>
  );
};

export default LoginPage;
