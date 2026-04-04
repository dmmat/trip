import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Container, Title, Text, Button, Group, Stack, SimpleGrid, Card,
  ThemeIcon, Box, Center, Anchor, Badge,
} from '@mantine/core';
import {
  IconPlane, IconMap2, IconUsers, IconWallet, IconCalendar,
  IconMessageCircle, IconBuildingStore, IconShieldCheck,
} from '@tabler/icons-react';
import LanguageSwitcher from '@/components/shared/LanguageSwitcher';

const features = (t) => [
  { icon: IconMap2, title: t('landing.feature1Title'), desc: t('landing.feature1Desc') },
  { icon: IconUsers, title: t('landing.feature2Title'), desc: t('landing.feature2Desc') },
  { icon: IconWallet, title: t('landing.feature3Title'), desc: t('landing.feature3Desc') },
  { icon: IconCalendar, title: t('landing.feature4Title'), desc: t('landing.feature4Desc') },
  { icon: IconMessageCircle, title: t('landing.feature5Title'), desc: t('landing.feature5Desc') },
  { icon: IconShieldCheck, title: t('landing.feature6Title'), desc: t('landing.feature6Desc') },
];

const LandingPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Box>
      {/* Hero */}
      <Box style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }} py={100}>
        <Box pos="absolute" top={16} right={16}>
          <Group gap="xs">
            <LanguageSwitcher />
            <Button variant="subtle" c="white" onClick={() => navigate('/login')}>{t('auth.login')}</Button>
          </Group>
        </Box>
        <Container size="md">
          <Stack align="center" gap="xl">
            <Group gap="xs">
              <IconPlane size={48} color="white" />
              <Title order={1} c="white" fz={48}>TripPlanner</Title>
            </Group>
            <Text c="white" fz="xl" ta="center" maw={600} opacity={0.9}>
              {t('landing.heroSubtitle')}
            </Text>
            <Group>
              <Button size="xl" radius="xl" onClick={() => navigate('/register')}
                style={{ background: 'white', color: '#4f46e5' }}
              >
                {t('landing.getStarted')}
              </Button>
              <Button size="xl" radius="xl" variant="outline" c="white"
                style={{ borderColor: 'rgba(255,255,255,0.5)' }}
                onClick={() => navigate('/for-operators')}
              >
                {t('landing.forOperators')}
              </Button>
            </Group>
          </Stack>
        </Container>
      </Box>

      {/* Features */}
      <Container size="lg" py={80}>
        <Title order={2} ta="center" mb="xs">{t('landing.featuresTitle')}</Title>
        <Text c="dimmed" ta="center" mb={50} maw={600} mx="auto">{t('landing.featuresSubtitle')}</Text>
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="xl">
          {features(t).map((f, i) => (
            <Card key={i} padding="xl" withBorder>
              <ThemeIcon size={50} radius="md" variant="light" mb="md">
                <f.icon size={26} />
              </ThemeIcon>
              <Text fw={600} mb="xs">{f.title}</Text>
              <Text size="sm" c="dimmed">{f.desc}</Text>
            </Card>
          ))}
        </SimpleGrid>
      </Container>

      {/* CTA for operators */}
      <Box bg="gray.0" py={60}>
        <Container size="md">
          <Card padding="xl" radius="lg" shadow="md" style={{ background: 'linear-gradient(135deg, #f97316, #ec4899)', color: 'white' }}>
            <Group justify="space-between" align="center" wrap="wrap">
              <Stack gap="xs" maw={400}>
                <Group gap="xs">
                  <IconBuildingStore size={24} />
                  <Badge color="white" variant="filled" c="orange">{t('operator.badge')}</Badge>
                </Group>
                <Title order={3} c="white">{t('landing.operatorCTATitle')}</Title>
                <Text opacity={0.9} size="sm">{t('landing.operatorCTADesc')}</Text>
              </Stack>
              <Button size="lg" radius="xl" color="dark" onClick={() => navigate('/for-operators')}>
                {t('landing.learnMore')}
              </Button>
            </Group>
          </Card>
        </Container>
      </Box>

      {/* Footer */}
      <Box py={30}>
        <Container size="lg">
          <Center>
            <Text size="sm" c="dimmed">
              {new Date().getFullYear()} TripPlanner. {t('landing.allRights')}
            </Text>
          </Center>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;
