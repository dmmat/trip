import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Text, Group, Stack, Paper, ThemeIcon, Button } from '@mantine/core';
import { IconFileText, IconUpload, IconDownload } from '@tabler/icons-react';

const categoryColors = {
  transport: 'blue', accommodation: 'green', insurance: 'violet', other: 'orange',
};

const DocsCard = ({ trip }) => {
  const { t } = useTranslation();

  const categories = [...new Set(trip.documents.map((d) => d.category))];

  return (
    <Stack gap="lg">
      <Group justify="flex-end">
        <Button size="sm" leftSection={<IconUpload size={16} />}>{t('docs.upload')}</Button>
      </Group>

      {categories.map((cat) => (
        <Stack key={cat} gap="xs">
          <Text fw={600} tt="capitalize">{cat}</Text>
          {trip.documents.filter((d) => d.category === cat).map((doc) => (
            <Paper key={doc.id} withBorder p="md" radius="md">
              <Group justify="space-between">
                <Group gap="sm">
                  <ThemeIcon variant="light" color={categoryColors[cat] || 'gray'} size="lg" radius="md">
                    <IconFileText size={18} />
                  </ThemeIcon>
                  <Stack gap={0}>
                    <Text size="sm" fw={500}>{doc.name}</Text>
                    <Text size="xs" c="dimmed">{doc.size} • {doc.addedDate}</Text>
                  </Stack>
                </Group>
                <Button variant="subtle" size="xs" leftSection={<IconDownload size={14} />}>
                  {t('docs.upload')}
                </Button>
              </Group>
            </Paper>
          ))}
        </Stack>
      ))}
    </Stack>
  );
};

export default DocsCard;
