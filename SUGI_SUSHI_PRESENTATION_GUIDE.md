# SUGI SUSHI — Client Presentation & Training Guide
**Project: Digital Menu & Real-Time Ordering System**

---

## 1. The Core Vision: "Cinematic Luxury"
*   **The Goal:** Not just a menu, but a "Cinematic Experience."
*   **Aesthetics:** High-end typography, fluid animations, and a dark, luxury-focused UI that matches the brand’s premium status.
*   **Responsive Excellence:** The system is fully optimized for **iPhone, iPad, and Desktop**, ensuring a perfect layout regardless of the device.

---

## 2. The "Magic" Behind the Scenes: Table Identity
*   **QR Code Automation:** Every table has a unique QR code. When scanned, the system **automatically knows** the table number.
*   **No Manual Input:** Customers never have to select their table; it’s silent, automatic, and prevents ordering errors.
*   **Session Recovery:** If a customer closes their browser or their phone dies, they just re-scan the QR code to pick up exactly where they left off (cart and order status are preserved).

---

## 3. The Customer Flow (Live Demo Steps)

### A. Discovery & Browsing
*   **Landing Page:** Point out the "Reserve a Place" and "Our Menu" buttons.
*   **Visual Categories:** Show the new "Curated Selections" section. Each category has its own professional photo and Kanji watermark.
*   **Smart Search:** Customers can search by name, description, or ingredients (e.g., searching "Truffle").

### B. The Order & Cart
*   **Dish Modals:** Tapping a dish shows large photos, detailed descriptions, and **Allergen Tags**.
*   **Portion Selection:** If a roll comes in 4 or 8 pieces, the customer chooses easily.
*   **Multi-Order Support:** Customers can place an initial order, then **add more items later** (e.g., adding a dessert or another drink). Both orders appear in the tracking view.

### C. Live Tracking
*   **Real-Time Status:** The customer sees exactly where their food is:
    *   `PLACED`: Received by the system.
    *   `PREPARING`: The Chef has started cooking (shows an estimated time).
    *   `READY`: The food is finished and the waiter is bringing it.

---

## 4. Staff Interfaces (Efficiency Tools)

### A. The Kitchen Display (/kitchen)
*   **Live Dashboard:** No page refreshes needed. Orders appear instantly with a sound alert.
*   **Prioritization:** Orders are sorted by time (oldest first) so nothing is forgotten.
*   **Clarity:** Table numbers are huge (28px+) for visibility across the kitchen. Special notes (e.g., "No Mayo") are highlighted in amber.

### B. The Waiter Interface (/waiter)
*   **Floor Plan:** A live visual map of the restaurant.
*   **Status Dots:** Colors change based on what's happening (e.g., Table 5 turns Green when food is ready).
*   **Call Waiter Feature:** A flashing flag appears on the map when a customer needs assistance, alerting the staff immediately.

---

## 5. Technical Powerhouse: Supabase & Real-Time
*   **Instant Updates:** We use a "Real-Time Database." When the Chef taps "Ready," the customer’s phone updates in less than 2 seconds.
*   **Multi-Language:** Fully functional in **English and Arabic** (RTL support).
*   **Admin Control:** The owner can update prices, add new dishes, and change photos through the Admin dashboard, with changes reflecting instantly on the menu.

---

## 6. Training Tips for the Client
*   **QR Codes:** Each QR must be unique to the table.
*   **Kitchen Habits:** Stress the importance of the Chef tapping "Preparing" and "Ready" to keep customers informed.
*   **Media:** High-quality photos are the key to the "Cinematic" feel.

---
*Prepared for the Sugi Sushi Ownership Meeting.*
