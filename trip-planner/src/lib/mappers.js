import { datePeriodFormatter } from "./utils";

// Map PocketBase trip data to the frontend format
export const mapPocketBaseTrip = async (trip, includeDetails = false) => {
  const mapped = {
    id: trip.id,
    name: trip.name,
    status: trip.status,
    dates_text: datePeriodFormatter(trip.start_date, trip.end_date),
    start_date: trip.start_date,
    end_date: trip.end_date,
    description: trip.description || '',
    organizer: trip.expand?.organizer || trip.organizer,
  };

  // Add minimal data for list view
  mapped.totalParticipants = 0;
  mapped.totalExpenses = 0;
  mapped.allLocations = [];

  // If details are needed, they should be loaded separately
  return mapped;
};

// Legacy mapper for hardcoded data
export const TripMapper = (trips = []) => {
  if (!trips.length) return trips;
  return trips.map((trip) => {
    trip.totalExpenses = trip.expenses?.total || 0;
    trip.allLocations = trip.locations?.map((location) => location.name) || [];
    trip.totalParticipants = trip.participants?.length || 0;
    trip.dates_text = trip.dates ? datePeriodFormatter(trip.dates.start, trip.dates.end) : '';
    if (trip.chat?.messages) {
      trip.chat.messages = trip.chat.messages.map((message) => ({
        ...message,
        user: trip.participants?.find(
          (participant) => participant.id === message.userId,
        ),
      }));
    }
    if (trip.expenses?.categories)
      trip.expenses.categories = trip.expenses.categories.map((category) => ({
        ...category,
        items: category.items.map((item) => ({
          ...item,
          user: trip.participants?.find(
            (participant) => participant.id === item.paidBy,
          ),
        })),
      }));

    if (trip.expenses?.participants_cost)
      trip.expenses.participants_cost = trip.expenses.participants_cost.map(
        (participant) => ({
          ...participant,
          user: trip.participants?.find((p) => p.id === participant.id),
        }),
      );

    if (trip.expenses?.transfers)
      trip.expenses.transfers = trip.expenses.transfers.map((transfer) => ({
        ...transfer,
        from: trip.participants?.find((p) => p.id === transfer.from),
        to: trip.participants?.find((p) => p.id === transfer.to),
      }));

    return trip;
  });
};
