
# Product Requirements Document: Modern Full-Stack E-Commerce Platform (Chinese)

## 1. Project Overview

This project aims to build a modern, responsive, and progressive full-stack E-Commerce platform in Chinese. The platform will cater to both customers (storefront) and administrators (backend management). We will adopt a progressive development approach, starting with mock data to establish core functionalities and UI, then transitioning to real data integration as backend services and database are implemented.

**Target Audience:**

*   **Customers:** Chinese-speaking users who want to browse and purchase products online.
*   **Administrators:** Internal users who manage products, categories, orders, users, and system settings.

**Key Goals:**

*   Develop a user-friendly and visually appealing storefront for customers.
*   Implement robust user account management features.
*   Create an efficient admin panel for platform management.
*   Ensure a responsive design across different devices.
*   Utilize modern web technologies for performance and maintainability.

## 2. Technology Stack Rationale

We will leverage a modern JavaScript/TypeScript stack to ensure a performant and maintainable application. The chosen technologies are selected for their strengths in building modern web applications:

1.  **Svelte 5 & SvelteKit:**  Svelte 5 with runes offers a reactive programming model that simplifies building dynamic UIs. SvelteKit, as a metaframework, provides routing, server-side rendering (SSR), and build optimizations out-of-the-box, leading to excellent performance and SEO.
2.  **sveltekit-superforms & Valibot:**  This combination provides a type-safe and efficient way to handle forms. Valibot allows us to define validation schemas as a single source of truth, ensuring consistency between client-side and server-side validation. `sveltekit-superforms` simplifies form handling in SvelteKit, automatically managing form state and errors.
3.  **Sqlite3 & Drizzle ORM:** Sqlite3 is a lightweight and file-based database, ideal for development and potentially for smaller deployments. Drizzle ORM provides type-safe database interactions, reducing runtime errors and improving developer experience. It allows us to define our database schema in TypeScript and generate SQL queries.
4.  **Tailwind CSS, shadcn-svelte, lucide-svelte:** Tailwind CSS offers utility-first styling for rapid UI development and consistent design. `shadcn-svelte` provides a library of accessible and customizable UI components built with Svelte and Tailwind CSS, accelerating UI development and ensuring a modern look and feel. Lucide Icons (`lucide-svelte`) provides a consistent and beautiful icon set.
5.  **better-auth:**  A dedicated authentication library to handle user registration, login, logout, password reset, and email verification, ensuring secure user management.

## 3. Core Functionalities - Detailed Breakdown

### 3.1. Storefront (Customer Facing)

*   **Homepage:**
    *   Display featured products and categories.
    *   Promotional banners or carousels.
    *   Navigation to product categories and search.
*   **Product Listing Page (PLP):**
    *   Display products within a category or search results.
    *   Filtering and sorting options (e.g., price, popularity, new arrivals).
    *   Pagination for large product lists.
    *   Product cards with image, name, price, and "Add to Cart" button.
*   **Product Detail Page (PDP):**
    *   Detailed product information: name, description, images (carousel/gallery), price, availability, specifications.
    *   Quantity selection.
    *   "Add to Cart" button.
    *   Customer reviews (optional in initial phase, can be added later).
    *   Related products recommendations (optional in initial phase).
*   **Search:**
    *   Header search bar for quick product search across the platform.
    *   Search results page displaying relevant products.
    *   Search suggestions (optional, can be added later).

### 3.2. User Account Management (Accessible from Header Menu)

*   **Profile Page (`/me/profile`):**
    *   **Display:** User's name, avatar (if available), email, phone number, addresses (linked).
    *   **Edit:** "Edit Profile" button/icon to navigate to profile edit form.
*   **Account Settings Page (`/me/settings`):**
    *   **Change Password:** Form to update user password (requires current password confirmation).
    *   **Change Email (Username):** Form to update user email address (may require email verification).
