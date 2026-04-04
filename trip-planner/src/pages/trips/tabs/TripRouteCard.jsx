import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Text, Group, Stack, ThemeIcon, Badge, Button, Paper } from '@mantine/core';
import { IconMapPin, IconClock, IconPlus } from '@tabler/icons-react';

const TripRouteCard = ({ trip }) => {
  const { t } = useTranslation();

  return (
    <Stack gap="md">
      {trip.locations.map((location, index) => (
        <Paper key={location.id} withBorder p="lg" radius="md">
          <Group align="flex-start" gap="md">
            <ThemeIcon size={36} radius="xl" variant="light">
              {index + 1}
            </ThemeIcon>
            <Stack gap="xs" style={{ flex: 1 }}>
              <Group justify="space-between">
                <Text fw={600} size="lg">{location.name}</Text>
                <Badge variant="light" leftSection={<IconMapPin size={12} />}>
                  {location.country}
                </Badge>
              </Group>
              <Group gap="xs" c="dimmed">
                <IconClock size={14} />
                <Text size="sm">{t('route.duration')}: {location.duration}</Text>
              </Group>
            </Stack>
          </Group>
        </Paper>
      ))}
      <Button variant="default" fullWidth leftSection={<IconPlus size={16} />} style={{ borderStyle: 'dashed' }}>
        {t('trips.addLocation')}
      </Button>
    </Stack>
  );
};

export default TripRouteCard;
