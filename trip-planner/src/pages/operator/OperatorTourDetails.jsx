import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Container, Title, Card, Text, Group, Button, Stack, Badge, Tabs,
  Paper, Avatar, CopyButton, ActionIcon, Tooltip, TextInput, Table,
} from '@mantine/core';
import {
  IconArrowLeft, IconLink, IconCopy, IconCheck, IconUsers,
  IconCash, IconCalendar, IconShare, IconPlus,
} from '@tabler/icons-react';

const OperatorTourDetails = () => {
  const { t } = useTranslation();
  const { tourId } = useParams();
  const navigate = useNavigate();

  // Demo data
  const tour = {
    id: tourId, name: 'Paris Adventure', status: 'active',
    dates: '15 Jul - 22 Jul 2024', price: 15000, currency: 'UAH',
    maxParticipants: 30, currentParticipants: 24,
    locations: ['Paris', 'Versailles', 'Disneyland'],
    inviteLink: `${window.location.origin}/join/abc123`,
    participants: [
      { id: '1', name: 'Maria Petrenko', email: 'maria@example.com', paid: 15000, status: 'confirmed' },
      { id: '2', name: 'Petro Ivanov', email: 'petro@example.com', paid: 10000, status: 'partial' },
      { id: '3', name: 'Olena Kovalenko', email: 'olena@example.com', paid: 15000, status: 'confirmed' },
      { id: '4', name: 'Andrii Shevchenko', email: 'andrii@example.com', paid: 0, status: 'pending' },
    ],
    expenses: [
      { name: 'Hotel booking', amount: 180000, category: 'Accommodation' },
      { name: 'Bus rental', amount: 45000, category: 'Transport' },
      { name: 'Guide services', amount: 12000, category: 'Services' },
      { name: 'Insurance', amount: 24000, category: 'Insurance' },
    ],
  };

  const totalRevenue = tour.participants.reduce((s, p) => s + p.paid, 0);
  const totalExpenses = tour.expenses.reduce((s, e) => s + e.amount, 0);

  return (
    <Container size="xl" py="lg">
      <Group mb="xl">
        <ActionIcon variant="subtle" size="lg" onClick={() => navigate('/operator')}>
          <IconArrowLeft size={20} />
        </ActionIcon>
        <Stack gap={0} style={{ flex: 1 }}>
          <Group gap="xs">
            <Title order={2}>{tour.name}</Title>
            <Badge color="green" variant="light">{tour.status}</Badge>
          </Group>
          <Group gap="lg">
            <Group gap={4}><IconCalendar size={14} /><Text size="sm" c="dimmed">{tour.dates}</Text></Group>
            <Group gap={4}><IconUsers size={14} /><Text size="sm" c="dimmed">{tour.currentParticipants}/{tour.maxParticipants}</Text></Group>
          </Group>
        </Stack>
        <Button variant="light" leftSection={<IconShare size={16} />}>{t('trips.share')}</Button>
      </Group>

      {/* Invite link */}
      <Card withBorder radius="lg" padding="md" mb="lg" bg="indigo.0">
        <Group>
          <IconLink size={20} color="var(--mantine-color-indigo-6)" />
          <Text size="sm" fw={600}>{t('operator.inviteLink')}</Text>
          <TextInput value={tour.inviteLink} readOnly style={{ flex: 1 }} size="sm" />
          <CopyButton value={tour.inviteLink}>
            {({ copied, copy }) => (
              <Tooltip label={copied ? t('common.success') : 'Copy'}>
                <ActionIcon color={copied ? 'teal' : 'indigo'} onClick={copy} variant="light">
                  {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                </ActionIcon>
              </Tooltip>
            )}
          </CopyButton>
        </Group>
      </Card>

      {/* Stats */}
      <Group grow mb="xl">
        <Card withBorder radius="lg" padding="lg">
          <Text size="xs" c="dimmed" tt="uppercase" fw={600}>{t('operator.revenue')}</Text>
          <Text size="xl" fw={700} c="green">₴ {totalRevenue.toLocaleString()}</Text>
        </Card>
        <Card withBorder radius="lg" padding="lg">
          <Text size="xs" c="dimmed" tt="uppercase" fw={600}>{t('operator.totalExpenses')}</Text>
          <Text size="xl" fw={700} c="red">₴ {totalExpenses.toLocaleString()}</Text>
        </Card>
        <Card withBorder radius="lg" padding="lg">
          <Text size="xs" c="dimmed" tt="uppercase" fw={600}>{t('operator.profit')}</Text>
          <Text size="xl" fw={700} c={totalRevenue - totalExpenses >= 0 ? 'green' : 'red'}>
            ₴ {(totalRevenue - totalExpenses).toLocaleString()}
          </Text>
        </Card>
      </Group>

      <Tabs defaultValue="participants" variant="pills" radius="md">
        <Tabs.List mb="lg">
          <Tabs.Tab value="participants" leftSection={<IconUsers size={16} />}>{t('tabs.participants')}</Tabs.Tab>
          <Tabs.Tab value="expenses" leftSection={<IconCash size={16} />}>{t('tabs.expenses')}</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="participants">
          <Card withBorder radius="lg">
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>{t('auth.name')}</Table.Th>
                  <Table.Th>{t('auth.email')}</Table.Th>
                  <Table.Th>{t('expenses.paid')}</Table.Th>
                  <Table.Th>Status</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {tour.participants.map((p) => (
                  <Table.Tr key={p.id}>
                    <Table.Td>
                      <Group gap="xs">
                        <Avatar size="sm" radius="xl" color="indigo">{p.name.charAt(0)}</Avatar>
                        <Text size="sm">{p.name}</Text>
                      </Group>
                    </Table.Td>
                    <Table.Td><Text size="sm" c="dimmed">{p.email}</Text></Table.Td>
                    <Table.Td><Text size="sm" fw={500}>₴ {p.paid.toLocaleString()}</Text></Table.Td>
                    <Table.Td>
                      <Badge variant="light" size="sm"
                        color={p.status === 'confirmed' ? 'green' : p.status === 'partial' ? 'yellow' : 'gray'}>
                        {p.status}
                      </Badge>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Card>
        </Tabs.Panel>

        <Tabs.Panel value="expenses">
          <Card withBorder radius="lg">
            <Group justify="flex-end" mb="md">
              <Button size="sm" variant="light" leftSection={<IconPlus size={14} />}>
                {t('operator.addExpense')}
              </Button>
            </Group>
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>{t('auth.name')}</Table.Th>
                  <Table.Th>{t('operator.category')}</Table.Th>
                  <Table.Th>{t('operator.amount')}</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {tour.expenses.map((e, i) => (
                  <Table.Tr key={i}>
                    <Table.Td><Text size="sm">{e.name}</Text></Table.Td>
                    <Table.Td><Badge variant="light" size="sm">{e.category}</Badge></Table.Td>
                    <Table.Td><Text size="sm" fw={500}>₴ {e.amount.toLocaleString()}</Text></Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Card>
        </Tabs.Panel>
      </Tabs>
    </Container>
  );
};

export default OperatorTourDetails;