*   **Orders Page (`/me/orders`):**
    *   **Display:** List of user's past orders.
        *   Order ID, Order Date, Order Status (e.g., Pending, Processing, Shipped, Delivered, Cancelled), Total Price.
    *   **Actions:**
        *   "View Order Details" to see individual order items and shipping information.
        *   "Cancel Order" button (if order status allows, e.g., before processing).
        *   "Remove Order" button (for completed or cancelled orders, to hide from the list, soft delete).
*   **Addresses Page (`/me/addresses`):**
    *   **Display:** List of saved addresses.
        *   Receiver Name, Phone Number, Full Address (Province, City, District, Detailed Address), Default Address indicator.
    *   **Actions:**
        *   "Add New Address" button to open address creation form.
        *   "Edit Address" button/icon for each address to open address edit form.
        *   "Remove Address" button/icon for each address to delete address.
        *   "Set as Default Address" option (radio button or toggle) for each address.
*   **Carts Page (`/me/cart`):**
    *   **Display:** List of items in the shopping cart.
        *   Product Image, Product Name, Price per item, Quantity, Total Price per item.
    *   **Actions:**
        *   "Remove from Cart" button/icon for each item.
        *   Quantity input to adjust the quantity of each item.
    *   **Summary:**
        *   Subtotal, Shipping cost (initially can be fixed or calculated based on mock data), Total price.
    *   **Checkout:** "Proceed to Checkout" button, leading to checkout summary page.
*   **Checkout Page (`/me/checkout`):**
    *   **Order Summary:** Review of items in the cart, quantities, prices.
    *   **Shipping Address Selection:** Choose from saved addresses or add a new address.
    *   **Payment Method Selection:** (Initially, mock payment methods can be used. Real payment gateway integration will be a later phase).
    *   **"Place Order" button:** Submits the order.
    *   **Order Confirmation:** Display order success message and order ID.
*   **Logout:** Clear user session and redirect to homepage or login page.

### 3.3. Admin Panel (Accessible from Header Menu - Admin Users Only)

*   **Dashboard/Overview (`/admin/overview`):**
    *   Summary statistics: Total orders, Total revenue, New users, Product stock levels, etc. (Initially can use mock data).
    *   Quick links to manage products, orders, users, etc.
*   **Products Management (`/admin/products`):**
    *   **List Products:** Display a table of products with search, filtering, and pagination.
    *   **Create Product:** Form to add a new product (using `sveltekit-superforms` and `valibot`). Fields: Product Name, Description, Category, Price, Images, Stock Quantity, etc.
    *   **Edit Product:** Form to modify existing product details.
    *   **Delete Product:** Option to remove a product.
*   **Categories Management (`/admin/categories`):**
    *   **List Categories:** Display a hierarchical list of product categories.
    *   **Create Category:** Form to add a new category (Name, Description, Parent Category).
    *   **Edit Category:** Form to modify category details.
    *   **Delete Category:** Option to remove a category.
*   **Orders Management (`/admin/orders`):**
    *   **List Orders:** Display a table of all orders with search, filtering (by status, date), and pagination.
    *   **View Order Details:** Detailed view of an order including items, customer information, shipping address, payment details, order history/status updates.
    *   **Update Order Status:** Dropdown or form to change the status of an order (e.g., Pending -> Processing -> Shipped -> Delivered -> Cancelled).
*   **Users Management (`/admin/users`):**
    *   **List Users:** Display a table of registered users with search, filtering, and pagination.
    *   **View User Details:** Display user profile information, order history, etc.
    *   **Edit User (Basic):**  Potentially allow admin to edit basic user information (name, phone, email - with caution).  Password changes should ideally be user-initiated.
    *   **Disable/Enable User:** Option to deactivate or activate a user account.
*   **System Settings (`/admin/settings`):**
    *   **Payment Management Configuration:** (Initial phase: basic settings. Later phase: integration with payment gateways).
        *   Configure available payment methods (e.g., Alipay, WeChat Pay, Credit Card - for later phases).
        *   Set up payment gateway credentials (for later phases).
    *   **Other System Settings:** (Expand as needed)
        *   Website name, default currency, etc.

