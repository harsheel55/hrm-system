# HRM Service System - Roles and Required Functionality Plan

## 1. Current Project Structure (High Level)

## Backend modules currently available
- Authentication: login/register with JWT
- User management: users CRUD
- Role management: user roles CRUD
- Rights management: role-to-menu permission mapping
- Menu management: app navigation/menu CRUD
- Attendance: dashboard, check-in, check-out, today status
- Leave: dashboard, create leave request
- Blog: blog post, category, and tag management

## Frontend structure currently available
- API service layer
- Contexts, hooks, store, and typed models
- Component and page based structure for dashboard style app

---

## 2. Roles Required in This System

These roles are recommended for a practical HRM + Blog setup.

1. Super Admin
- Full system control
- Can create/update/deactivate roles
- Can assign all rights and manage system settings

2. HR Admin
- Owns HR operations
- Can manage employees, attendance policies, leave policies, and approvals

3. Reporting Manager
- Team-level operational control
- Can approve/reject leave and view attendance reports for direct reports

4. Employee
- Self-service role
- Can check-in/check-out, apply leave, view own profile and own history

5. Content Editor
- Blog operations role
- Can create/edit/publish blog posts, categories, and tags

6. Auditor (Read-only)
- Compliance and review role
- Can view users, roles, attendance, leave, and audit logs but cannot edit

---

## 3. Permission Model to Use (Already Supported by Backend)

Your current backend rights model supports these permission flags:
- bolCanView
- bolCanSave
- bolCanEdit
- bolCanDelete
- bolCanApprove
- bolCanPrint
- bolCanExport
- bolCanImport

Recommendation:
- Keep menu-based authorization for UI and API behavior.
- Add policy checks per endpoint so role rights are enforced server-side, not only in frontend.

---

## 4. Suggested Role vs Module Access Matrix

Legend:
- V = View
- C = Create/Save
- E = Edit
- D = Delete
- A = Approve

1. User Management
- Super Admin: V C E D A
- HR Admin: V C E (D optional)
- Reporting Manager: V (team only)
- Employee: V (self only)
- Content Editor: No access
- Auditor: V

2. Role and Rights Management
- Super Admin: V C E D A
- HR Admin: V (optional limited)
- Reporting Manager: No access
- Employee: No access
- Content Editor: No access
- Auditor: V

3. Menu Management
- Super Admin: V C E D
- HR Admin: V
- Reporting Manager: No access
- Employee: No access
- Content Editor: No access
- Auditor: V

4. Attendance
- Super Admin: V C E D
- HR Admin: V C E A
- Reporting Manager: V A (team)
- Employee: V C E (self check-in/out only)
- Content Editor: No access
- Auditor: V

5. Leave
- Super Admin: V C E D A
- HR Admin: V C E A
- Reporting Manager: V A (team)
- Employee: V C E (self requests)
- Content Editor: No access
- Auditor: V

6. Blog
- Super Admin: V C E D A
- HR Admin: V (optional)
- Reporting Manager: V
- Employee: V
- Content Editor: V C E D A
- Auditor: V

---

## 5. Functionalities Required to Add Next (Important)

These are the most important missing additions to make role-based HRM production-ready.

1. Endpoint-level authorization policies (High priority)
- Add permission-based policies per controller action.
- Example: only roles with canApprove on Leave menu can approve leave requests.

2. Leave approval workflow (High priority)
- Add states: Pending, Approved, Rejected, Cancelled.
- Add manager and HR approval chain.
- Track approver comments and timestamps.

3. Attendance regularization and approval (High priority)
- Allow employee correction requests for missed check-in/out.
- Manager/HR approval flow.

4. Employee profile and hierarchy mapping (High priority)
- Add manager mapping (employee -> reporting manager).
- Needed for team-based views and approval routing.

5. Role assignment and lifecycle rules (Medium priority)
- Restrict role deletion when in use.
- Add role clone feature to speed onboarding.

6. Audit trail across sensitive actions (Medium priority)
- Track: who changed role rights, leave status, user profile, and menu config.
- Include before/after values where possible.

7. Dashboard segmentation by role (Medium priority)
- Employee dashboard: personal attendance/leave summary.
- Manager dashboard: team pending approvals, team attendance trends.
- HR dashboard: organization-level KPIs.

8. Notification system (Medium priority)
- Email/in-app notifications for leave submission, approval/rejection, policy changes.

9. Password and account security hardening (Medium priority)
- Force password complexity and reset flow.
- Add account lockout after repeated failures.
- Add refresh token and token revocation support.

10. Data export and reports (Lower priority)
- Attendance/leave CSV or Excel export by role rights.
- Monthly compliance reports.

---

## 6. Recommended Initial Role Setup (Bootstrap)

Create these default roles first:
1. Super Admin
2. HR Admin
3. Reporting Manager
4. Employee
5. Content Editor
6. Auditor

Then assign menu rights using existing UserRights model.

---

## 7. Immediate Implementation Sequence

1. Finalize menu map keys for each module (User, Roles, Rights, Attendance, Leave, Blog).
2. Seed default roles.
3. Seed default role-right mappings.
4. Add backend policy checks per endpoint.
5. Add leave approval endpoints.
6. Add manager hierarchy and team-scoped data filtering.
7. Add audit log tables and middleware/service hooks.

---

## 8. Final Suggestion

Your current architecture is already suitable for enterprise-grade RBAC because you have:
- Dedicated Role table
- Dedicated Rights table with detailed flags
- Menu-based access model

Focus next on workflow depth (approvals, hierarchy, audit, notifications) and strict backend authorization checks to complete the system.
