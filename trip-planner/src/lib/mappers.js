import { datePeriodFormatter } from "./utils";

export const TripMapper = (trips = []) => {
  if (!trips.length) return trips;
  return trips.map((trip) => {
    trip.totalExpenses = trip.expenses.total;
    trip.allLocations = trip.locations.map((location) => location.name);
    trip.totalParticipants = trip.participants.length;
    trip.dates_text = datePeriodFormatter(trip.dates.start, trip.dates.end);
    if (trip.chat?.messages) {
      trip.chat.messages = trip.chat.messages.map((message) => ({
        ...message,
        user: trip.participants.find(
          (participant) => participant.id === message.userId,
        ),
      }));
    }
    if (trip.expenses?.categories)
      trip.expenses.categories = trip.expenses.categories.map((category) => ({
        ...category,
        items: category.items.map((item) => ({
          ...item,
          user: trip.participants.find(
            (participant) => participant.id === item.paidBy,
          ),
        })),
      }));

    if (trip.expenses?.participants_cost)
      trip.expenses.participants_cost = trip.expenses.participants_cost.map(
        (participant) => ({
          ...participant,
          user: trip.participants.find((p) => p.id === participant.id),
        }),
      );

    if (trip.expenses?.transfers)
      trip.expenses.transfers = trip.expenses.transfers.map((transfer) => ({
        ...transfer,
        from: trip.participants.find((p) => p.id === transfer.from),
        to: trip.participants.find((p) => p.id === transfer.to),
      }));

    return trip;
  });
};
