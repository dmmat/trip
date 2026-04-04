/**
 * Base integration interface for external travel services.
 * All integrations (Booking, Viator, Skyscanner, etc.) should extend this class.
 *
 * Architecture:
 *   IntegrationRegistry
 *     ├── BookingIntegration    (hotels, apartments)
 *     ├── ViatorIntegration     (tours, activities)
 *     ├── SkyscannerIntegration (flights)
 *     ├── RailEuropeIntegration (trains)
 *     └── CustomIntegration     (operator's own services)
 *
 * Each integration implements:
 *   - search(params)     → search for available options
 *   - getDetails(id)     → get detailed info about an option
 *   - checkAvailability(id, dates) → check availability for dates
 *   - getPrice(id, params) → get pricing with params
 *
 * Data is normalized through IntegrationResult format.
 */

export class BaseIntegration {
  constructor(name, config = {}) {
    this.name = name;
    this.config = config;
    this.enabled = false;
  }

  async initialize(env) {
    // Override in subclass to set up API keys, etc.
    throw new Error('Not implemented');
  }

  async search(params) {
    // params: { location, dates, guests, type, ... }
    throw new Error('Not implemented');
  }

  async getDetails(externalId) {
    throw new Error('Not implemented');
  }

  async checkAvailability(externalId, startDate, endDate) {
    throw new Error('Not implemented');
  }

  async getPrice(externalId, params) {
    throw new Error('Not implemented');
  }

  normalizeResult(raw) {
    // Override to map provider-specific data to IntegrationResult
    throw new Error('Not implemented');
  }
}

/**
 * Normalized result format returned by all integrations
 */
export class IntegrationResult {
  constructor({
    provider,       // 'booking', 'viator', etc.
    externalId,     // provider-specific ID
    type,           // 'hotel', 'activity', 'flight', 'train', 'transfer'
    name,
    description,
    imageUrl,
    location,       // { name, country, lat, lng }
    price,          // { amount, currency, per }
    rating,         // { score, count }
    url,            // deep link to provider
    availability,   // { available, dates }
    metadata,       // provider-specific extra data
  }) {
    this.provider = provider;
    this.externalId = externalId;
    this.type = type;
    this.name = name;
    this.description = description;
    this.imageUrl = imageUrl;
    this.location = location;
    this.price = price;
    this.rating = rating;
    this.url = url;
    this.availability = availability;
    this.metadata = metadata || {};
  }
}
