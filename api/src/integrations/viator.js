import { BaseIntegration, IntegrationResult } from './base.js';

/**
 * Viator integration (placeholder) — tours and activities
 *
 * Prerequisites:
 *   1. Join Viator Partner Program
 *   2. Get API key from Viator Developer Portal
 *   3. Set VIATOR_API_KEY secret
 *
 * API docs: https://docs.viator.com/
 */

export class ViatorIntegration extends BaseIntegration {
  constructor() {
    super('viator');
    this.baseUrl = 'https://api.viator.com/partner';
  }

  async initialize(env) {
    this.apiKey = env.VIATOR_API_KEY;
    if (!this.apiKey) {
      throw new Error('VIATOR_API_KEY not configured');
    }
  }

  async search({ location, startDate, endDate, category }) {
    // POST /products/search
    // { filtering: { destination: location, startDate, endDate }, pagination: { start: 1, count: 20 } }
    return [];
  }

  async getDetails(productCode) {
    // GET /products/{productCode}
    return null;
  }

  async checkAvailability(productCode, date) {
    // POST /availability/check
    return { available: false };
  }

  normalizeResult(raw) {
    return new IntegrationResult({
      provider: 'viator',
      externalId: raw.productCode,
      type: 'activity',
      name: raw.title,
      description: raw.description,
      imageUrl: raw.images?.[0]?.variants?.[0]?.url,
      location: {
        name: raw.destination?.name,
        country: raw.destination?.country,
      },
      price: {
        amount: raw.pricing?.summary?.fromPrice,
        currency: raw.pricing?.currency,
        per: 'person',
      },
      rating: {
        score: raw.reviews?.combinedAverageRating,
        count: raw.reviews?.totalReviews,
      },
      url: raw.productUrl,
    });
  }
}
