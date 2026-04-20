# Security Specification: StudentServe

## Data Invariants
1. A **User** must have a unique UID matching their authentication ID.
2. A **ServiceListing** must belong to a verified student provider.
3. A **ServiceRequest** must link a seeker and a provider, and follow a strict status flow (pending -> accepted -> in-progress -> completed).
4. A **Review** can only be created by the seeker after a request is marked as 'completed'.
5. **PII Isolation**: Users can see each other's profiles (display name, skills, bio), but private info like emails is restricted.

## The Dirty Dozen Payloads (Rejection Targets)
1. **Identity Spoofing**: Attempt to create a user profile with another user's UID.
2. **Role Escalation**: A regular user tries to set their role to 'admin' during profile update.
3. **Ghost Service**: Creating a service listing with someone else's `providerId`.
4. **Unauthorized Update**: A user trying to update another user's bio.
5. **Shadow Field injection**: Adding an `isVerified` boolean to a service listing.
6. **ID Poisoning**: Injecting a 1MB string as a `serviceId`.
7. **Status Shortcutting**: Seeker trying to mark a request as 'accepted' (only provider should).
8. **Outcome Manipulation**: Provider trying to change the `rating` in a review they received.
9. **Orphaned Request**: Creating a request for a service that doesn't exist (relational check).
10. **Early Review**: Creating a review for a 'pending' request.
11. **Review Hijacking**: Creating a review with someone else's `seekerId`.
12. **PII Leak**: Accessing the email of a user without being that user or an admin.

## Test Runner Plan
I will use `firestore.rules` and verify these conditions logically. (Testing code would go in a `.test.ts` file if environment supports easy mocking, but here I will focus on rule implementation).
