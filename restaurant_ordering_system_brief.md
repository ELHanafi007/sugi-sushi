# Restaurant Digital Menu — Ordering System AI Brief
> This document is the single source of truth for building the ordering system.  
> Read it fully before writing any code, creating any file, or making any decision.  
> Every section is required. Do not skip or summarise.

---

## 0. Project context

The client already has:
- A working **reservation system** with email confirmation and receipt emails via an email integration.
- A custom-designed **floor plan** (visual table map with colors and layout — not raw lines).
- A working **digital menu** UI that customers can browse.

What needs to be built:
- The full **ordering flow** (cart → order → kitchen → delivery).
- **Table detection** from QR code.
- **Kitchen display** interface.
- **Waiter interface** tied to the floor plan.
- **Real-time order status tracking** for the customer.
- **Notification system** for all roles.

---

## 1. Core principle: table identity

**Every single order, session, and notification in this system is anchored to a table ID.**

- Each physical table has a unique QR code printed on it.
- The QR encodes a URL: `/menu?table=7` (where 7 is the table ID).
- When scanned, the app reads the `table` URL param and stores it in `sessionStorage`.
- The customer **never manually enters or selects** their table. It is automatic and silent.
- The table ID travels with every API call as a required field.
- If `table` param is missing or invalid, show a friendly error: *"Please scan the QR code on your table to start ordering."*

**This is non-negotiable. Build nothing in the ordering flow until table ID is confirmed.**

---

## 2. User roles and their interfaces

### 2.1 Customer (mobile web, in-restaurant)
**Entry point:** QR code scan → `/menu?table={id}`  
**Device:** Mobile phone browser (no app install)  
**What they can do:**
- Browse the menu by category
- View item details (photo, description, allergens, price)
- Add items to cart with optional per-item notes
- Review and edit cart
- Place order (no account, no payment at this step)
- Track order status in real time (3 stages)
- Add more items to an existing open order
- Call the waiter (soft button)
- View receipt at end

**What they cannot do:**
- Select or change their table
- See other tables' orders
- Access any staff interface

---

### 2.2 Kitchen / Chef (dedicated screen, kitchen area)
**Entry point:** `/kitchen` (password-protected, always open on kitchen screen)  
**Device:** Tablet or monitor, landscape orientation  
**What they see:**
- All active orders as cards, sorted by time placed (oldest first = top priority)
- Each card shows: Table number (large), timestamp, list of items, per-item notes (highlighted in amber)
- Sound alert + visual flash on every new incoming order
- Order status buttons: `[Preparing]` → `[Ready]`

**Workflow:**
1. New order arrives → card appears + sound plays → chef taps `[Preparing]`
2. Food is done → chef taps `[Ready]`
3. Card moves to a "Done" column or disappears after delivery is confirmed

**Rules:**
- Kitchen screen must NEVER require a page refresh to get new orders. Use polling (every 10s) or WebSocket.
- The table number is the most visually prominent element on each card. Font size minimum 28px.
- Per-item notes (allergies, special requests) must be styled differently — amber background, clearly separated from the item name.
- Show a counter of pending orders in the browser tab title: `(3) Kitchen Display`.

---

