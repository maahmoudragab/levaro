# LÉVARO — AI Agent Instructions

## Project Overview

LÉVARO is a modern fashion e-commerce website for:

* Men
* Women
* Kids
* Accessories

The project is built with Next.js, React, TypeScript, Tailwind CSS, and Supabase.

The customer-facing website does NOT have:

* Customer authentication
* Online payment
* Real checkout/payment processing

Customers can browse products, search, filter, sort, view product details, select sizes and check available stock.

---

## General Rules

* Always use TypeScript.
* Write clean, readable, maintainable code.
* Prefer reusable components over duplicated code.
* Do not create unnecessary files or components.
* Do not add unnecessary dependencies.
* Do not change the project architecture without a good reason.
* Do not rewrite working code unnecessarily.
* Before making a major architectural change, explain the reason first.
* Keep solutions simple. Do not over-engineer.

---

## Next.js

* Use the Next.js App Router.
* Prefer Server Components by default.
* Use `"use client"` only when client-side functionality is actually required.
* Use Server Components for data fetching when possible.
* Avoid unnecessary client-side state.
* Use Next.js built-in features when they provide a better solution.
* Use `next/image` for images.
* Use proper metadata for pages when needed.
* Keep SEO in mind when creating public pages.

---

## React

* Use functional components.
* Keep components focused on a single responsibility.
* Create reusable components when the same UI or logic is used more than once.
* Avoid unnecessary `useEffect`.
* Avoid unnecessary re-renders.
* Do not put everything into one large component.
* Keep business logic separate from presentation when appropriate.

---

## Styling

* Use Tailwind CSS as the primary styling solution.
* Do not introduce another styling system unless explicitly requested.
* Keep the design responsive.
* Support mobile, tablet, and desktop.
* Maintain consistent spacing, typography, colors, and UI patterns.
* Avoid excessive animations.
* Animations must not negatively affect performance or usability.

---

## UI / UX

LÉVARO should feel like a premium modern fashion brand.

Prioritize:

* Clean layouts
* Strong typography
* Good whitespace
* High-quality product presentation
* Smooth but lightweight interactions
* Responsive design
* Accessibility
* Fast loading

Do not add visual effects just because they look impressive.

Every animation or interaction should have a purpose.

---

## Performance

Performance is important.

* Optimize images.
* Avoid loading unnecessary JavaScript.
* Avoid unnecessary client components.
* Avoid unnecessary API/database requests.
* Avoid unnecessary state updates.
* Do not add heavy animation libraries unless they are actually needed.
* Prefer CSS animations for simple animations.
* Lazy-load content when appropriate.
* Avoid rendering large amounts of unnecessary data.
* Keep pages fast and responsive.

---

## Supabase

Supabase is the backend/database for the project.

Use Supabase for:

* Product data
* Product categories
* Product sizes
* Stock information
* Product images through Supabase Storage

Do not change the database schema without explicitly asking first.

Do not delete or rename existing database tables, columns, buckets, or policies without confirmation.

Do not expose sensitive Supabase credentials in client-side code.

Never expose service-role keys in the browser.

Use environment variables for credentials.

---

## Product Data

Products may contain information such as:

* Name
* Description
* Category
* Price
* Images
* Sizes
* Available stock
* Gender
* Featured status
* Other relevant product attributes

Keep product-related logic reusable and organized.

Do not hardcode product data inside UI components when the data should come from Supabase.

---

## Components

Prefer a clear component structure.

Example:

```text
components/
├── ui/
├── layout/
├── product/
├── category/
└── shared/
```

Do not create a component for every tiny HTML element.

Create components when they improve:

* Reusability
* Readability
* Maintainability
* Separation of concerns

---

## Data Fetching

* Fetch only the data required by the page.
* Avoid duplicate requests.
* Use appropriate caching/revalidation strategies.
* Do not fetch all products if only a small subset is required.
* Implement pagination or other appropriate strategies for large datasets.

---

## Error Handling

* Handle loading states.
* Handle empty states.
* Handle errors gracefully.
* Never leave the user with a broken or blank UI when an error can be handled.
* Do not silently ignore important errors.

---

## Accessibility

* Use semantic HTML.
* Images must have meaningful `alt` text.
* Buttons should be actual `<button>` elements.
* Links should use `<a>` or Next.js `Link`.
* Interactive elements must be keyboard accessible.
* Do not rely only on color to communicate information.

---

## Code Quality

Before finishing a task:

1. Check for TypeScript errors.
2. Check for obvious runtime issues.
3. Check responsive behavior.
4. Check for unnecessary code.
5. Check that existing functionality was not broken.
6. Keep the final implementation as simple as possible.

---

## Important Restrictions

Do NOT:

* Install packages without asking first.
* Replace existing libraries without a strong reason.
* Change the database schema without asking.
* Delete existing functionality without asking.
* Rewrite large parts of the project for a small change.
* Add authentication unless explicitly requested.
* Add payment processing unless explicitly requested.
* Add unnecessary dependencies.
* Hardcode secrets or API keys.
* Use mock product data when real Supabase data is available.

---

## Working Style

When asked to implement a feature:

1. Understand the existing code first.
2. Reuse existing components and utilities.
3. Make the smallest reasonable change.
4. Keep the existing architecture intact.
5. Explain important changes briefly.
6. Do not modify unrelated files.

If there are multiple reasonable approaches, prefer the simplest and most maintainable one.

When something is unclear, ask before making a major assumption.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
