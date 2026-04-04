import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Container, Title, Text, Group, Tabs, Card, Stack, Badge, Button, Alert, Grid,
} from '@mantine/core';
import {
  IconMap2, IconUsers, IconWallet, IconCalendar, IconFileText,
  IconMessage, IconEdit, IconShare, IconInfoCircle, IconCloud,
} from '@tabler/icons-react';
import { trips_data } from '@/data/trips';
import { TripMapper } from '@/lib/mappers';
import TripRouteCard from './tabs/TripRouteCard';
import ParticipantsCard from './tabs/ParticipantsCard';
import ExpensesCard from './tabs/ExpensesCard';
import ScheduleCard from './tabs/SheduleCard';
import DocsCard from './tabs/DocsCard';
import ChatCard from './tabs/ChatCard';

const data_trips = TripMapper(trips_data);

const TripDetails = () => {
  const { t } = useTranslation();
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);

  useEffect(() => {
    setTrip(data_trips.find((t) => t.id === tripId));
  }, [tripId]);

  if (!trip) return <Container py="xl"><Text>{t('trips.loading')}</Text></Container>;

  return (
    <Container size="xl" py="lg">
      {/* Header */}
      <Group justify="space-between" mb="lg" wrap="wrap">
        <Stack gap={4}>
          <Title order={2}>{trip.name}</Title>
          <Group gap="xs">
            <IconCalendar size={16} color="var(--mantine-color-dimmed)" />
            <Text c="dimmed">{trip.dates_text}</Text>
            <Badge variant="light" color="green">{trip.status}</Badge>
          </Group>
        </Stack>
        <Group>
          <Button variant="light" leftSection={<IconEdit size={16} />}>{t('trips.edit')}</Button>
          <Button variant="light" color="teal" leftSection={<IconShare size={16} />}>{t('trips.share')}</Button>
        </Group>
      </Group>

      <Grid gutter="lg">
        {/* Main content */}
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Tabs defaultValue="route" variant="pills" radius="md">
            <Tabs.List mb="lg" style={{ gap: 4 }}>
              <Tabs.Tab value="route" leftSection={<IconMap2 size={16} />}>{t('tabs.route')}</Tabs.Tab>
              <Tabs.Tab value="participants" leftSection={<IconUsers size={16} />}>{t('tabs.participants')}</Tabs.Tab>
              <Tabs.Tab value="expenses" leftSection={<IconWallet size={16} />}>{t('tabs.expenses')}</Tabs.Tab>
              <Tabs.Tab value="schedule" leftSection={<IconCalendar size={16} />}>{t('tabs.schedule')}</Tabs.Tab>
              <Tabs.Tab value="docs" leftSection={<IconFileText size={16} />}>{t('tabs.docs')}</Tabs.Tab>
              <Tabs.Tab value="chat" leftSection={<IconMessage size={16} />}>{t('tabs.chat')}</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="route"><TripRouteCard trip={trip} /></Tabs.Panel>
            <Tabs.Panel value="participants"><ParticipantsCard trip={trip} /></Tabs.Panel>
            <Tabs.Panel value="expenses"><ExpensesCard trip={trip} /></Tabs.Panel>
            <Tabs.Panel value="schedule"><ScheduleCard trip={trip} /></Tabs.Panel>
            <Tabs.Panel value="docs"><DocsCard trip={trip} /></Tabs.Panel>
            <Tabs.Panel value="chat"><ChatCard trip={trip} /></Tabs.Panel>
          </Tabs>
        </Grid.Col>

        {/* Sidebar */}
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Stack gap="lg">
            <Card withBorder radius="lg" padding="lg">
              <Group mb="sm" gap="xs">
                <IconInfoCircle size={18} color="var(--mantine-color-indigo-6)" />
                <Text fw={600}>{t('details.importantInfo')}</Text>
              </Group>
              <Stack gap="md">
                <div>
                  <Text size="xs" c="dimmed" tt="uppercase" fw={600}>{t('details.nextEvent')}</Text>
                  <Text fw={500}>{trip.importantInfo.nextEvent.title}</Text>
                  <Text size="sm" c="dimmed">{trip.importantInfo.nextEvent.date}, {trip.importantInfo.nextEvent.time}</Text>
                </div>
                <div>
                  <Text size="xs" c="dimmed" tt="uppercase" fw={600}>{t('details.weather')}</Text>
                  <Group gap="xs">
                    <IconCloud size={16} />
                    <Text>{trip.importantInfo.weather.location}: {trip.importantInfo.weather.temperature}°C, {trip.importantInfo.weather.condition}</Text>
                  </Group>
                </div>
                {trip.importantInfo.alerts.map((alert, i) => (
                  <Alert key={i} color={alert.type === 'warning' ? 'yellow' : 'blue'} radius="md">
                    {alert.message}
                  </Alert>
                ))}
              </Stack>
            </Card>

            <Card withBorder radius="lg" padding="lg">
              <Text fw={600} mb="sm">{t('details.documents')}</Text>
              <Stack gap="xs">
                {trip.documents.slice(0, 3).map((doc) => (
                  <Group key={doc.id} gap="xs" style={{ cursor: 'pointer' }} p="xs" className="hover-bg">
                    <IconFileText size={16} color="var(--mantine-color-dimmed)" />
                    <Text size="sm">{doc.name}</Text>
                  </Group>
                ))}
              </Stack>
            </Card>
          </Stack>
        </Grid.Col>
      </Grid>
    </Container>
  );
};

export default TripDetails;
