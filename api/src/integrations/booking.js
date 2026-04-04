import { BaseIntegration, IntegrationResult } from './base.js';

/**
 * Booking.com integration (placeholder)
 *
 * Prerequisites:
 *   1. Register as Booking.com affiliate
 *   2. Get API credentials from Booking.com Connectivity Partner Programme
 *   3. Set BOOKING_API_KEY and BOOKING_AFFILIATE_ID secrets
 *
 * API docs: https://developers.booking.com/
 * Note: Booking.com API access requires partnership approval
 */

export class BookingIntegration extends BaseIntegration {
  constructor() {
    super('booking');
    this.baseUrl = 'https://distribution-xml.booking.com/2.9';
  }

  async initialize(env) {
    this.apiKey = env.BOOKING_API_KEY;
    this.affiliateId = env.BOOKING_AFFILIATE_ID;
    if (!this.apiKey) {
      throw new Error('BOOKING_API_KEY not configured');
    }
  }

  async search({ location, checkIn, checkOut, guests = 2, rooms = 1 }) {
    // Placeholder — real implementation would call Booking.com API
    // GET /json/hotels?city_ids=-2140479&checkin=2024-07-15&checkout=2024-07-22
    //
    // const res = await fetch(`${this.baseUrl}/json/hotels?` + new URLSearchParams({
    //   city_ids: locationId,
    //   checkin: checkIn,
    //   checkout: checkOut,
    //   guest_qty: guests,
    //   room_qty: rooms,
    // }), {
    //   headers: { Authorization: `Basic ${btoa(`${this.affiliateId}:${this.apiKey}`)}` },
    // });
    // const data = await res.json();
    // return data.result.map(hotel => this.normalizeResult(hotel));

    return [];
  }

  async getDetails(hotelId) {
    // GET /json/hotelDescriptions?hotel_ids=HOTEL_ID
    return null;
  }

  async checkAvailability(hotelId, checkIn, checkOut) {
    // GET /json/hotelAvailability?hotel_ids=HOTEL_ID&checkin=...&checkout=...
    return { available: false };
  }

  normalizeResult(raw) {
    return new IntegrationResult({
      provider: 'booking',
      externalId: raw.hotel_id?.toString(),
      type: 'hotel',
      name: raw.hotel_name,
      description: raw.hotel_description,
      imageUrl: raw.main_photo_url,
      location: {
        name: raw.city,
        country: raw.country,
        lat: raw.latitude,
        lng: raw.longitude,
      },
      price: {
        amount: raw.min_total_price,
        currency: raw.currency_code,
        per: 'night',
      },
      rating: {
        score: raw.review_score,
        count: raw.review_nr,
      },
      url: raw.url,
    });
  }
}
