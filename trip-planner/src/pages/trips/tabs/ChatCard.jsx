import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Text, Group, Stack, Avatar, Paper, TextInput, ActionIcon, Badge } from '@mantine/core';
import { IconSend } from '@tabler/icons-react';

const ChatCard = ({ trip }) => {
  const { t } = useTranslation();
  const [message, setMessage] = useState('');

  return (
    <Card withBorder radius="md" padding={0} style={{ height: 600, display: 'flex', flexDirection: 'column' }}>
      {/* Messages */}
      <Stack gap="md" p="md" style={{ flex: 1, overflowY: 'auto' }}>
        {trip.chat.messages[0] && (
          <Badge variant="light" mx="auto">{trip.chat.messages[0].date}</Badge>
        )}

        {trip.chat.messages.map((msg) => (
          <Group key={msg.id} align="flex-start" gap="sm" wrap="nowrap">
            <Avatar src={msg.user?.avatar} size="sm" radius="xl">
              {msg.user?.name?.charAt(0)}
            </Avatar>
            <Stack gap={2} style={{ flex: 1 }}>
              <Group gap="xs">
                <Text size="sm" fw={600}>{msg.user?.name}</Text>
                <Text size="xs" c="dimmed">{msg.time}</Text>
              </Group>
              <Paper p="sm" radius="md" bg="indigo.0">
                <Text size="sm">{msg.message}</Text>
              </Paper>
            </Stack>
          </Group>
        ))}
      </Stack>

      {/* Input */}
      <Group gap="xs" p="md" style={{ borderTop: '1px solid var(--mantine-color-gray-3)' }}>
        <TextInput
          placeholder={t('chat.placeholder')}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{ flex: 1 }}
          onKeyDown={(e) => { if (e.key === 'Enter' && message.trim()) { setMessage(''); } }}
        />
        <ActionIcon size="lg" variant="filled" disabled={!message.trim()}>
          <IconSend size={18} />
        </ActionIcon>
      </Group>
    </Card>
  );
};

export default ChatCard;
