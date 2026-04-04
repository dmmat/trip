import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Text, Group, Stack, Avatar, Badge, Button } from '@mantine/core';
import { IconUserPlus } from '@tabler/icons-react';

const ParticipantsCard = ({ trip }) => {
  const { t } = useTranslation();

  return (
    <Stack gap="md">
      <Group justify="space-between">
        <Text fw={600}>{t('tabs.participants')} ({trip.participants.length})</Text>
        <Button size="sm" leftSection={<IconUserPlus size={16} />}>{t('participants.invite')}</Button>
      </Group>

      {trip.participants.map((p) => (
        <Card key={p.id} withBorder padding="md" radius="md">
          <Group justify="space-between">
            <Group gap="sm">
              <Avatar src={p.avatar} radius="xl" size="md">{p.name?.charAt(0)}</Avatar>
              <Stack gap={0}>
                <Text fw={500}>{p.name}</Text>
                <Text size="sm" c="dimmed">{p.email}</Text>
              </Stack>
            </Group>
            <Badge variant="light" color={p.role === 'organizer' ? 'indigo' : 'gray'}>
              {p.role === 'organizer' ? t('participants.organizer') : t('participants.participant')}
            </Badge>
          </Group>
        </Card>
      ))}
    </Stack>
  );
};

export default ParticipantsCard;
