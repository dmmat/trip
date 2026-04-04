import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Container, Title, Card, TextInput, Textarea, Button, Group, Stack,
  NumberInput, Select, Badge, ActionIcon, Text, Divider, MultiSelect,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { IconMapPin, IconX, IconArrowLeft } from '@tabler/icons-react';

const OperatorTourCreate = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', description: '', maxParticipants: 20, price: 0,
    currency: 'UAH', locations: [], tags: [],
  });
  const [dates, setDates] = useState([null, null]);
  const [location, setLocation] = useState('');

  const addLocation = () => {
    if (location.trim()) {
      setForm((p) => ({ ...p, locations: [...p.locations, location.trim()] }));
      setLocation('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: API call
    navigate('/operator');
  };

  return (
    <Container size="md" py="lg">
      <Group mb="xl">
        <ActionIcon variant="subtle" size="lg" onClick={() => navigate('/operator')}>
          <IconArrowLeft size={20} />
        </ActionIcon>
        <Title order={2}>{t('operator.createTour')}</Title>
      </Group>

      <Card withBorder radius="lg" padding="xl">
        <form onSubmit={handleSubmit}>
          <Stack gap="lg">
            <TextInput
              label={t('operator.tourName')}
              placeholder={t('operator.tourNamePlaceholder')}
              required size="md"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <Textarea
              label={t('operator.tourDescription')}
              placeholder={t('operator.tourDescriptionPlaceholder')}
              minRows={4} value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />

            <DatePickerInput
              type="range" label={t('operator.tourDates')}
              value={dates} onChange={setDates} size="md" required
            />

            <Group grow>
              <NumberInput
                label={t('operator.tourPrice')}
                value={form.price}
                onChange={(val) => setForm({ ...form, price: val })}
                min={0} thousandSeparator=" " size="md"
              />
              <Select
                label={t('operator.currency')}
                value={form.currency}
                onChange={(val) => setForm({ ...form, currency: val })}
                data={['UAH', 'USD', 'EUR']} size="md"
              />
              <NumberInput
                label={t('operator.maxParticipants')}
                value={form.maxParticipants}
                onChange={(val) => setForm({ ...form, maxParticipants: val })}
                min={1} max={500} size="md"
              />
            </Group>

            <div>
              <Group gap="xs" mb="xs">
                <TextInput
                  label={t('trips.locations')}
                  placeholder={t('trips.locationPlaceholder')}
                  value={location} onChange={(e) => setLocation(e.target.value)}
                  style={{ flex: 1 }}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addLocation(); } }}
                />
                <Button variant="light" mt={24} onClick={addLocation}>{t('trips.addLocation')}</Button>
              </Group>
              <Group gap="xs">
                {form.locations.map((loc, i) => (
                  <Badge key={i} variant="light" size="lg" leftSection={<IconMapPin size={14} />}
                    rightSection={<ActionIcon size="xs" variant="transparent"
                      onClick={() => setForm((p) => ({ ...p, locations: p.locations.filter((_, j) => j !== i) }))}>
                      <IconX size={12} />
                    </ActionIcon>}
                  >{loc}</Badge>
                ))}
              </Group>
            </div>

            <MultiSelect
              label={t('operator.tags')}
              placeholder={t('operator.tagsPlaceholder')}
              data={['Adventure', 'Cultural', 'Beach', 'Mountain', 'City', 'Luxury', 'Budget', 'Family']}
              value={form.tags}
              onChange={(val) => setForm({ ...form, tags: val })}
              searchable clearable
            />

            <Divider />

            <Text size="sm" c="dimmed">{t('operator.integrationHint')}</Text>

            <Group justify="flex-end">
              <Button variant="default" onClick={() => navigate('/operator')}>{t('common.cancel')}</Button>
              <Button type="submit" color="orange">{t('operator.createTour')}</Button>
            </Group>
          </Stack>
        </form>
      </Card>
    </Container>
  );
};

export default OperatorTourCreate;
