# Bookings System

This directory contains all the components and functionality for managing bookings in the OBVS application.

## File Structure

```
my-app/
├── app/
│   ├── admin/
│   │   └── bookings/
│   │       ├── page.tsx                 # Main bookings list page
│   │       └── [id]/
│   │           └── page.tsx             # Individual booking detail page
│   └── api/
│       └── bookings/
│           ├── route.ts                 # Main bookings API (GET, POST)
│           ├── [id]/
│           │   ├── route.ts            # Individual booking API (GET, PUT, DELETE)
│           │   ├── cancel/
│           │   │   └── route.ts        # Cancel booking API
│           │   ├── replicate/
│           │   │   └── route.ts        # Replicate booking API
│           │   └── history/
│           │       └── route.ts        # Job history API
│           └── enums/
│               └── route.ts             # Booking enums API
├── components/
│   └── bookings/
│       ├── BookingForm.tsx             # Reusable booking form component
│       ├── BookingTable.tsx            # Reusable booking table component
│       └── README.md                   # This file
├── models/
│   └── Booking.ts                      # MongoDB schemas and TypeScript interfaces
└── enums/
    └── booking-enums.ts                # Booking enumeration definitions
```

## Type System

The booking system uses types directly from the model definitions to ensure consistency:

- **Model Types**: All interfaces are defined in `/models/Booking.ts` including `IBooking`, `IClient`, `IVolunteer`, `IJobHistory`, etc.
- **Enums**: All enumerations are defined in `/enums/booking-enums.ts` including `BookingStatus`, `ServiceProgramType`, `CancellationReason`, etc.
- **UI Extensions**: Components extend the model interfaces with UI-specific properties like date string formatting and populated relations.

This approach eliminates duplication and ensures type safety across the entire booking system.

## Features

### Main Bookings Page (`/admin/bookings`)

- **View by Status**: Tabs for Assigned, Not Assigned, Cancelled, and Completed bookings
- **Search**: Search by client name, service type, volunteer name, or booking number
- **Pagination**: Server-side pagination for large datasets
- **Quick Actions**: Edit, duplicate, delete bookings from the table
- **Linked Booking Numbers**: All booking numbers link to individual detail pages

### Individual Booking Page (`/admin/bookings/[id]`)

- **Complete Booking Details**: All booking information in organized sections
- **Client Information**: Detailed client data with flags, allergies, contact info
- **Volunteer Assignment**: Current volunteer assignments and status
- **Job History**: Complete audit trail of all actions
- **Actions**:
  - Cancel booking with reason tracking
  - Replicate booking (create new based on existing)
  - Delete booking
  - Edit booking details

### API Endpoints

#### Main Bookings API (`/api/bookings`)

- `GET`: Fetch bookings with filtering, pagination, and status filtering
- `POST`: Create new booking with automatic ID generation and recurring support

#### Individual Booking API (`/api/bookings/[id]`)

- `GET`: Fetch single booking with all related data
- `PUT`: Update booking information
- `DELETE`: Delete booking (soft delete to "Deleted" status)

#### Specialized Endpoints

- `POST /api/bookings/[id]/cancel`: Cancel booking with reason
- `POST /api/bookings/[id]/replicate`: Create duplicate booking
- `GET /api/bookings/[id]/history`: Get job history for booking

## Components

### BookingForm

Reusable form component for creating and editing bookings.

- Supports all booking types (Service, Program, Support Service, Event)
- All service types from the requirements
- Date/time pickers with smart defaults
- Address management
- Validation and error handling

### BookingTable

Reusable table component for displaying booking lists.

- Sortable columns
- Status badges with icons
- Linked booking numbers
- Action dropdown menus
- Client and volunteer information display

## Key Requirements Implemented

✅ **Booking Numbers**: All booking numbers are clickable links to detail pages
✅ **Service Types**: Complete list of services, programs, and support services
✅ **Status Management**: All booking statuses (Assigned, Not Assigned, Cancelled, Deleted, Completed)
✅ **Frequency Types**: One-Time, Ongoing, and Continuous bookings
✅ **Cancellation**: Full cancellation workflow with reasons and notes
✅ **Replication**: Ability to duplicate bookings with new dates/times
✅ **Job History**: Complete audit trail of all booking actions
✅ **Search & Filter**: Comprehensive search and status filtering
✅ **Pagination**: Server-side pagination for performance
✅ **Type Safety**: Direct use of model types eliminates duplication and ensures consistency

## Data Models

The booking system uses several MongoDB collections:

- `Booking`: Main booking information
- `BookingClientRelation`: Links bookings to clients
- `BookingVolunteerRelation`: Links bookings to volunteers with status
- `EventAttendee`: For event-specific attendee management
- `JobHistory`: Audit trail of all actions
- `VolunteerAbsence`: Volunteer availability tracking

## Future Enhancements

- **Volunteer Matching**: Smart volunteer assignment based on compatibility
- **Client Assignment**: Link bookings to specific clients during creation
- **Recurring Bookings**: Full implementation of recurring booking generation
- **Event Integration**: Enhanced event booking functionality
- **Notification System**: Email/SMS notifications for booking updates
- **Mobile Optimization**: Enhanced mobile experience for field staff
- **Reporting**: Booking analytics and reports
- **Export/Import**: CSV/Excel export functionality

## Getting Started

1. Ensure MongoDB connection is configured in `/lib/mongodb.ts`
2. Run database migrations to create the booking collections
3. Populate enum values using the booking-enums system
4. Access the bookings system at `/admin/bookings`

## Technical Notes

- Uses Next.js App Router for file-based routing
- MongoDB with Mongoose for data persistence
- TypeScript for type safety with model-based types
- Tailwind CSS with shadcn/ui components for styling
- Server-side rendering and client-side interactivity
- RESTful API design with proper HTTP status codes
- Error handling and loading states throughout
- Direct model type usage for consistency and maintainability