### 3.4. Data Storage

*   **RDBMS (Sqlite3 with Drizzle ORM):**  Primary data storage for core entities:
    *   Users, Products, Categories, Orders, Order Items, Addresses, Payments, etc.
    *   Drizzle ORM will be used for type-safe database interactions. Schema will be defined in `src/lib/server/db/schema.ts`.
*   **Browser Storage (localStorage/cookies):**
    *   User preferences: Dark mode/light mode, language preference, potentially shopping cart data (for guest users before login, or as a fallback).

### 3.5. Authentication and Authorization

*   **Authentication:** `better-auth` will be used for:
    *   User registration (email/password).
    *   User login (email/password).
    *   Logout.
    *   Password reset (via email).
    *   Email verification (optional, can be added later).
*   **Authorization:**
    *   **Admin Role:** Basic role-based authorization to protect admin panel routes.  Check if user is an "admin" before allowing access to `/admin/*` routes. (For simplicity, we can start with a simple boolean flag in the user table).
    *   **User Roles (Future Expansion):**  For now, we are focusing on "customer" and "admin" roles. More granular roles (e.g., product manager, order manager) can be considered in future iterations.

### 3.6. Form Handling and Validation

*   **`sveltekit-superforms` and `valibot`:**  Used extensively for form creation and validation, especially in the admin panel for CRUD operations.
*   **Single Source of Truth Schemas (Valibot):** Define validation schemas using `valibot` in `src/lib/vmodels/` directory. These schemas will be used for:
    *   Generating form UI components dynamically.
    *   Client-side validation.
    *   Server-side validation.
    *   Type safety for form data.
*   **Reusable Form Components:** Create *reusable* form components in `src/lib/components/ui/form/` that can be driven by `valibot` schemas, reducing code duplication and ensuring consistency.

### 3.7. Payment Management

*   **Admin Configuration:** Admins can configure payment methods in the admin panel (`/admin/settings/payments`). Initially, this might involve setting up mock payment methods or basic configuration for later payment gateway integrations.
*   **User Payment Instances (Future):**  In later phases, users might be able to manage their saved payment methods (e.g., linked Alipay/WeChat Pay accounts) in their account settings. For now, focus on order checkout payment flow.

## 4. API Endpoints (Conceptual - RESTful Principles)

While we are not building the backend API explicitly in this PRD, it's helpful to outline the conceptual API endpoints for future backend development and for understanding data flow.

*   **Products:**
    *   `GET /api/products`: Get a list of products (with optional query parameters for filtering, pagination, search).
    *   `GET /api/products/{productId}`: Get details of a specific product.
    *   `POST /api/products` (Admin): Create a new product.
    *   `PUT /api/products/{productId}` (Admin): Update an existing product.
    *   `DELETE /api/products/{productId}` (Admin): Delete a product.
*   **Categories:**
    *   `GET /api/categories`: Get a list of categories.
    *   `POST /api/categories` (Admin): Create a new category.
    *   `PUT /api/categories/{categoryId}` (Admin): Update a category.
    *   `DELETE /api/categories/{categoryId}` (Admin): Delete a category.
*   **Orders:**
    *   `GET /api/orders` (Admin): Get a list of all orders (with filtering, pagination).
    *   `GET /api/orders/{orderId}` (Admin & User - for their own orders): Get details of a specific order.
    *   `POST /api/orders` (User): Create a new order (checkout process).
    *   `PATCH /api/orders/{orderId}` (Admin): Update order status.
