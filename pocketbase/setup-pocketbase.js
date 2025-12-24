#!/usr/bin/env node

/**
 * This script automatically sets up PocketBase collections for the Trip Planner app.
 * Run this after starting PocketBase for the first time.
 * 
 * Usage: node setup-pocketbase.js <admin-email> <admin-password>
 */

import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

const adminEmail = process.argv[2] || 'admin@example.com';
const adminPassword = process.argv[3] || 'admin123456';

async function setupCollections() {
  try {
    console.log('🔧 Setting up PocketBase collections...\n');

    // First, try to authenticate as admin
    try {
      await pb.admins.authWithPassword(adminEmail, adminPassword);
      console.log('✅ Authenticated as admin\n');
    } catch (error) {
      // If authentication fails, create the admin
      console.log('Creating admin user...');
      await pb.admins.create({
        email: adminEmail,
        password: adminPassword,
        passwordConfirm: adminPassword,
      });
      await pb.admins.authWithPassword(adminEmail, adminPassword);
      console.log('✅ Admin user created and authenticated\n');
    }

    // Collection definitions
    const collections = [
      {
        name: 'trips',
        type: 'base',
        schema: [
          { name: 'name', type: 'text', required: true },
          { 
            name: 'status', 
            type: 'select', 
            required: true,
            options: { values: ['active', 'planned', 'completed', 'cancelled'] }
          },
          { name: 'start_date', type: 'date', required: true },
          { name: 'end_date', type: 'date', required: true },
          { 
            name: 'organizer', 
            type: 'relation', 
            required: true,
            options: { 
              collectionId: '_pb_users_auth_',
              cascadeDelete: false,
              maxSelect: 1
            }
          },
          { name: 'description', type: 'text', required: false },
        ],
        listRule: '@request.auth.id != ""',
        viewRule: '@request.auth.id != ""',
        createRule: '@request.auth.id != ""',
        updateRule: 'organizer = @request.auth.id',
        deleteRule: 'organizer = @request.auth.id',
      },
      {
        name: 'trip_participants',
        type: 'base',
        schema: [
          { 
            name: 'trip', 
            type: 'relation', 
            required: true,
            options: { 
              collectionId: '', // Will be filled after trips collection is created
              cascadeDelete: true,
              maxSelect: 1
            }
          },
          { 
            name: 'user', 
            type: 'relation', 
            required: true,
            options: { 
              collectionId: '_pb_users_auth_',
              cascadeDelete: false,
              maxSelect: 1
            }
          },
          { 
            name: 'role', 
            type: 'select', 
            required: true,
            options: { values: ['organizer', 'participant'] }
          },
        ],
        listRule: '@request.auth.id != ""',
        viewRule: '@request.auth.id != ""',
        createRule: 'trip.organizer = @request.auth.id',
        updateRule: 'trip.organizer = @request.auth.id',
        deleteRule: 'trip.organizer = @request.auth.id',
      },
      {
        name: 'locations',
        type: 'base',
        schema: [
          { 
            name: 'trip', 
            type: 'relation', 
            required: true,
            options: { 
              collectionId: '', // Will be filled after trips collection is created
              cascadeDelete: true,
              maxSelect: 1
            }
          },
          { name: 'name', type: 'text', required: true },
          { name: 'country', type: 'text', required: true },
          { name: 'duration', type: 'text', required: false },
          { name: 'notes', type: 'text', required: false },
          { 
            name: 'photos', 
            type: 'file', 
            required: false,
            options: { maxSelect: 10, maxSize: 5242880 }
          },
          { name: 'order', type: 'number', required: true },
        ],
        listRule: '@request.auth.id != ""',
        viewRule: '@request.auth.id != ""',
        createRule: 'trip.organizer = @request.auth.id || trip.trip_participants_via_trip.user ?= @request.auth.id',
        updateRule: 'trip.organizer = @request.auth.id || trip.trip_participants_via_trip.user ?= @request.auth.id',
        deleteRule: 'trip.organizer = @request.auth.id',
      },
      {
        name: 'expenses',
        type: 'base',
        schema: [
          { 
            name: 'trip', 
            type: 'relation', 
            required: true,
            options: { 
              collectionId: '', // Will be filled after trips collection is created
              cascadeDelete: true,
              maxSelect: 1
            }
          },
          { name: 'name', type: 'text', required: true },
          { name: 'amount', type: 'number', required: true },
          { 
            name: 'category', 
            type: 'select', 
            required: true,
            options: { values: ['transport', 'accommodation', 'food', 'entertainment', 'other'] }
          },
          { 
            name: 'paid_by', 
            type: 'relation', 
            required: true,
            options: { 
              collectionId: '_pb_users_auth_',
              cascadeDelete: false,
              maxSelect: 1
            }
          },
          { 
            name: 'split_between', 
            type: 'relation', 
            required: true,
            options: { 
              collectionId: '_pb_users_auth_',
              cascadeDelete: false,
              maxSelect: 99
            }
          },
          { name: 'date', type: 'date', required: false },
        ],
        listRule: '@request.auth.id != ""',
        viewRule: '@request.auth.id != ""',
        createRule: 'trip.organizer = @request.auth.id || trip.trip_participants_via_trip.user ?= @request.auth.id',
        updateRule: 'paid_by = @request.auth.id || trip.organizer = @request.auth.id',
        deleteRule: 'paid_by = @request.auth.id || trip.organizer = @request.auth.id',
      },
      {
        name: 'schedule_events',
        type: 'base',
        schema: [
          { 
            name: 'trip', 
            type: 'relation', 
            required: true,
            options: { 
              collectionId: '', // Will be filled after trips collection is created
              cascadeDelete: true,
              maxSelect: 1
            }
          },
          { name: 'date', type: 'date', required: true },
          { name: 'time', type: 'text', required: true },
          { name: 'title', type: 'text', required: true },
          { name: 'description', type: 'text', required: false },
          { 
            name: 'type', 
            type: 'select', 
            required: true,
            options: { 
              values: ['transport', 'accommodation', 'sightseeing', 'food', 'activity', 'leisure', 'entertainment', 'culture', 'shopping', 'other']
            }
          },
          { name: 'duration', type: 'text', required: false },
          { name: 'location', type: 'text', required: false },
        ],
        listRule: '@request.auth.id != ""',
        viewRule: '@request.auth.id != ""',
        createRule: 'trip.organizer = @request.auth.id || trip.trip_participants_via_trip.user ?= @request.auth.id',
        updateRule: 'trip.organizer = @request.auth.id || trip.trip_participants_via_trip.user ?= @request.auth.id',
        deleteRule: 'trip.organizer = @request.auth.id',
      },
      {
        name: 'documents',
        type: 'base',
        schema: [
          { 
            name: 'trip', 
            type: 'relation', 
            required: true,
            options: { 
              collectionId: '', // Will be filled after trips collection is created
              cascadeDelete: true,
              maxSelect: 1
            }
          },
          { name: 'name', type: 'text', required: true },
          { 
            name: 'category', 
            type: 'select', 
            required: true,
            options: { values: ['transport', 'accommodation', 'insurance', 'other'] }
          },
          { 
            name: 'file', 
            type: 'file', 
            required: true,
            options: { maxSelect: 1, maxSize: 10485760 }
          },
          { 
            name: 'uploaded_by', 
            type: 'relation', 
            required: true,
            options: { 
              collectionId: '_pb_users_auth_',
              cascadeDelete: false,
              maxSelect: 1
            }
          },
        ],
        listRule: '@request.auth.id != ""',
        viewRule: '@request.auth.id != ""',
        createRule: 'trip.organizer = @request.auth.id || trip.trip_participants_via_trip.user ?= @request.auth.id',
        updateRule: 'uploaded_by = @request.auth.id || trip.organizer = @request.auth.id',
        deleteRule: 'uploaded_by = @request.auth.id || trip.organizer = @request.auth.id',
      },
      {
        name: 'messages',
        type: 'base',
        schema: [
          { 
            name: 'trip', 
            type: 'relation', 
            required: true,
            options: { 
              collectionId: '', // Will be filled after trips collection is created
              cascadeDelete: true,
              maxSelect: 1
            }
          },
          { 
            name: 'user', 
            type: 'relation', 
            required: true,
            options: { 
              collectionId: '_pb_users_auth_',
              cascadeDelete: false,
              maxSelect: 1
            }
          },
          { name: 'message', type: 'text', required: true },
        ],
        listRule: '@request.auth.id != ""',
        viewRule: '@request.auth.id != ""',
        createRule: 'trip.organizer = @request.auth.id || trip.trip_participants_via_trip.user ?= @request.auth.id',
        updateRule: 'user = @request.auth.id',
        deleteRule: 'user = @request.auth.id || trip.organizer = @request.auth.id',
      },
    ];

    // Create collections
    let tripsCollectionId = '';
    
    for (const collectionDef of collections) {
      try {
        console.log(`Creating collection: ${collectionDef.name}...`);
        
        // Update trip relation for dependent collections
        if (collectionDef.name !== 'trips' && tripsCollectionId) {
          const tripField = collectionDef.schema.find(f => f.name === 'trip');
          if (tripField) {
            tripField.options.collectionId = tripsCollectionId;
          }
        }
        
        const collection = await pb.collections.create(collectionDef);
        console.log(`✅ Created: ${collectionDef.name}`);
        
        if (collectionDef.name === 'trips') {
          tripsCollectionId = collection.id;
        }
      } catch (error) {
        if (error.status === 400 && error.data?.data?.name?.code === 'validation_not_unique') {
          console.log(`⚠️  Collection ${collectionDef.name} already exists, skipping...`);
        } else {
          console.error(`❌ Error creating ${collectionDef.name}:`, error.data || error.message);
        }
      }
    }

    console.log('\n✅ PocketBase setup completed successfully!');
    console.log('\nAdmin credentials:');
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
    console.log('\nAdmin UI: http://127.0.0.1:8090/_/');
    console.log('API: http://127.0.0.1:8090/api/');
    
  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }
}

setupCollections();
