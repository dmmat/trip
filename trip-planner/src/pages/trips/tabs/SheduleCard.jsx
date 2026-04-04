import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Text, Group, Stack, Badge, Paper, Button, Timeline } from '@mantine/core';
import { IconPlus, IconClock } from '@tabler/icons-react';
import { dateFormatter } from '@/lib/utils';

const typeColors = {
  transport: 'blue', accommodation: 'green', sightseeing: 'violet',
  food: 'yellow', culture: 'red', leisure: 'indigo',
  entertainment: 'pink', shopping: 'orange', activity: 'teal',
};

const ScheduleCard = ({ trip }) => {
  const { t } = useTranslation();

  return (
    <Stack gap="xl">
      {trip.schedule.days.map((day) => (
        <Card key={day.id} withBorder radius="md" padding="lg">
          <Group justify="space-between" mb="md">
            <Group gap="xs">
              <Badge size="lg" variant="filled">{t('schedule.day')} {day.id}</Badge>
              <Text fw={600}>{dateFormatter(day.date)}</Text>
              <Text c="dimmed">— {day.location}</Text>
            </Group>
          </Group>

          <Timeline active={-1} bulletSize={28} lineWidth={2}>
            {day.events.map((event) => (
              <Timeline.Item
                key={event.id}
                bullet={<IconClock size={14} />}
                title={
                  <Group gap="xs">
                    <Text fw={600} size="sm">{event.time}</Text>
                    <Text fw={500}>{event.title}</Text>
                  </Group>
                }
              >
                <Text size="sm" c="dimmed" mt={2}>{event.description}</Text>
                <Group gap="xs" mt="xs">
                  <Badge size="sm" variant="light" color={typeColors[event.type] || 'gray'}>
                    {event.type}
                  </Badge>
                  <Text size="xs" c="dimmed">{event.duration}</Text>
                  <Text size="xs" c="dimmed">{event.location}</Text>
                </Group>
              </Timeline.Item>
            ))}
          </Timeline>
        </Card>
      ))}

      <Button variant="default" fullWidth leftSection={<IconPlus size={16} />} style={{ borderStyle: 'dashed' }}>
        {t('trips.addLocation')}
      </Button>
    </Stack>
  );
};

export default ScheduleCard;
