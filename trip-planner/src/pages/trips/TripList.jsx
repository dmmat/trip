import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Container, Title, Button, Group, SimpleGrid, Card, Text, Badge,
  Stack, Avatar, ThemeIcon,
} from '@mantine/core';
import { IconPlus, IconUsers, IconMapPin, IconWallet, IconCalendar } from '@tabler/icons-react';
import CreateTripModal from '@/components/CreateTripModal';
import { trips_data } from '@/data/trips';
import { TripMapper } from '@/lib/mappers';

const data_trips = TripMapper(trips_data);

const TripList = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [trips] = useState(data_trips);
  const [showCreate, setShowCreate] = useState(false);

  return (
    <Container size="xl" py="lg">
      <Group justify="space-between" mb="xl">
        <Title order={2}>{t('trips.title')}</Title>
        <Button leftSection={<IconPlus size={18} />} onClick={() => setShowCreate(true)}>
          {t('trips.create')}
        </Button>
      </Group>

      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
        {trips.map((trip) => (
          <Card
            key={trip.id}
            padding="lg"
            withBorder
            shadow="sm"
            radius="lg"
            style={{ cursor: 'pointer', transition: 'transform 150ms ease, box-shadow 150ms ease' }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--mantine-shadow-lg)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
            onClick={() => navigate(`/trips/${trip.id}`)}
          >
            <Stack gap="sm">
              <Group justify="space-between">
                <Text fw={700} size="lg" lineClamp={1}>{trip.name}</Text>
                <Badge variant="light" color={trip.status === 'active' ? 'green' : 'gray'}>
                  {trip.status}
                </Badge>
              </Group>

              <Group gap="xs" c="dimmed">
                <IconCalendar size={16} />
                <Text size="sm">{trip.dates_text}</Text>
              </Group>

              <Group gap="xs" c="dimmed">
                <IconMapPin size={16} />
                <Text size="sm" lineClamp={1}>{trip.allLocations.join(' → ')}</Text>
              </Group>

              <Group justify="space-between" mt="xs">
                <Group gap="xs">
                  <Avatar.Group spacing="sm">
                    {trip.participants?.slice(0, 3).map((p) => (
                      <Avatar key={p.id} src={p.avatar} size="sm" radius="xl">{p.name?.charAt(0)}</Avatar>
                    ))}
                    {trip.totalParticipants > 3 && (
                      <Avatar size="sm" radius="xl" color="indigo">+{trip.totalParticipants - 3}</Avatar>
                    )}
                  </Avatar.Group>
                  <Text size="xs" c="dimmed">{trip.totalParticipants} {t('trips.participants')}</Text>
                </Group>
                <Group gap={4}>
                  <IconWallet size={16} color="var(--mantine-color-dimmed)" />
                  <Text size="sm" fw={600}>{trip.totalExpenses.toLocaleString()} {t('common.uah')}</Text>
                </Group>
              </Group>
            </Stack>
          </Card>
        ))}
      </SimpleGrid>

      {showCreate && (
        <CreateTripModal
          onClose={() => setShowCreate(false)}
          onCreateTrip={() => setShowCreate(false)}
        />
      )}
    </Container>
  );
};

export default TripList;
