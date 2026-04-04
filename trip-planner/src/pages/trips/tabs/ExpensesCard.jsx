import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Text, Group, Stack, Paper, Badge, Button, Divider } from '@mantine/core';
import { IconPlus, IconArrowRight } from '@tabler/icons-react';

const ExpensesCard = ({ trip }) => {
  const { t } = useTranslation();

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <Stack gap={0}>
          <Text size="sm" c="dimmed">{t('expenses.total')}</Text>
          <Text size="xl" fw={700}>{trip.expenses.total.toLocaleString()} {t('common.uah')}</Text>
        </Stack>
        <Button size="sm" leftSection={<IconPlus size={16} />}>{t('common.edit')}</Button>
      </Group>

      {trip.expenses.categories.map((cat) => (
        <Card key={cat.id} withBorder radius="md" padding="md">
          <Text fw={600} mb="sm">{cat.name}</Text>
          <Stack gap="xs">
            {cat.items.map((item) => (
              <Group key={item.id} justify="space-between">
                <Text size="sm">{item.name}</Text>
                <Stack gap={0} align="flex-end">
                  <Text size="sm" fw={600}>{item.amount.toLocaleString()} {t('common.uah')}</Text>
                  <Text size="xs" c="dimmed">{t('expenses.paid')}: {item.user?.name}</Text>
                </Stack>
              </Group>
            ))}
          </Stack>
        </Card>
      ))}

      <Divider />

      <Card withBorder radius="md" padding="md">
        <Text fw={600} mb="sm">{t('expenses.balance')}</Text>
        <Stack gap="xs">
          {trip.expenses.participants_cost?.map((p) => (
            <Group key={p.id} justify="space-between">
              <Text size="sm">{p.user?.name}</Text>
              <Group gap="md">
                <Text size="sm">{p.total_paid.toLocaleString()} {t('common.uah')}</Text>
                <Badge variant="light" color={p.balance > 0 ? 'green' : 'red'}>
                  {p.balance > 0 ? '+' : ''}{p.balance.toLocaleString()} {t('common.uah')}
                </Badge>
              </Group>
            </Group>
          ))}
        </Stack>
      </Card>

      {trip.expenses.transfers?.length > 0 && (
        <Card withBorder radius="md" padding="md">
          <Text fw={600} mb="sm">{t('expenses.transfers')}</Text>
          <Stack gap="xs">
            {trip.expenses.transfers.map((tr, i) => (
              <Group key={i} gap="xs">
                <Text size="sm">{tr.from?.name}</Text>
                <IconArrowRight size={14} />
                <Text size="sm">{tr.to?.name}</Text>
                <Badge variant="light" ml="auto">{tr.amount.toLocaleString()} {t('common.uah')}</Badge>
              </Group>
            ))}
          </Stack>
        </Card>
      )}
    </Stack>
  );
};

export default ExpensesCard;
