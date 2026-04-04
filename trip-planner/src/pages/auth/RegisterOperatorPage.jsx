import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Container, Paper, Title, Text, TextInput, PasswordInput, Button,
  Checkbox, Anchor, Stack, Alert, Center, Box, Group, Textarea,
} from '@mantine/core';
import { IconAlertCircle, IconBuildingStore } from '@tabler/icons-react';
import { useAuth } from '@/context/AuthContext';
import LanguageSwitcher from '@/components/shared/LanguageSwitcher';

const RegisterOperatorPage = () => {
  const { t } = useTranslation();
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '', companyName: '', description: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.confirmPassword || !form.companyName) {
      setError(t('auth.fillAllFields')); return;
    }
    if (form.password.length < 6) { setError(t('auth.passwordMinLength')); return; }
    if (form.password !== form.confirmPassword) { setError(t('auth.passwordsNoMatch')); return; }
    setLoading(true); setError('');
    const result = await register(form.name, form.email, form.password, 'operator');
    if (!result.success) setError(result.error || t('common.error'));
    setLoading(false);
  };

  return (
    <Box mih="100vh" style={{ background: 'linear-gradient(135deg, #f97316 0%, #ec4899 100%)' }}>
      <Box pos="absolute" top={16} right={16}><LanguageSwitcher /></Box>
      <Center mih="100vh" p="md">
        <Container size={480} w="100%">
          <Center mb="xl">
            <Group gap="xs">
              <IconBuildingStore size={36} color="white" />
              <Title order={1} c="white">TripPlanner</Title>
            </Group>
          </Center>
          <Text c="white" ta="center" mb="xl" opacity={0.9} size="lg">{t('operator.registerTitle')}</Text>

          <Paper p="xl" radius="lg" shadow="xl">
            {error && (
              <Alert icon={<IconAlertCircle size={16} />} color="red" mb="md" radius="md">{error}</Alert>
            )}
            <form onSubmit={handleSubmit}>
              <Stack gap="md">
                <TextInput label={t('operator.companyName')} placeholder={t('operator.companyNamePlaceholder')} required value={form.companyName} onChange={set('companyName')} size="md" />
                <TextInput label={t('auth.name')} placeholder={t('auth.name')} required value={form.name} onChange={set('name')} size="md" />
                <TextInput label={t('auth.email')} placeholder="business@example.com" type="email" required value={form.email} onChange={set('email')} size="md" />
                <Textarea label={t('operator.description')} placeholder={t('operator.descriptionPlaceholder')} value={form.description} onChange={set('description')} minRows={3} />
                <PasswordInput label={t('auth.password')} placeholder="••••••••" required value={form.password} onChange={set('password')} size="md" />
                <PasswordInput label={t('auth.confirmPassword')} placeholder="••••••••" required value={form.confirmPassword} onChange={set('confirmPassword')} size="md" />
                <Checkbox required label={<>{t('auth.termsAgree')} <Anchor size="sm">{t('auth.termsLink')}</Anchor></>} size="sm" />
                <Button type="submit" fullWidth size="md" loading={loading} color="orange">{t('operator.registerBtn')}</Button>
              </Stack>
            </form>
            <Text ta="center" mt="lg" size="sm">
              {t('auth.hasAccount')}{' '}
              <Anchor onClick={() => navigate('/login')} fw={600}>{t('auth.login')}</Anchor>
            </Text>
          </Paper>
        </Container>
      </Center>
    </Box>
  );
};

export default RegisterOperatorPage;
