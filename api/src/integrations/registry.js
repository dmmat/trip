/**
 * Integration Registry — manages all external service integrations.
 *
 * Usage:
 *   const registry = new IntegrationRegistry();
 *   registry.register(new BookingIntegration());
 *   registry.register(new ViatorIntegration());
 *   await registry.initializeAll(env);
 *
 *   // Search across all providers
 *   const results = await registry.searchAll({ location: 'Paris', type: 'hotel' });
 *
 *   // Search specific provider
 *   const booking = await registry.search('booking', { location: 'Paris' });
 */

export class IntegrationRegistry {
  constructor() {
    this.integrations = new Map();
  }

  register(integration) {
    this.integrations.set(integration.name, integration);
    return this;
  }

  async initializeAll(env) {
    for (const [name, integration] of this.integrations) {
      try {
        await integration.initialize(env);
        integration.enabled = true;
      } catch (err) {
        console.warn(`Integration '${name}' failed to initialize:`, err.message);
        integration.enabled = false;
      }
    }
  }

  get(name) {
    return this.integrations.get(name);
  }

  getEnabled() {
    return Array.from(this.integrations.values()).filter((i) => i.enabled);
  }

  async search(providerName, params) {
    const integration = this.integrations.get(providerName);
    if (!integration?.enabled) return [];
    return integration.search(params);
  }

  async searchAll(params) {
    const enabled = this.getEnabled();
    const results = await Promise.allSettled(
      enabled.map((i) => i.search(params))
    );

    return results
      .filter((r) => r.status === 'fulfilled')
      .flatMap((r) => r.value);
  }

  async getDetails(providerName, externalId) {
    const integration = this.integrations.get(providerName);
    if (!integration?.enabled) return null;
    return integration.getDetails(externalId);
  }

  listProviders() {
    return Array.from(this.integrations.entries()).map(([name, i]) => ({
      name,
      enabled: i.enabled,
    }));
  }
}