*   **Users:**
    *   `POST /api/users/register`: Register a new user.
    *   `POST /api/users/login`: User login.
    *   `POST /api/users/logout`: User logout.
    *   `POST /api/users/password/reset/request`: Request password reset.
    *   `POST /api/users/password/reset/confirm`: Confirm password reset.
    *   `GET /api/users/me` (Authenticated User): Get current user's profile.
    *   `PUT /api/users/me` (Authenticated User): Update current user's profile.
    *   `GET /api/users` (Admin): Get a list of users (with filtering, pagination).
    *   `GET /api/users/{userId}` (Admin): Get details of a specific user.
    *   `PUT /api/users/{userId}` (Admin): Update user details (basic).
    *   `PATCH /api/users/{userId}/status` (Admin): Disable/Enable user.
*   **Cart:**
    *   `GET /api/cart`: Get current user's cart.
    *   `POST /api/cart/items`: Add item to cart.
    *   `PUT /api/cart/items/{itemId}`: Update cart item quantity.
    *   `DELETE /api/cart/items/{itemId}`: Remove item from cart.
    *   `DELETE /api/cart`: Clear cart.
*   **Addresses:**
    *   `GET /api/users/me/addresses`: Get current user's addresses.
    *   `POST /api/users/me/addresses`: Add new address.
    *   `PUT /api/users/me/addresses/{addressId}`: Update address.
    *   `DELETE /api/users/me/addresses/{addressId}`: Delete address.

## 5. Database Schema (Conceptual)

This is a simplified conceptual schema. Drizzle ORM schema will be defined in TypeScript in `src/lib/server/db/schema.ts`.

### Tables:
```markdown
Users:  
- id (INTEGER, PRIMARY KEY)  
- email (TEXT, UNIQUE, NOT NULL)  
- password_hash (TEXT, NOT NULL)  
- name (TEXT)  
- phone (TEXT)  
- avatar_url (TEXT)  
- is_admin (BOOLEAN, DEFAULT FALSE)  
- created_at (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)  
- updated_at (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)

Products:  
- id (INTEGER, PRIMARY KEY)  
- category_id (INTEGER, FOREIGN KEY -> Categories.id)  
- name (TEXT, NOT NULL)  
- description (TEXT)  
- price (DECIMAL, NOT NULL)  
- stock_quantity (INTEGER, DEFAULT 0)  
- image_urls (TEXT, JSON array of URLs)  
- created_at (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)  
- updated_at (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)

Categories:  
- id (INTEGER, PRIMARY KEY)  
- name (TEXT, NOT NULL, UNIQUE)  
- description (TEXT)  
- parent_category_id (INTEGER, FOREIGN KEY -> Categories.id, NULLABLE)  
- created_at (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)  
- updated_at (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)

Orders:  
- id (INTEGER, PRIMARY KEY)  
- user_id (INTEGER, FOREIGN KEY -> Users.id, NOT NULL)  
- order_date (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)  
- order_status (TEXT, ENUM - 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', DEFAULT 'Pending')  
- total_amount (DECIMAL, NOT NULL)  
- shipping_address_id (INTEGER, FOREIGN KEY -> Addresses.id, NOT NULL)  
- created_at (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)  
- updated_at (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)

OrderItems:  
- id (INTEGER, PRIMARY KEY)  
- order_id (INTEGER, FOREIGN KEY -> Orders.id, NOT NULL)  
- product_id (INTEGER, FOREIGN KEY -> Products.id, NOT NULL)  
- quantity (INTEGER, NOT NULL)  
- price_per_item (DECIMAL, NOT NULL)

Addresses:  
- id (INTEGER, PRIMARY KEY)  
- user_id (INTEGER, FOREIGN KEY -> Users.id, NOT NULL)  
- receiver_name (TEXT, NOT NULL)  
- phone_number (TEXT, NOT NULL)  
- province (TEXT)  
- city (TEXT)  
- district (TEXT)  
- detailed_address (TEXT, NOT NULL)  
- is_default (BOOLEAN, DEFAULT FALSE)  
- created_at (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)  
- updated_at (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)

PaymentMethods (Future - for user saved payment methods):  
- id (INTEGER, PRIMARY KEY)  
- user_id (INTEGER, FOREIGN KEY -> Users.id, NOT NULL)  
- method_type (TEXT, ENUM - 'Alipay', 'WeChat Pay', 'Credit Card', etc.)  
- account_details (TEXT, JSON or encrypted data)  
- is_default (BOOLEAN, DEFAULT FALSE)  
- created_at (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)  
- updated_at (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)
```

