import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Modal, TextInput, Textarea, Button, Group, Stack, Badge, ActionIcon,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { IconMapPin, IconX } from '@tabler/icons-react';

const CreateTripModal = ({ onClose, onCreateTrip }) => {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: '', description: '', locations: [] });
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
    if (!form.name || !dates[0] || !dates[1]) return;
    onCreateTrip({ ...form, startDate: dates[0], endDate: dates[1] });
  };

  return (
    <Modal opened onClose={onClose} title={t('trips.createTitle')} size="lg" radius="lg" centered>
      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          <TextInput
            label={`${t('trips.name')} *`}
            placeholder={t('trips.namePlaceholder')}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            size="md"
          />

          <DatePickerInput
            type="range"
            label={`${t('trips.startDate')} — ${t('trips.endDate')}`}
            value={dates}
            onChange={setDates}
            size="md"
            required
          />

          <Textarea
            label={t('trips.description')}
            placeholder={t('trips.descriptionPlaceholder')}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            minRows={3}
          />

          <div>
            <Group gap="xs" mb="xs">
              <TextInput
                label={t('trips.locations')}
                placeholder={t('trips.locationPlaceholder')}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                style={{ flex: 1 }}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addLocation(); } }}
              />
              <Button variant="light" mt={24} onClick={addLocation}>{t('trips.addLocation')}</Button>
            </Group>
            <Group gap="xs">
              {form.locations.map((loc, i) => (
                <Badge
                  key={i}
                  variant="light"
                  size="lg"
                  leftSection={<IconMapPin size={14} />}
                  rightSection={
                    <ActionIcon size="xs" variant="transparent" onClick={() =>
                      setForm((p) => ({ ...p, locations: p.locations.filter((_, j) => j !== i) }))
                    }>
                      <IconX size={12} />
                    </ActionIcon>
                  }
                >
                  {loc}
                </Badge>
              ))}
            </Group>
          </div>

          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={onClose}>{t('common.cancel')}</Button>
            <Button type="submit">{t('trips.create')}</Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};

export default CreateTripModal;
