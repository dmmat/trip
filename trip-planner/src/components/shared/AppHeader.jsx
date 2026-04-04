import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Group, Text, UnstyledButton, Menu, Avatar, ActionIcon, Badge, Container,
} from '@mantine/core';
import {
  IconBell, IconUser, IconLogout, IconChevronDown, IconPlane, IconBuildingStore,
} from '@tabler/icons-react';
import LanguageSwitcher from './LanguageSwitcher';

const AppHeader = ({ user, onLogout }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isOperator = user?.role === 'operator';

  return (
    <Container size="xl" h="100%">
      <Group h="100%" justify="space-between">
        <UnstyledButton component={Link} to={isOperator ? '/operator' : '/trips'}>
          <Group gap="xs">
            <IconPlane size={28} color="var(--mantine-color-indigo-6)" />
            <Text size="xl" fw={800} c="indigo.6">TripPlanner</Text>
            {isOperator && (
              <Badge variant="light" color="orange" size="sm">
                {t('operator.badge')}
              </Badge>
            )}
          </Group>
        </UnstyledButton>

        <Group gap="sm">
          <LanguageSwitcher />

          <ActionIcon variant="subtle" color="gray" size="lg" title={t('nav.notifications')}>
            <IconBell size={20} />
          </ActionIcon>

          <Menu shadow="lg" width={220} position="bottom-end" withArrow arrowPosition="center">
            <Menu.Target>
              <UnstyledButton>
                <Group gap="xs">
                  <Avatar src={user?.avatar} alt={user?.name} radius="xl" size="sm" color="indigo">
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </Avatar>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <Text size="sm" fw={500} lh={1.2}>{user?.name}</Text>
                    <Text size="xs" c="dimmed" lh={1.2}>{user?.email}</Text>
                  </div>
                  <IconChevronDown size={14} color="var(--mantine-color-dimmed)" />
                </Group>
              </UnstyledButton>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item leftSection={<IconUser size={16} />} onClick={() => navigate('/profile')}>
                {t('nav.profile')}
              </Menu.Item>
              {isOperator && (
                <Menu.Item leftSection={<IconBuildingStore size={16} />} onClick={() => navigate('/operator')}>
                  {t('operator.dashboard')}
                </Menu.Item>
              )}
              <Menu.Divider />
              <Menu.Item color="red" leftSection={<IconLogout size={16} />} onClick={onLogout}>
                {t('auth.logout')}
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Group>
    </Container>
  );
};

export default AppHeader;
