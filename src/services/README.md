# Rehoyah Backend & Database Integration Guide (`src/services/`)

This folder isolates all data reading and writing behind clean JavaScript service modules so you can connect a real backend and database (PostgreSQL, Supabase, Firebase, Node/Express, etc.) **without rewriting React UI components**.

Currently, `src/config/appConfig.js` has `DEMO_MODE: true`. Every service uses in-memory demo data and `localStorage` demo persistence (`src/services/demoStore.js`).

---

## 1. Where Database Connection Configuration Goes

1. Keep **no database secrets or service-role keys** inside `src/`. Vite bundles everything in `src/` for the browser.
2. Put public browser-safe variables (such as `VITE_API_BASE_URL` or public auth client keys) in `.env` and `.env.example`.
3. Put database connection strings, JWT signing secrets, storage secret keys, and Paystack secret keys strictly in your **backend server environment**.
4. Update `src/config/appConfig.js` (`DEMO_MODE: false`) once all services below call real endpoints.

---

## 2. Service Module → Entity Mapping & Functions to Replace

| Service Module | Replaces Demo Behavior With | Suggested Database Entities |
| --- | --- | --- |
| `authService.js` | `login`, `logout`, `getCurrentUser`, `registerCustomer`, `requestPasswordReset` | `users`, `profiles`, `staff_profiles`, `roles` |
| `productService.js` | `getProducts`, `getProductBySlug`, `createProduct`, `updateProduct`, `deleteProduct`, `getCategories`, `createCategory`, `updateCategory`, `deleteCategory` | `products`, `product_categories`, `product_variants`, `inventory` |
| `orderService.js` | `getOrders`, `getOrderById`, `createOrderDraft`, `updateOrderStatus`, `cancelOrder` | `orders`, `order_items`, `delivery_addresses`, `payments` |
| `quoteService.js` | `getQuotes`, `getQuoteById`, `createQuoteRequest`, `updateQuoteStatus`, `assignQuoteStaff`, `addQuoteNote`, `saveQuotation` | `quote_requests`, `quotations`, `quotation_items` |
| `projectService.js` | `getProjects`, `getProjectById`, `getProjectBySlug`, `createProject`, `updateProject`, `addProjectUpdate`, `toggleMilestone` | `projects`, `project_members`, `project_milestones`, `project_updates`, `project_media` |
| `contentService.js` | `getServices`, `saveService`, `getArticles`, `saveArticle`, `getTestimonials`, `moderateTestimonial`, `getAppointments`, `createAppointment`, `updateAppointmentStatus`, `getSettings`, `updateSettings`, `subscribeNewsletter`, `submitContactMessage` | `services`, `articles`, `article_categories`, `portfolio_items`, `portfolio_media`, `testimonials`, `appointments`, `company_settings`, `homepage_content` |
| `staffService.js` | `getStaff`, `createStaffInvite`, `updateStaff`, `updatePermissions`, `getTasks`, `assignTask`, `updateTaskStatus`, `getActivityLogs`, `logActivity` | `staff_profiles`, `roles`, `permissions`, `staff_role_assignments`, `tasks`, `activity_logs` |
| `uploadService.js` | `previewFile`, `uploadImage` | Cloud object storage (S3, Cloudflare R2, Supabase Storage, or Firebase Storage) |
| `notificationService.js` | `getNotifications`, `markNotificationRead`, `sendNotification` | `notifications` + transactional email/SMS provider |

---

## 3. Suggested Relational Data Model Outline

*(Adapt field types to PostgreSQL, MySQL, or Firestore as preferred; enforce constraints, foreign keys, ownership rules, and indexes before production.)*

- **Identity & Access**
  - `users` (`id`, `email`, `password_hash`, `role` [`customer` | `staff` | `admin`], `status`, `created_at`)
  - `profiles` (`user_id` → `users.id`, `full_name`, `phone`)
  - `staff_profiles` (`user_id` → `users.id`, `department`, `staff_role_title`, `invited_by`, `is_active`)
  - `roles` (`id`, `name`, `description`)
  - `permissions` (`id`, `key`, `description`)
  - `staff_role_assignments` or `staff_permissions` (`staff_user_id`, `permission_key`)
- **Shop & Inventory**
  - `product_categories` (`id`, `parent_id`, `name`, `slug`, `description`, `image_url`, `display_order`, `active`)
  - `products` (`id`, `category_id` → `product_categories.id`, `sku`, `name`, `slug`, `price`, `sale_price`, `featured`, `status` [`draft` | `pending` | `published` | `archived`], `description`)
  - `product_variants` (`id`, `product_id`, `label`, `sku_suffix`, `price_override`)
  - `inventory` (`product_id`, `variant_id`, `stock_quantity`, `updated_at`)
  - `wishlists` (`user_id`, `product_id`, `created_at`)
  - `carts` (`id`, `user_id`, `items_json`, `updated_at`)
