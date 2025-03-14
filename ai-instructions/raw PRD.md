# Project overview
You are building a modern full-stack E-Commerce platform (in Chinese language), the web frontend should be morden, responsive. You should built it in progressive way, for exmples, begin with mock data and then migrate to real data.

## Preferred tech stacks

 1. Svelte 5 along with SvelteKit as metaframework, leveraging the power of its cutting-edge features like runes to harness reactivity model to create dynamic, responsive user interfaces. 
 2. sveltekit-superforms with valibot as validation utititiy as well as a single true source to generate the forms.
 3. Sqlite3 with Drizzle ORM for type-safe database queries.
 4. Tailwind CSS for styling, shadcn-svelte as ui components, lucida icons (lucide-svelte).
 5. Authentication and authorization with `better-auth`




# Core functionalities
 1. It has a store front for customers, say, normal users who can explorer and search goods.
 2. The customers, say users, can manage their account on a menu in the layout header, link to their profile, account settings, orders, addresses, carts, logout. break it down:
    1. profile: show the user's profile, including their name, avatar, phone, addresses, etc. They can edit their profile in the page also with an edit icon or so.
    2. account settings: change their password, username like email.
    3. orders: show the user's orders, including the order id, date, status, total price, etc. They can cancel the order or remove it if the transaction is over.
    4. addresses: show the user's addresses, including the receiver name, phone, address. They can add new address, edit the address, remove the address.
    5. carts: show the user's carts, including the product name, price, quantity, total price, etc. They can remove the product from the cart, change the quantity, etc. Sure, there is a checkout which shows the order summary before payment.
    6. logout: logout the user.

 3. Admin users have one more menu item in that menu for managing products, categories, orders, users, and system settings. 
 4. The data is mainly stored in a RDBMS db while some user perferences could be stored in browsers like `dark-mode`.
 5. classic authenctication and like password reset, email verification, etc. For simplicity, ignore role-base authorization for now.
 6. For admin user, the products management, as well as users, categories, orders, has CRUD operations using managed forms, forms should be built on a validation schema model via `valibot` and form lib from the tech escosystem like `sveltekit-superforms`. The validation schemas should be single truth for the form fields, so that we can reuse the schema for both client and server side validation, so build the form UI without specifying form fields one by one.
 7. Admin users can config payment management, normal users can config their payment instances.
 
# Doc

## Documentation for libs

# Current file struction
```
.
├── components.json
├── drizzle.config.ts
├── instructions.md
├── node_modules
├── package.json
├── pnpm-lock.yaml
├── src
│   ├── app.css
│   ├── app.d.ts
│   ├── app.html
│   ├── lib
│   │   ├── components
│   │   │   ├── app-components
│   │   │   ├── ui
│   │   │   │   ├── avatar
│   │   │   │   ├── badge
│   │   │   │   ├── button
│   │   │   │   ├── card
│   │   │   │   ├── carousel
│   │   │   │   ├── checkbox
│   │   │   │   ├── dialog
│   │   │   │   ├── dropdown-menu
│   │   │   │   ├── form
│   │   │   │   ├── input
│   │   │   │   ├── label
│   │   │   │   ├── separator
│   │   │   │   ├── sheet
│   │   │   │   ├── sidebar
│   │   │   │   ├── skeleton
│   │   │   │   ├── table
│   │   │   │   ├── tabs
│   │   │   │   └── tooltip
│   │   │   └── utility
│   │   │       ├── dark-mode-toggle.svelte
│   │   │       └── tailwind-indicator.svelte
│   │   ├── hooks
│   │   │   └── is-mobile.svelte.ts
│   │   ├── index.ts
│   │   ├── server
│   │   │   └── db
│   │   │       ├── index.ts
│   │   │       └── schema.ts
│   │   ├── states
│   │   ├── utils.ts
│   │   └── vmodels
│   │       ├── auths_vms.ts
│   │       ├── domains_vm.ts
│   │       └── index.ts
│   └── routes
│       ├── (storeFront)
│       │   ├── checkout
│       │   ├── me
│       │   ├── search
│       │   ├── +layout.svelte
│       │   └── +page.svelte
│       ├── +layout.svelte
│       └── admin
│           ├── overview
│           ├── categories
│           ├── orders
│           ├── products
│           ├── users
│           ├── +layout.svelte
│           └── +page.svelte
├── static
├── svelte.config.js
├── tailwind.config.ts
├── tsconfig.json
└── vite.config.ts
```

## Critical folders
