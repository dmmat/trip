import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Container, Title, SimpleGrid, Card, Text, Group, Button, Stack,
  ThemeIcon, Badge, Paper, RingProgress, Center,
} from '@mantine/core';
import {
  IconPlus, IconPlane, IconUsers, IconCash, IconLink,
  IconChartBar, IconCalendar,
} from '@tabler/icons-react';

const OperatorDashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Demo data
  const stats = [
    { icon: IconPlane, label: t('operator.statTours'), value: '12', color: 'indigo' },
    { icon: IconUsers, label: t('operator.statClients'), value: '148', color: 'teal' },
    { icon: IconCash, label: t('operator.statRevenue'), value: '₴ 245,000', color: 'green' },
    { icon: IconLink, label: t('operator.statInvites'), value: '34', color: 'orange' },
  ];

  const recentTours = [
    { id: '1', name: 'Paris Adventure', clients: 24, dates: '15 Jul - 22 Jul 2024', status: 'active', revenue: 120000 },
    { id: '2', name: 'Carpathian Retreat', clients: 18, dates: '10 Aug - 15 Aug 2024', status: 'active', revenue: 85000 },
    { id: '3', name: 'Istanbul Express', clients: 32, dates: '5 Sep - 10 Sep 2024', status: 'draft', revenue: 0 },
  ];

  return (
    <Container size="xl" py="lg">
      <Group justify="space-between" mb="xl">
        <Stack gap={0}>
          <Title order={2}>{t('operator.dashboard')}</Title>
          <Text c="dimmed">{t('operator.dashboardDesc')}</Text>
        </Stack>
        <Button leftSection={<IconPlus size={18} />} color="orange" onClick={() => navigate('/operator/tours/new')}>
          {t('operator.createTour')}
        </Button>
      </Group>

      {/* Stats */}
      <SimpleGrid cols={{ base: 2, md: 4 }} mb="xl">
        {stats.map((s) => (
          <Card key={s.label} withBorder padding="lg" radius="lg">
            <Group justify="space-between">
              <Stack gap={0}>
                <Text size="xs" c="dimmed" tt="uppercase" fw={600}>{s.label}</Text>
                <Text size="xl" fw={700}>{s.value}</Text>
              </Stack>
              <ThemeIcon size={44} radius="md" variant="light" color={s.color}>
                <s.icon size={24} />
              </ThemeIcon>
            </Group>
          </Card>
        ))}
      </SimpleGrid>

      {/* Recent tours */}
      <Card withBorder radius="lg" padding="lg">
        <Group justify="space-between" mb="md">
          <Text fw={600} size="lg">{t('operator.recentTours')}</Text>
        </Group>
        <Stack gap="sm">
          {recentTours.map((tour) => (
            <Paper key={tour.id} withBorder p="md" radius="md"
              style={{ cursor: 'pointer' }}
              onClick={() => navigate(`/operator/tours/${tour.id}`)}
            >
              <Group justify="space-between" wrap="wrap">
                <Stack gap={2}>
                  <Group gap="xs">
                    <Text fw={600}>{tour.name}</Text>
                    <Badge variant="light" color={tour.status === 'active' ? 'green' : 'gray'} size="sm">
                      {tour.status}
                    </Badge>
                  </Group>
                  <Group gap="lg">
                    <Group gap={4}><IconCalendar size={14} color="var(--mantine-color-dimmed)" /><Text size="sm" c="dimmed">{tour.dates}</Text></Group>
                    <Group gap={4}><IconUsers size={14} color="var(--mantine-color-dimmed)" /><Text size="sm" c="dimmed">{tour.clients} {t('operator.clients')}</Text></Group>
                  </Group>
                </Stack>
                <Text fw={700} c={tour.revenue > 0 ? 'green' : 'dimmed'}>
                  {tour.revenue > 0 ? `₴ ${tour.revenue.toLocaleString()}` : '—'}
                </Text>
              </Group>
            </Paper>
          ))}
        </Stack>
      </Card>
    </Container>
  );
};

export default OperatorDashboard;