## 6. State Management

*   **Svelte 5 Runes Reactivity:**  Leverage Svelte 5 runes (`$state`, `$derived`, `$effect`) for component-level and application-level state management.
*   **Global Stores (Svelte Stores):**  For application-wide state, consider using Svelte stores (writable, readable, derived) in `src/lib/states/`. Examples:
    *   `authState` (user authentication status, current user info).
    *   `cartState` (shopping cart data).
*   **Component Props:**  Pass data down components using props for localized state.
*   **Context API (Svelte Context):** For sharing state within specific component trees, use Svelte Context API (e.g., for theme context).

## 7. Error Handling

*   **Client-side Error Handling:**
    *   **Form Validation Errors:**  `sveltekit-superforms` automatically handles displaying validation errors from `valibot` schemas.
    *   **API Request Errors:**  Use `try...catch` blocks when making API requests in SvelteKit load functions and form actions. Display user-friendly error messages (e.g., using toast notifications or error components).
    *   **Global Error Handling:**  SvelteKit's `handleError` hook can be used for logging and handling unexpected errors.
*   **Server-side Error Handling:**
    *   **Drizzle ORM Errors:**  Handle database errors gracefully in server-side routes and form actions.
    *   **Validation Errors:**  Server-side validation using `valibot` schemas. Return appropriate error responses to the client.
    *   **API Error Responses:**  Return consistent error responses from API endpoints (e.g., using HTTP status codes like 400, 401, 404, 500 and JSON error messages).

## 8. File Structure Explanation

The provided file structure is organized to promote modularity and maintainability. Here's a breakdown:
```yaml  
├── components.json # Configuration for shadcn-svelte components  
├── drizzle.config.ts # Drizzle ORM configuration  
├── instructions.md # (This file - PRD)  
├── node_modules # Node packages  
├── package.json # Project dependencies  
├── pnpm-lock.yaml # Dependency lock file  
├── src # Source code directory  
│   ├── app.css # Global application styles  
│   ├── app.d.ts # TypeScript declaration file for app-wide types  
│   ├── app.html # Root HTML template  
│   ├── lib # Library directory for reusable code  
│   │   ├── components # Reusable Svelte components  
│   │   │   ├── app-components # Application-specific components (e.g., product cards, order lists)  
│   │   │   ├── ui # UI components from shadcn-svelte (and potentially custom UI components)  
│   │   │   │   └── avatar # Shadcn UI components - organized by component type  
│   │   │   │   ├── badge  
│   │   │   │   ├── button  
│   │   │   │   ├── card  
│   │   │   │   ├── ... # Other shadcn-svelte UI components  
│   │   │   │   └── tooltip  
│   │   │   └── utility # Utility components (e.g., dark mode toggle, tailwind indicator)  
│   │   ├── hooks # SvelteKit hooks (e.g., for server-side logic, authentication)  
│   │   │   └── is-mobile.svelte.ts # Example hook - could be moved to utils or separate hooks folder  
│   │   ├── index.ts # Library entry point (for exports)  
│   │   ├── server # Server-side code (runs only on the server)  
│   │   │   ├── db # Database related code  
│   │   │   ├── index.ts # Database connection and utilities  
│   │   │   └── schema.ts # Drizzle ORM database schema definitions  
│   │   ├── states # Svelte stores for application state management  
│   │   ├── utils.ts # Utility functions (e.g., cn, formatting, date handling)  
│   │   └── vmodels # Validation models (Valibot schemas)  
│   │       ├── auths_vms.ts # Validation schemas for authentication forms  
│   │       ├── domains_vm.ts # Validation schemas for domain entities (e.g., Product, Category)  
│   │       └── index.ts # Validation models entry point  
│   ├── routes # SvelteKit routes - file-based routing  
│   ├── (storeFront) # Route group for storefront routes (layout applied to these routes)  
│   │   ├── checkout # Checkout page route  
│   │   ├── me # User account routes (nested under /me/)  
│   │   ├── search # Search results page route  
│   │   ├── +layout.svelte # Layout for storefront routes  
│   │   └── +page.svelte # Homepage route (/)  
│   ├── +layout.svelte # Root layout for the entire application  
│   ├── admin # Route group for admin panel routes (under /admin/)  
│   ├── overview # Admin dashboard route (/admin/overview)  
│   ├── categories # Admin categories management routes (/admin/categories)  
│   ├── orders # Admin orders management routes (/admin/orders)  
│   ├── products # Admin products management routes (/admin/products)  
│   ├── users # Admin users management routes (/admin/users)  
│   ├── +layout.svelte # Layout for admin panel routes  
│   └── +page.svelte # Admin panel homepage route (/admin/)  
├── static # Static assets (images, fonts, etc.)  
├── svelte.config.js # Svelte configuration  
├── tailwind.config.ts # Tailwind CSS configuration  
├── tsconfig.json # TypeScript configuration  
└── vite.config.ts # Vite build tool configuration
```


