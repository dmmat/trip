import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Container, Card, Title, TextInput, Button, Group, Stack, Avatar,
  FileButton, Select, Text, Alert,
} from '@mantine/core';
import { IconCamera, IconAlertCircle } from '@tabler/icons-react';
import { useAuth } from '@/context/AuthContext';

const ProfilePage = () => {
  const { t, i18n } = useTranslation();
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '', email: user?.email || '',
    phone: user?.phone || '', location: user?.location || '',
    avatar: user?.avatar || null,
  });
  const [error, setError] = useState('');

  const set = (field) => (e) => setForm({ ...form, [field]: typeof e === 'string' ? e : e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email) { setError(t('profile.fillRequired')); return; }
    await updateUser(form);
    setEditing(false);
  };

  const handleAvatar = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setForm((p) => ({ ...p, avatar: reader.result }));
    reader.readAsDataURL(file);
  };

  const handleLang = (val) => {
    i18n.changeLanguage(val);
    localStorage.setItem('language', val);
  };

  return (
    <Container size="sm" py="xl">
      <Card withBorder radius="lg" padding="xl">
        <Group justify="space-between" mb="xl">
          <Title order={3}>{t('profile.title')}</Title>
          {!editing && <Button variant="light" onClick={() => setEditing(true)}>{t('profile.edit')}</Button>}
        </Group>

        {error && <Alert icon={<IconAlertCircle size={16} />} color="red" mb="md">{error}</Alert>}

        <Group mb="xl" align="flex-start" wrap="wrap">
          <Stack align="center" gap="xs">
            <div style={{ position: 'relative' }}>
              <Avatar src={form.avatar} size={120} radius="xl" color="indigo">
                {user?.name?.charAt(0)?.toUpperCase()}
              </Avatar>
              {editing && (
                <FileButton onChange={handleAvatar} accept="image/*">
                  {(props) => (
                    <Button {...props} size="compact-xs" radius="xl"
                      style={{ position: 'absolute', bottom: 0, right: 0 }}
                    >
                      <IconCamera size={14} />
                    </Button>
                  )}
                </FileButton>
              )}
            </div>
            <Text fw={600}>{user?.name}</Text>
            <Text size="sm" c="dimmed">{user?.email}</Text>
          </Stack>

          <Stack style={{ flex: 1 }} gap="md">
            <form onSubmit={handleSubmit}>
              <Stack gap="md">
                <TextInput label={t('profile.nameRequired')} value={form.name} onChange={set('name')} disabled={!editing} required />
                <TextInput label={t('profile.emailRequired')} type="email" value={form.email} onChange={set('email')} disabled={!editing} required />
                <TextInput label={t('profile.phone')} value={form.phone} onChange={set('phone')} disabled={!editing} />
                <TextInput label={t('profile.city')} value={form.location} onChange={set('location')} disabled={!editing} />
                <Select label={t('profile.language')} value={i18n.language} onChange={handleLang}
                  data={[{ value: 'uk', label: 'Українська' }, { value: 'en', label: 'English' }]}
                />
                {editing && (
                  <Group justify="flex-end">
                    <Button variant="default" onClick={() => { setEditing(false); setForm({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '', location: user?.location || '', avatar: user?.avatar || null }); }}>
                      {t('common.cancel')}
                    </Button>
                    <Button type="submit">{t('profile.save')}</Button>
                  </Group>
                )}
              </Stack>
            </form>
          </Stack>
        </Group>
      </Card>
    </Container>
  );
};

export default ProfilePage;
