# Church Management System - Security Rules Specification

## 1. Data Invariants

1. **Authentication Gate**: Any read or write operation requires a valid authenticated session from an authorized church staff or leader.
2. **Identity Verification**: When setting the reporter/record keeper (`recordedBy`), it must strictly equate to the active `request.auth.uid`.
3. **Immutable Audits**: Timestamps like `registeredAt` and `createdAt` cannot be altered post-creation. `recordedAt` must accurately match `request.time`.
4. **Valid Formats**: Member and finance IDs must follow format constraints (alphanumeric, max sizes, correct pricing scales).

---

## 2. The "Dirty Dozen" Payloads

Here are 12 specific rogue payloads designed to verify security checks fail under `PERMISSION_DENIED`:

### Group A: Member Profiling Exploits
1. **Unauthenticated Read Check**: Loading candidate member profiles without any auth tokens.
2. **Shadow Field Injection**: Creating a Member record with undocumented admin flags (e.g., `isAdmin: true` or `role: "SuperAdmin"`). (Should fail schema strictness / key matches).
3. **Spoofed User Registration**: Authenticated user attempts to register a member profile with `registeredAt` set to a hardcoded past/future date, bypassing `request.time`.
4. **Member ID Poisoning**: Registering a member with an abnormally bulky 2MB invalid string ID to trigger high database cost loads.

### Group B: Financial Record Tampering
5. **Negative Tithe**: Recording a financial tithe with `amount: -500` or a non-numeric amount to corrupt treasury sheets.
6. **Self-Attributed Contribution**: Logged-in user tries to record a donation attributing the agent recorder (`recordedBy`) name/ID to another head pastor's UID instead of their real active UID.
7. **Modified Financial History**: Updating or deleting a historic financial payload that has already been verified and locked.

### Group C: Attendance and Departments Overwrites
8. **Orphaned Attendance Mark**: Recording an attendance slip with an empty/invalid member reference.
9. **Falsified Department Leadership Escalation**: Unprivileged user attempting to edit a Department doc to set `leaderId` to themselves.
10. **Zero-Verify Update Gap**: Patching an attendance entry changing only the status, but adding a "ghost" comment field containing malicious payloads.

### Group D: Events Security
11. **Spoofed Event Creation**: Normal member editing or creating high-level church calendar entries.
12. **Spam Registration Count**: Adjusting `registrationsCount` arbitrarily to negative numbers or millions to crash booking charts.

---

## 3. The Rules Schema

See `firestore.rules` for the full fortress configuration implementing these exact verification boundaries.