**Key Directories:**

*   `src/routes`:  Defines the application's routing structure. SvelteKit uses file-based routing, so files and directories within `routes` map to URL paths. `+page.svelte` files are page components, and `+layout.svelte` files define layouts. ***Route groups*** `()` are used to apply layouts to multiple routes.
    
*   `src/lib`: Contains reusable code, components, utilities, server-side logic, and validation models. This promotes code organization and reusability.
    
*   `src/lib/components/ui`: Houses UI components from `shadcn-svelte`.  Developers should use these components to maintain a consistent UI.
    
*   `src/lib/server`: Contains server-side specific code, including database interactions and potentially API endpoint handlers (though SvelteKit routes themselves can handle API logic).
    
*   `src/lib/vmodels`:  Holds `valibot` validation schemas, ensuring a single source of truth for data validation throughout the application.

## 9. Documentation for Libraries (Example)

This section provides example documentation snippets to illustrate how key libraries in the stack are used.

### 9.1. SvelteKit Routing Example

**Scenario:** Displaying product details on a product detail page.

**File:** `src/routes/(storeFront)/products/[productId]/+page.svelte`

```html
<script lang="ts">
  import { page } from '$app/stores';
  import { products } from '$lib/mock_data'; // Assuming mock data for now

  const productId = $page.params.productId;
  const product = products.find(p => p.id === productId);

  if (!product) {
    // Handle product not found (e.g., redirect to 404 page)
  }
</script>

{#if product}
  <h1>{product.name}</h1>
  <p>{product.description}</p>
  <p>Price: ${product.price}</p>
  <!-- ... more product details ... -->
{:else}
  <p>Product not found.</p>
{/if}
```

**Explanation:**

- *$app/stores* and page store are used to access route parameters (productId).
    
- *Mock* products data is imported for demonstration. In a real application, this would be fetched from a database or API.
    
- The component *fetches* product details based on productId and displays them.

### 9.2. sveltekit-superforms & Valibot Example (Login Form)

**Scenario:** Creating a login form with email and password validation.

**File:** `src/routes/login/+page.svelte`

**Validation Schema (in `src/lib/vmodels/auths_vms.ts`):**

```js
import * as v from 'valibot';

export const loginSchema = v.object({
  email: v.piep(v.string(), v.email('Invalid email format')),
  password: v.pipe(v.string(), v.minLength(6, 'Password must be at least 6 characters'))
});

export type LoginSchema = v.InferOutput<typeof loginSchema>;
```

**Page Component (src/routes/login/+page.svelte):**

