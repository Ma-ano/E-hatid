Fix my Firebase Firestore permission issue.

Current error:
FirebaseError: Missing or insufficient permissions when calling subscribeAvailableOrders in orderService.ts.

What I need:

Check and fix my Firestore security rules so authenticated users can read/write the correct collections.
Ensure role-based access works for:
customer
vendor
rider
Allow:
vendors to create and manage their own products
customers to read products and create orders
riders to read available orders
Make sure queries used in subscribeAvailableOrders match Firestore rules (especially filters like status == 'pending' or similar).
Verify that:
user is authenticated before Firestore calls
correct UID is used in rules (request.auth.uid)
Fix rules so real-time listeners (onSnapshot) work without permission errors.
If needed, update Firestore structure to include:
ownerId for vendors
assignedRiderId for riders
status field for orders

Output:

Updated Firestore rules
Any required changes in frontend query code
Explanation of why the error happened