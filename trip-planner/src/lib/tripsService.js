import pb from './pocketbase';

export const tripsService = {
  // Get all trips for the current user
  async getTrips() {
    try {
      const records = await pb.collection('trips').getFullList({
        sort: '-created',
        expand: 'organizer',
      });
      return records;
    } catch (error) {
      console.error('Error fetching trips:', error);
      throw error;
    }
  },

  // Get a specific trip by ID
  async getTrip(id) {
    try {
      const record = await pb.collection('trips').getOne(id, {
        expand: 'organizer',
      });
      return record;
    } catch (error) {
      console.error('Error fetching trip:', error);
      throw error;
    }
  },

  // Create a new trip
  async createTrip(tripData) {
    try {
      const data = {
        name: tripData.name,
        status: tripData.status || 'planned',
        start_date: tripData.startDate,
        end_date: tripData.endDate,
        description: tripData.description || '',
        organizer: pb.authStore.model.id,
      };

      const record = await pb.collection('trips').create(data);
      
      // Add the organizer as a participant
      await pb.collection('trip_participants').create({
        trip: record.id,
        user: pb.authStore.model.id,
        role: 'organizer',
      });

      return record;
    } catch (error) {
      console.error('Error creating trip:', error);
      throw error;
    }
  },

  // Update a trip
  async updateTrip(id, tripData) {
    try {
      const data = {};
      if (tripData.name) data.name = tripData.name;
      if (tripData.status) data.status = tripData.status;
      if (tripData.startDate) data.start_date = tripData.startDate;
      if (tripData.endDate) data.end_date = tripData.endDate;
      if (tripData.description !== undefined) data.description = tripData.description;

      const record = await pb.collection('trips').update(id, data);
      return record;
    } catch (error) {
      console.error('Error updating trip:', error);
      throw error;
    }
  },

  // Delete a trip
  async deleteTrip(id) {
    try {
      await pb.collection('trips').delete(id);
      return true;
    } catch (error) {
      console.error('Error deleting trip:', error);
      throw error;
    }
  },

  // Get trip participants
  async getParticipants(tripId) {
    try {
      const records = await pb.collection('trip_participants').getFullList({
        filter: `trip="${tripId}"`,
        expand: 'user',
      });
      return records;
    } catch (error) {
      console.error('Error fetching participants:', error);
      throw error;
    }
  },

  // Add a participant to a trip
  async addParticipant(tripId, userEmail) {
    try {
      // First, find the user by email
      const users = await pb.collection('users').getFullList({
        filter: `email="${userEmail}"`,
      });

      if (users.length === 0) {
        throw new Error('Користувача з таким email не знайдено');
      }

      const user = users[0];

      // Check if user is already a participant
      const existing = await pb.collection('trip_participants').getFullList({
        filter: `trip="${tripId}" && user="${user.id}"`,
      });

      if (existing.length > 0) {
        throw new Error('Цей користувач вже є учасником подорожі');
      }

      // Add the participant
      const record = await pb.collection('trip_participants').create({
        trip: tripId,
        user: user.id,
        role: 'participant',
      });

      return record;
    } catch (error) {
      console.error('Error adding participant:', error);
      throw error;
    }
  },

  // Remove a participant from a trip
  async removeParticipant(participantId) {
    try {
      await pb.collection('trip_participants').delete(participantId);
      return true;
    } catch (error) {
      console.error('Error removing participant:', error);
      throw error;
    }
  },

  // Get trip locations
  async getLocations(tripId) {
    try {
      const records = await pb.collection('locations').getFullList({
        filter: `trip="${tripId}"`,
        sort: 'order',
      });
      return records;
    } catch (error) {
      console.error('Error fetching locations:', error);
      throw error;
    }
  },

  // Add a location to a trip
  async addLocation(tripId, locationData) {
    try {
      const data = {
        trip: tripId,
        name: locationData.name,
        country: locationData.country,
        duration: locationData.duration || '',
        notes: locationData.notes || '',
        order: locationData.order || 0,
      };

      const record = await pb.collection('locations').create(data);
      return record;
    } catch (error) {
      console.error('Error adding location:', error);
      throw error;
    }
  },

  // Get trip expenses
  async getExpenses(tripId) {
    try {
      const records = await pb.collection('expenses').getFullList({
        filter: `trip="${tripId}"`,
        expand: 'paid_by,split_between',
        sort: '-created',
      });
      return records;
    } catch (error) {
      console.error('Error fetching expenses:', error);
      throw error;
    }
  },

  // Add an expense
  async addExpense(tripId, expenseData) {
    try {
      const data = {
        trip: tripId,
        name: expenseData.name,
        amount: expenseData.amount,
        category: expenseData.category,
        paid_by: expenseData.paidBy,
        split_between: expenseData.splitBetween,
        date: expenseData.date || new Date().toISOString(),
      };

      const record = await pb.collection('expenses').create(data);
      return record;
    } catch (error) {
      console.error('Error adding expense:', error);
      throw error;
    }
  },

  // Get trip schedule events
  async getScheduleEvents(tripId) {
    try {
      const records = await pb.collection('schedule_events').getFullList({
        filter: `trip="${tripId}"`,
        sort: 'date,time',
      });
      return records;
    } catch (error) {
      console.error('Error fetching schedule events:', error);
      throw error;
    }
  },

  // Add a schedule event
  async addScheduleEvent(tripId, eventData) {
    try {
      const data = {
        trip: tripId,
        date: eventData.date,
        time: eventData.time,
        title: eventData.title,
        description: eventData.description || '',
        type: eventData.type,
        duration: eventData.duration || '',
        location: eventData.location || '',
      };

      const record = await pb.collection('schedule_events').create(data);
      return record;
    } catch (error) {
      console.error('Error adding schedule event:', error);
      throw error;
    }
  },

  // Get trip documents
  async getDocuments(tripId) {
    try {
      const records = await pb.collection('documents').getFullList({
        filter: `trip="${tripId}"`,
        expand: 'uploaded_by',
        sort: '-created',
      });
      return records;
    } catch (error) {
      console.error('Error fetching documents:', error);
      throw error;
    }
  },

  // Upload a document
  async uploadDocument(tripId, file, category, name) {
    try {
      const formData = new FormData();
      formData.append('trip', tripId);
      formData.append('name', name || file.name);
      formData.append('category', category);
      formData.append('file', file);
      formData.append('uploaded_by', pb.authStore.model.id);

      const record = await pb.collection('documents').create(formData);
      return record;
    } catch (error) {
      console.error('Error uploading document:', error);
      throw error;
    }
  },

  // Get trip messages
  async getMessages(tripId) {
    try {
      const records = await pb.collection('messages').getFullList({
        filter: `trip="${tripId}"`,
        expand: 'user',
        sort: 'created',
      });
      return records;
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  },

  // Send a message
  async sendMessage(tripId, message) {
    try {
      const data = {
        trip: tripId,
        user: pb.authStore.model.id,
        message: message,
      };

      const record = await pb.collection('messages').create(data);
      return record;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  // Subscribe to real-time updates for messages
  subscribeToMessages(tripId, callback) {
    pb.collection('messages').subscribe('*', (e) => {
      if (e.record.trip === tripId) {
        callback(e);
      }
    });
  },

  // Unsubscribe from real-time updates
  unsubscribeFromMessages() {
    pb.collection('messages').unsubscribe();
  },
};