### 2.3 Waiter / Floor staff (mobile or tablet)
**Entry point:** `/waiter` (password-protected)  
**Device:** Mobile phone or tablet  
**What they see:**
- The floor plan (the client's designed map) with a live status dot on each table:
  - ⚪ Gray — table empty / no active session
  - 🔵 Blue — customer seated, browsing (QR scanned, no order yet)
  - 🟡 Amber — order placed, kitchen preparing
  - 🟢 Green — food ready, needs to be delivered
- A list view of all "Ready" orders (for quick reference without looking at the map)
- Notification (sound or visual) when a table's food is ready

**Workflow:**
1. Kitchen marks order as `Ready` → table dot turns green → waiter gets alert
2. Waiter delivers the food → taps the table on the floor plan → taps `[Delivered]`
3. Table dot returns to blue (still seated) or gray (if session closed)
4. If customer taps "Call Waiter" → a ⚑ flag appears on the waiter's floor plan on that table

**Rules:**
- Floor plan tapping must be intuitive — tapping a table opens a small popup with that table's current order and status.
- The "Ready" list must sort by how long the food has been waiting (most urgent first).
- A visual timer on each Ready order card (e.g., "Ready 4 min ago") to prevent forgotten deliveries.

---

### 2.4 Manager / Admin (desktop)
**Entry point:** `/admin` (separate auth)  
**Device:** Desktop browser  
**What they see:**
- Full order history with timestamps per status change
- Floor plan overview (all table statuses)
- Average preparation time per item / per session
- Auto-flagged delayed orders (configurable threshold, default: 25 minutes from placed to delivered)
- Ability to manually close a table session

---

## 3. Complete ordering flow (step by step)

### Step 1 — QR scan & session init
```
Customer scans QR → browser opens /menu?table=7
App reads URL param → validates table ID exists in DB
Stores tableId in sessionStorage
Stores sessionId (UUID) in sessionStorage
Sends "table active" event to backend (table status → "seated")
```

### Step 2 — Menu browsing
```
Menu loads with categories (tabs or scroll sections)
Each item: photo, name, price, allergen tags, short description
Tapping an item opens a bottom sheet / detail modal
Detail modal: large photo, full description, allergens, quantity selector, note field, [Add to cart] button
First item added → sticky cart bar appears at bottom of screen (never hides while items are in cart)
```

### Step 3 — Cart
```
Sticky cart bar shows: item count + total price → tapping opens cart screen
Cart screen: list of items, quantity +/- per item, per-item notes visible, remove button
General order note field at bottom (e.g., "One guest is celiac")
Order total (no tax/service charge at this step — just items)
Single CTA button: [Place Order]
```

### Step 4 — Order confirmation
```
Customer taps [Place Order]
App sends POST /orders with: { tableId, sessionId, items: [...], notes: "...", timestamp }
Backend writes order to DB with status: "placed"
Backend triggers kitchen display update (WebSocket push or polling will catch it)
App shows success screen: "Order received! 🎉 Table 7 · 3 items"
After 2 seconds, transitions to live tracking screen
```

### Step 5 — Live tracking screen
```
Three-stage progress indicator:
  [● Placed] → [○ Preparing] → [○ Ready]

App polls GET /orders/{orderId}/status every 12 seconds
When status changes to "preparing" → second dot fills, banner: "Your meal is being prepared 🍳 Est. 15–20 min"
When status changes to "ready" → third dot fills green, banner pulses: "Your order is ready! On its way 🍽️"
When status changes to "delivered" → full screen: "Enjoy your meal! 💚" + [Call Waiter] + [View Receipt]

Always visible on tracking screen: [Call Waiter] link (subtle, bottom of page)
Always visible: the items they ordered (collapsed summary)
```

### Step 6 — Add more items (reorder within session)
```
From the tracking screen, customer can tap [+ Add to order]
This returns them to the menu with the same tableId and sessionId
New items create a new order linked to the same session (same table)
Kitchen receives a new order card (linked orders shown together on kitchen display)
```

---

## 4. Database schema

### Tables collection / table
```
id          — integer or UUID (matches QR code)
label       — string (e.g., "Table 7", "Terrace 2")
capacity    — integer
status      — enum: "empty" | "seated" | "ordering" | "waiting" | "ready" | "delivered"
floor_zone  — string (optional: "main", "terrace", "bar") — for floor plan grouping
x_pos       — float (position on floor plan map, % of canvas width)
y_pos       — float (position on floor plan map, % of canvas height)
```

### Sessions collection / table
```
id          — UUID
table_id    — FK → tables.id
started_at  — timestamp
closed_at   — timestamp (null if open)
status      — enum: "active" | "closed"
```

### Orders collection / table
```
id          — UUID
session_id  — FK → sessions.id
table_id    — FK → tables.id
status      — enum: "placed" | "preparing" | "ready" | "delivered" | "cancelled"
general_note — string (nullable)
placed_at   — timestamp
preparing_at — timestamp (nullable, set when chef taps Preparing)
ready_at    — timestamp (nullable, set when chef taps Ready)
delivered_at — timestamp (nullable, set when waiter taps Delivered)
```

### Order items collection / table
```
id          — UUID
order_id    — FK → orders.id
menu_item_id — FK → menu_items.id
quantity    — integer
unit_price  — decimal (snapshot at time of order)
note        — string (nullable, per-item special request)
```

### Menu items collection / table
```
id          — UUID
name        — string
description — string
price       — decimal
category    — string (e.g., "starters", "mains", "desserts", "drinks")
photo_url   — string
allergens   — array of strings
available   — boolean (allows disabling items in real time)
sort_order  — integer
```

---

## 5. API contract

> All endpoints return JSON. All error responses follow: `{ error: string, code: string }`.  
> Authentication for staff endpoints: Bearer token or session cookie.  
> `tableId` and `sessionId` come from the client's sessionStorage on every order request.

### Customer-facing (public, no auth)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/menu` | Full menu grouped by category |
| GET | `/menu/items/:id` | Single item detail |
| GET | `/tables/:id/validate` | Confirm table exists and is valid |
| POST | `/sessions` | Start a session `{ tableId }` → returns `{ sessionId }` |
| POST | `/orders` | Place an order `{ tableId, sessionId, items, generalNote }` |
| GET | `/orders/:id/status` | Poll order status → `{ status, estimatedMinutes }` |
| POST | `/orders/:id/callwaiter` | Triggers call-waiter flag on waiter interface |

### Kitchen display (staff auth required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/kitchen/orders` | All active orders (status: placed or preparing) |
| PATCH | `/orders/:id/status` | Update status `{ status: "preparing" \| "ready" }` |
| GET | `/kitchen/orders/stream` | SSE or WebSocket stream for live updates |

### Waiter interface (staff auth required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/floorplan` | All tables with current status + position data |
| GET | `/waiter/ready` | Orders with status "ready", sorted by wait time |
| PATCH | `/orders/:id/status` | Update status `{ status: "delivered" }` |
| GET | `/waiter/flags` | Tables where customer tapped "Call Waiter" |
| DELETE | `/waiter/flags/:tableId` | Clear call-waiter flag after waiter arrives |

### Admin (admin auth required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/orders` | Full order history with filters |
| GET | `/admin/metrics` | Avg prep time, order counts, table turnover |
| PATCH | `/sessions/:id/close` | Manually close a session |
| GET | `/admin/alerts` | Delayed orders (past threshold) |

---

## 6. Real-time update strategy

**Recommended approach: polling + Server-Sent Events (SSE)**

### Customer side (order status tracking)
- Poll `GET /orders/:id/status` every 12 seconds while on the tracking screen.
- Stop polling when status is `"delivered"` or user leaves the page.
- On status change detected: animate the progress bar, show the relevant banner notification.
- Do NOT use full page refresh. Update only the status components in the DOM.

### Kitchen display
- Use SSE (`GET /kitchen/orders/stream`) to receive new order events in real time.
- On new order event: add card to the top of the queue, play notification sound (use Web Audio API — browsers block auto-play without a prior user interaction, so trigger the audio context on the first user click on the kitchen screen).
- Fallback: if SSE is not supported, poll every 8 seconds.

### Waiter interface (floor plan updates)
- Poll `GET /floorplan` every 15 seconds to refresh table statuses and dot colors.
- When status changes to "ready" on any table: show a push notification (browser Notification API, permission requested on first load) + play a short sound.

### Status update propagation flow
```
Chef taps [Ready] on kitchen display
  → PATCH /orders/:id/status { status: "ready" }
  → Backend updates order.status + order.ready_at
  → Backend updates table.status to "ready"
  → SSE event pushed to kitchen stream
  → Waiter's next poll (≤15s) picks up the green dot
  → Customer's next poll (≤12s) picks up the status change
  → All UIs update without page refresh
```

---

## 7. Notification content & UX rules

### 7.1 Customer notification states

| Trigger | UI element | Message |
|---------|-----------|---------|
| Order placed | Full-screen success → fades to tracker | "Order received! 🎉 Table {N} · {X} items" |
| Status → preparing | Slide-in top banner (stays 4s, then becomes bar) | "Your meal is being prepared 🍳 Est. {time}" |
| Status → ready | Pulsing green banner (persistent until delivered) | "Your order is ready — almost there! 🍽️" |
| Status → delivered | Warm full-screen state | "Enjoy your meal! 💚" |
| Long wait (>20 min no update) | Soft inline message | "Still cooking — thanks for your patience 🙏" |

**Customer notification rules:**
- Never use `window.alert()` or blocking popups.
- Never interrupt the customer while they are browsing or editing the cart.
- All banners slide in from the top, auto-dismiss after 4 seconds unless they are persistent (Ready state stays visible).
- Colors: blue for info, amber for in-progress, green for success, never red for normal states.

### 7.2 Kitchen alert rules
- New order: flash the entire screen once (100ms white overlay) + play a short beep (440Hz, 0.3s).
- The new order card slides in from the top of the queue with a 300ms animation.
- Table number on each card: minimum `font-size: 28px`, `font-weight: 700`.
- Special notes: background `#FFF3CD` (amber), border-left `4px solid #F59E0B`, padding `6px 10px`.
- No notification for status changes initiated by the kitchen themselves.

### 7.3 Waiter alert rules
- When an order becomes "ready": browser push notification if permission granted, else a pulsing green badge on the waiter interface header.
- Sound: a soft double-chime (different from kitchen sound so they're distinguishable).
- Floor plan table dot transitions: smooth CSS transition (0.4s ease) on color change.
- "Call Waiter" flag: a small ⚑ icon appears on the table on the floor plan. It flashes slowly until cleared.

---

## 8. Floor plan integration

The client's custom floor plan design is already built. This section defines how to connect it to live data.

### Table status → dot color mapping
```
"empty"     → dot color: #9CA3AF (gray)     — no active session
"seated"    → dot color: #3B82F6 (blue)     — QR scanned, no order placed
"ordering"  → dot color: #3B82F6 (blue)     — browsing / cart open
"waiting"   → dot color: #F59E0B (amber)    — order placed, kitchen preparing
"ready"     → dot color: #22C55E (green)    — food ready, needs delivery
"delivered" → dot color: #3B82F6 (blue)     — food delivered, still seated
```

### Implementation
- Each table on the floor plan SVG or canvas has a `data-table-id` attribute.
- The waiter interface fetches `/floorplan` (returns table list with status + positions).
- For each table returned, find the DOM element with matching `data-table-id` and update its status dot fill/color.
- Tapping a table element opens a bottom sheet showing: table label, current status, active order items (if any), [Mark Delivered] button (if status is ready), [Clear Flag] button (if call-waiter flag is set).
- The floor plan itself does NOT move or change layout — only the status dots/overlays update.

### Call-waiter flag display
- A small flag icon (⚑) rendered as an absolute-positioned overlay on the table's position.
- Flashes with CSS animation: `opacity` between 1 and 0.3, 1.2s cycle, infinite.
- Cleared by the waiter tapping the table and tapping [I'm here].

---

## 9. UX rules — enforced without exception

1. **Table ID is always auto-detected from QR. Never prompt the customer to enter it.**
2. **The sticky cart bar appears after the first item is added and never disappears while items exist in the cart.** It shows item count + running total.
3. **Maximum 3 taps from landing on the menu to order confirmed:** Browse → Cart → Place Order.
4. **No account creation is required.** Session is anonymous, tied to the table.
5. **Per-item notes are always optional, never required.** The note field is collapsed by default, revealed by a small "Add note" link.
6. **Estimated time must show on the "Preparing" screen.** Even a range (e.g., "15–20 min") reduces customer anxiety. Pull from a configurable setting per menu category or a global default.
7. **"Add more items" must be accessible from the tracking screen.** Customers should never feel locked out of ordering more.
8. **"Call Waiter" is always visible** on the tracking screen and receipt screen but styled as a small text link, not a prominent button, to avoid accidental taps.
9. **The kitchen screen must never require a page refresh.** It is a live operational tool.
10. **All status changes must propagate within 15 seconds** to all interfaces without requiring manual refresh.
11. **Disabled menu items (unavailable=true) must be visually greyed out** with a "Not available today" label. They must not be addable to cart.
12. **The session stays open until the manager or waiter closes it.** A customer walking away does not auto-close. Auto-close only after configurable inactivity (default: 3 hours).
13. **Every order must be recoverable.** If the customer closes their browser and re-scans the QR, re-attach them to the existing open session.
14. **On the receipt, show the full order with item names, quantities, notes, and subtotal.** Do not show payment details here (handled separately at the end of the visit).

---

## 10. Session recovery logic

```
Customer scans QR → app reads tableId from URL
App checks sessionStorage for existing sessionId

IF sessionId exists in sessionStorage:
  → GET /sessions/{sessionId}/validate
  → If valid and open: resume session (show tracking or menu)
  → If not found or closed: start new session

IF no sessionId in sessionStorage:
  → GET /tables/{tableId}/active-session
  → If open session exists for this table: attach to it (update sessionStorage)
  → If no open session: POST /sessions to create one
```

This ensures that a customer who closes their browser mid-order can re-scan and pick up exactly where they left off, including their order status.

---

## 11. Error states to handle

| Situation | What to show |
|-----------|-------------|
| QR param missing or table ID invalid | "Please scan the QR code at your table to get started." |
| Menu fails to load | "Can't load the menu right now. Please ask your waiter." |
| Order submission fails | "Something went wrong. Your order wasn't placed. Try again or ask your waiter." — with a retry button |
| Order status polling fails 3 times in a row | "We're having trouble updating your order status. Your order is confirmed — please ask your waiter if you need help." |
| Item becomes unavailable between adding to cart and placing order | "Sorry, {item name} just became unavailable. We've removed it from your cart." — remove the item and re-show the cart |
| Kitchen screen loses connection | Show a visible banner: "Connection lost — attempting to reconnect…" in amber. Auto-retry every 10s. |

---

## 12. Implementation phases

### Phase 1 — Core ordering (build first)
- [ ] QR → table ID detection and sessionStorage binding
- [ ] Menu display (categories, items, detail modal)
- [ ] Add to cart with notes, sticky cart bar
- [ ] Cart review screen
- [ ] POST /orders endpoint
- [ ] Order confirmed screen → tracking screen with polling
- [ ] Kitchen display: order cards, Preparing + Ready buttons, sound alerts

### Phase 2 — Waiter & floor plan integration
- [ ] Floor plan with live status dots
- [ ] Waiter "Ready" list with timers
- [ ] Delivered confirmation flow
- [ ] Call waiter flag (customer → waiter interface)
- [ ] Table status lifecycle (empty → seated → waiting → ready → delivered)

### Phase 3 — Refinements & session management
- [ ] Session recovery on re-scan
- [ ] Add more items to existing order
- [ ] Disabled menu items (real-time unavailability)
- [ ] Estimated time display (configurable per category)
- [ ] Receipt screen

### Phase 4 — Admin & metrics
- [ ] Admin dashboard (order history, delay alerts)
- [ ] Avg prep time metrics
- [ ] Manual session close
- [ ] Manager floor overview

---

## 13. Tech stack guidance (flexible, adapt to project)

- **Frontend:** Any modern JS framework. Vanilla JS also works for the menu/customer side if preferred.
- **Real-time:** Server-Sent Events (SSE) preferred for kitchen display (unidirectional, simple). WebSocket optional for bidirectional needs.
- **Database:** Any relational DB (PostgreSQL preferred for JSON support on allergens/notes). Firebase/Supabase also viable for real-time built-in.
- **Auth for staff:** Simple session-based or JWT. Kitchen and waiter screens share a staff role; admin is separate.
- **QR generation:** Any QR library. Encode the full URL with table param. Print one per table.
- **Sounds:** Web Audio API (not `<audio>` tags) for kitchen/waiter alerts — more reliable autoplay.

---

## 14. What is already built (do not rebuild)

- Reservation system with email confirmation and receipt flow.
- Floor plan visual design (the map layout and styling — only connect status dots to it).
- Digital menu browsing UI (if this exists — confirm with client before rebuilding).

---

## 15. Questions to confirm with the client before building

1. What is the exact tech stack already in use (framework, database, hosting)?
2. Is the floor plan built as SVG, canvas, or an image? This determines how status dots are injected.
3. Are staff (kitchen, waiter) using dedicated shared devices or personal phones?
4. Should the customer be able to pay through the app, or is payment always done by the waiter at the end?
5. Is there a printer in the kitchen, or is the kitchen screen the only display?
6. What is the expected number of simultaneous tables / active orders at peak?
7. Should the menu be editable by the client (CMS) or is it hardcoded for now?

---

*End of brief. All sections above are required. Build in the order defined in Section 12.*
