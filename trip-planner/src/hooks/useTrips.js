import { useState, useEffect } from 'react';
import { tripsService } from '@/lib/tripsService';

export const useTrips = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await tripsService.getTrips();
      setTrips(data);
    } catch (err) {
      console.error('Error loading trips:', err);
      setError(err.message || 'Failed to load trips');
    } finally {
      setLoading(false);
    }
  };

  const createTrip = async (tripData) => {
    try {
      const newTrip = await tripsService.createTrip(tripData);
      setTrips([newTrip, ...trips]);
      return { success: true, trip: newTrip };
    } catch (err) {
      console.error('Error creating trip:', err);
      return { success: false, error: err.message || 'Failed to create trip' };
    }
  };

  const updateTrip = async (id, tripData) => {
    try {
      const updatedTrip = await tripsService.updateTrip(id, tripData);
      setTrips(trips.map(t => t.id === id ? updatedTrip : t));
      return { success: true, trip: updatedTrip };
    } catch (err) {
      console.error('Error updating trip:', err);
      return { success: false, error: err.message || 'Failed to update trip' };
    }
  };

  const deleteTrip = async (id) => {
    try {
      await tripsService.deleteTrip(id);
      setTrips(trips.filter(t => t.id !== id));
      return { success: true };
    } catch (err) {
      console.error('Error deleting trip:', err);
      return { success: false, error: err.message || 'Failed to delete trip' };
    }
  };

  return {
    trips,
    loading,
    error,
    loadTrips,
    createTrip,
    updateTrip,
    deleteTrip,
  };
};