- **Orders & Payments**
  - `delivery_addresses` (`id`, `user_id`, `label`, `street`, `city`, `state`, `notes`)
  - `orders` (`id`, `order_number`, `customer_id`, `delivery_method`, `address_snapshot`, `subtotal`, `total`, `fulfillment_status`, `payment_status`, `created_at`)
  - `order_items` (`id`, `order_id`, `product_id`, `variant_label`, `quantity`, `unit_price`)
  - `payments` (`id`, `order_id`, `provider` [`paystack`], `reference`, `amount`, `status`, `verified_at` — **never store raw card numbers**)
- **Quotations & Appointments**
  - `quote_requests` (`id`, `customer_id`, `name`, `phone`, `email`, `location`, `service_name`, `property_type`, `description`, `budget_range`, `timeline`, `site_inspection_requested`, `status`, `assigned_staff_id`)
  - `quotations` (`id`, `quote_request_id`, `discount`, `total`, `valid_until`, `terms`, `status`)
  - `quotation_items` (`id`, `quotation_id`, `description`, `quantity`, `unit_rate`)
  - `appointments` (`id`, `customer_id`, `name`, `email`, `phone`, `consultation_type`, `preferred_date`, `preferred_slot`, `mode`, `location`, `status`, `assigned_staff_id`)
- **Projects & Operations**
  - `projects` (`id`, `title`, `slug`, `customer_id`, `category`, `location`, `project_type`, `status`, `progress`, `featured`, `published`, `budget_amount`)
  - `project_members` (`project_id`, `staff_user_id`, `role_on_project`)
  - `project_milestones` (`id`, `project_id`, `title`, `completed`, `due_date`)
  - `project_updates` (`id`, `project_id`, `author_id`, `note`, `created_at`)
  - `project_media` (`id`, `project_id`, `url`, `media_role` [`gallery` | `before` | `after`])
  - `tasks` (`id`, `title`, `description`, `priority`, `due_date`, `status`, `assigned_to_id`, `assigned_by_id`, `related_type`, `related_id`)
- **Content & Auditing**
  - `services` (`id`, `name`, `slug`, `category`, `short_description`, `description`, `image_url`, `featured`, `active`, `display_order`)
  - `portfolio_items` / `portfolio_media` (can share or extend `projects` / `project_media`)
  - `article_categories` & `articles` (`id`, `title`, `slug`, `category`, `excerpt`, `body_json`, `image_url`, `status`, `seo_title`, `seo_description`)
  - `testimonials` (`id`, `customer_name`, `project_type`, `rating`, `text`, `related_project_id`, `approval_status`, `published`)
  - `notifications` (`id`, `recipient_user_id`, `title`, `message`, `read`, `created_at`)
  - `activity_logs` (`id`, `actor_id`, `action`, `target_type`, `target_name`, `detail`, `created_at`)
  - `company_settings` & `homepage_content` (`key`, `value_json`, `updated_at`)

---

## 4. Expected Data Shapes

Every service function returns a Promise resolving to either:
- A list array (e.g. `getProducts()` -> `Promise<Product[]>`)
- A single record or `null` (e.g. `getProductBySlug()` -> `Promise<Product | null>`)
- An action result `{ ok: boolean, data?: any, error?: string, isDemo?: boolean }`

---

## 5. Connecting Authentication, File Uploads, Payments & Security

- **Authentication**: Replace `authService.js` with HTTP-only cookie sessions or verified JWT tokens from your auth provider. Public registration MUST always assign role `customer`. Staff/Admin accounts MUST only be provisioned via protected backend admin invite endpoints.
- **Authorization**: Enforce the exact permission keys in `src/utils/permissions.js` on your backend API middleware and database rules. Frontend checks are UI previews only.
- **Image Uploads**: Update `uploadService.js` to request a signed upload URL from your backend, validate file MIME type (`image/jpeg`, `image/png`, `image/webp`) and max file size on both client and server, and store files in private/public buckets with strict access policies.
- **Paystack Integration**: Initialize Paystack checkout from your backend, redirect or open Paystack inline with your **public** key only, and **verify the transaction webhook/reference server-side** using your secret key before marking any order `Paid`.

---

## 6. Post-Integration Testing Checklist

- [ ] Customer cannot fetch or modify another customer's orders, quotes, or addresses.
- [ ] Staff without `manageStaff` or `publishProducts` gets `403 Forbidden` from backend even if calling API directly.
- [ ] Quote, contact, and booking forms persist to DB and trigger real notifications.
- [ ] Cart checkout creates an unpaid order and verifies Paystack webhook before marking paid.
- [ ] Uploaded images pass server-side size/type checks and load properly over HTTPS.
