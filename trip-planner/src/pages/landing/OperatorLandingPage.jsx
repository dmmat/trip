import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Container, Title, Text, Button, Group, Stack, SimpleGrid, Card,
  ThemeIcon, Box, Center, List,
} from '@mantine/core';
import {
  IconBuildingStore, IconPlane, IconLink, IconChartBar,
  IconUsers, IconCash, IconWorld, IconCheck,
} from '@tabler/icons-react';
import LanguageSwitcher from '@/components/shared/LanguageSwitcher';

const OperatorLandingPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const opFeatures = [
    { icon: IconPlane, title: t('operator.feat1Title'), desc: t('operator.feat1Desc') },
    { icon: IconLink, title: t('operator.feat2Title'), desc: t('operator.feat2Desc') },
    { icon: IconCash, title: t('operator.feat3Title'), desc: t('operator.feat3Desc') },
    { icon: IconChartBar, title: t('operator.feat4Title'), desc: t('operator.feat4Desc') },
    { icon: IconUsers, title: t('operator.feat5Title'), desc: t('operator.feat5Desc') },
    { icon: IconWorld, title: t('operator.feat6Title'), desc: t('operator.feat6Desc') },
  ];

  return (
    <Box>
      <Box style={{ background: 'linear-gradient(135deg, #f97316 0%, #ec4899 100%)' }} py={100}>
        <Box pos="absolute" top={16} right={16}>
          <Group gap="xs">
            <LanguageSwitcher />
            <Button variant="subtle" c="white" onClick={() => navigate('/login')}>{t('auth.login')}</Button>
          </Group>
        </Box>
        <Container size="md">
          <Stack align="center" gap="xl">
            <Group gap="xs">
              <IconBuildingStore size={48} color="white" />
              <Title order={1} c="white" fz={48}>TripPlanner</Title>
            </Group>
            <Title order={2} c="white" ta="center" fw={400}>{t('operator.heroTitle')}</Title>
            <Text c="white" fz="lg" ta="center" maw={600} opacity={0.9}>
              {t('operator.heroSubtitle')}
            </Text>
            <Group>
              <Button size="xl" radius="xl" onClick={() => navigate('/register/operator')}
                style={{ background: 'white', color: '#f97316' }}
              >
                {t('operator.registerBtn')}
              </Button>
              <Button size="xl" radius="xl" variant="outline" c="white"
                style={{ borderColor: 'rgba(255,255,255,0.5)' }}
                onClick={() => navigate('/')}
              >
                {t('landing.forTravelers')}
              </Button>
            </Group>
          </Stack>
        </Container>
      </Box>

      <Container size="lg" py={80}>
        <Title order={2} ta="center" mb={50}>{t('operator.featuresTitle')}</Title>
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="xl">
          {opFeatures.map((f, i) => (
            <Card key={i} padding="xl" withBorder>
              <ThemeIcon size={50} radius="md" variant="light" color="orange" mb="md">
                <f.icon size={26} />
              </ThemeIcon>
              <Text fw={600} mb="xs">{f.title}</Text>
              <Text size="sm" c="dimmed">{f.desc}</Text>
            </Card>
          ))}
        </SimpleGrid>
      </Container>

      {/* How it works */}
      <Box bg="gray.0" py={60}>
        <Container size="sm">
          <Title order={2} ta="center" mb="xl">{t('operator.howItWorks')}</Title>
          <List spacing="lg" size="lg" icon={<ThemeIcon size={28} radius="xl" color="orange"><IconCheck size={16} /></ThemeIcon>}>
            <List.Item>{t('operator.step1')}</List.Item>
            <List.Item>{t('operator.step2')}</List.Item>
            <List.Item>{t('operator.step3')}</List.Item>
            <List.Item>{t('operator.step4')}</List.Item>
          </List>
          <Center mt="xl">
            <Button size="lg" radius="xl" color="orange" onClick={() => navigate('/register/operator')}>
              {t('operator.registerBtn')}
            </Button>
          </Center>
        </Container>
      </Box>

      <Box py={30}>
        <Container size="lg">
          <Center>
            <Text size="sm" c="dimmed">{new Date().getFullYear()} TripPlanner. {t('landing.allRights')}</Text>
          </Center>
        </Container>
      </Box>
    </Box>
  );
};

export default OperatorLandingPage;