```html
<script lang="ts">
  import { superForm } from 'sveltekit-superforms/client';
  import { loginSchema } from '$lib/vmodels/auths_vms';
  import { Button } from '$lib/components/ui/button';
  import { Form, FormField, FormItem, FormLabel, FormInput, FormDescription, FormMessage } from '$lib/components/ui/form';

  const { form, errors, enhance, submitting } = superForm(loginSchema);

  async function handleSubmit() {
    // Form submission logic (e.g., API call to login endpoint)
    console.log('Form data:', $form);
    // ... handle login success/failure ...
  }
</script>

<Form {form}>
  <form method="POST" use:enhance={{ enhance: handleSubmit }} class="space-y-4">
    <FormField name="email">
      <FormItem>
        <FormLabel>Email</FormLabel>
        <FormInput type="email" {...form.fields.email} />
        <FormMessage>{$errors.email}</FormMessage>
      </FormItem>
    </FormField>
    <FormField name="password">
      <FormItem>
        <FormLabel>Password</FormLabel>
        <FormInput type="password" {...form.fields.password} />
        <FormMessage>{$errors.password}</FormMessage>
      </FormItem>
    </FormField>
    <Button type="submit" disabled={$submitting}>
      {#if $submitting}
        Logging in...
      {:else}
        Login
      {/if}
    </Button>
  </form>
</Form>
```


**Explanation:**

- loginSchema is defined using valibot for validation rules.
    
- superForm is used to create a form instance from the schema.
    
- FormField, FormItem, etc., are UI components from shadcn-svelte/ui/form to structure the form.
    
- form.fields.email, form.fields.password bind form fields to the schema.
    
- $errors store from superForm displays validation errors.
    
- enhance action is used to handle form submission (client-side enhancement).
    

### 9.3. Drizzle ORM Query Example

**Scenario:** Fetching products from the database in a SvelteKit load function.

**File:** src/routes/(storeFront)/+page.server.ts

```ts
import { db } from '$lib/server/db';
import { products } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  try {
    const featuredProducts = await db.select().from(products).where(eq(products.category_id, 1)); // Fetch products by ID
    return {
      products: featuredProducts,
    };
  } catch (error) {
    console.error('Database error:', error);
    return {
      status: 500,
      error: new Error('Failed to load products'),
    };
  }
};
```

**Explanation:**

- db is imported from src/lib/server/db/index.ts (database connection).
    
- products schema is imported from src/lib/server/db/schema.ts.
    
- drizzle-orm functions like select(), from(), where(), eq() are used to build type-safe SQL queries.
    
- The load function fetches products from the database and returns them as props to the +page.svelte component.
    
- Error handling is included for database query failures.

### 9.4. better-auth Example (User Registration - Conceptual)

**Conceptual Example (better-auth documentation should be consulted for actual implementation):**

```js
// Example - conceptual - refer to better-auth documentation

import { auth } from 'better-auth'; // Hypothetical import

async function registerUser(email, password) {
  try {
    const result = await auth.register({ email, password });
    if (result.success) {
      // Registration successful
      console.log('Registration successful:', result.user);
      // ... redirect to login or homepage ...
    } else {
      // Registration failed
      console.error('Registration failed:', result.error);
      // ... display error message to user ...
    }
  } catch (error) {
    console.error('Registration error:', error);
    // ... handle unexpected error ...
  }
}

// ... in a SvelteKit form action or component ...
// Call registerUser(formData.email, formData.password);
```


**Explanation:**

- This is a conceptual example. better-auth will provide functions for user registration, login, etc. Refer to the library's documentation for the exact API and usage.
    
- The example shows a hypothetical auth.register() function that handles user registration and returns a success or error result.
    
- Error handling is included to manage registration failures and unexpected errors.
    

---

This ***enhanced*** **PRD** provides developers with a more comprehensive understanding of the project requirements, technology stack, architecture, and implementation details. It includes clear ***functional breakdowns***, ***conceptual*** API and database schema ***outlines***, file structure ***guidance***, and example documentation to ***facilitate*** development.