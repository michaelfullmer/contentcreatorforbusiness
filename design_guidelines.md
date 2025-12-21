# Content Creator for Small Businesses - Design Guidelines

## Design Approach
**System:** Modern productivity tool aesthetic inspired by Notion, Linear, and Canva
**Rationale:** Content creation requires clarity, efficiency, and creative flexibility. The design balances professional utility with creative empowerment.

## Core Design Principles
1. **Clear Hierarchy:** Guide users through content creation workflows intuitively
2. **Creative Canvas:** Provide spacious work areas with minimal distraction
3. **Professional Polish:** Small businesses need to look credible and established
4. **Quick Access:** Frequently-used tools prominently placed

---

## Typography
- **Primary Font:** Inter (Google Fonts) - Clean, modern, professional
- **Accent Font:** DM Sans (Google Fonts) - For headings and emphasis
- **Hierarchy:**
  - Hero/Headlines: text-5xl to text-6xl, font-bold
  - Section Headers: text-3xl to text-4xl, font-semibold
  - Subheadings: text-xl to text-2xl, font-medium
  - Body Text: text-base, font-normal
  - UI Labels: text-sm, font-medium
  - Captions: text-xs

## Layout & Spacing System
**Spacing Units:** Use Tailwind units of **4, 6, 8, 12, 16, 20** (as in p-4, gap-8, mb-12)
- Section padding: py-16 to py-20 (desktop), py-12 (mobile)
- Component gaps: gap-6 to gap-8
- Content max-width: max-w-7xl for full sections, max-w-4xl for focused content
- Cards/panels: p-6 to p-8

---

## Component Library

### Navigation
- **Top Navigation:** Fixed header with logo left, main nav center, CTA + profile right
- **Dashboard Sidebar:** Collapsible left sidebar (64px collapsed, 240px expanded) with icons + labels
- **Breadcrumbs:** For multi-level navigation in content creation flows

### Content Creation Interface
- **Main Canvas:** Full-height workspace (min-h-screen minus header) with floating toolbars
- **Template Gallery:** 3-column grid (lg:grid-cols-3 md:grid-cols-2) of template cards with hover previews
- **Asset Library:** Side panel with categorized media/element browser
- **Editor Toolbar:** Top-mounted with icon buttons, grouped by function (text, media, layout, export)

### Cards & Panels
- **Template Cards:** Rounded corners (rounded-xl), shadow on hover, image preview + title + category tag
- **Feature Cards:** Large icon top, heading, description, bordered with subtle shadow
- **Stats Cards:** Icon + number + label, compact layout for dashboard metrics
- **Content Preview Cards:** Full image + overlay text on hover for portfolio/examples

### Forms & Inputs
- **Input Fields:** Generous padding (px-4 py-3), rounded-lg borders, focus states with ring
- **Buttons:** Primary (solid), Secondary (outline), Tertiary (ghost) - all with medium font-weight
- **Dropdowns:** Custom styled with icon indicators
- **Toggle Switches:** For settings and feature toggles

### Data Display
- **Content Library Grid:** Masonry-style layout for varied content types
- **Analytics Dashboard:** 2x2 stat grid with line charts, bar charts for performance
- **Activity Feed:** Timeline-style with timestamps and action indicators

---

## Key Page Structures

### Marketing Landing Page
1. **Hero Section:** (80vh) Large heading + subheading + dual CTA buttons + hero image showing dashboard preview
2. **Features Grid:** 3-column showcase of core capabilities (content templates, scheduling, analytics)
3. **Template Showcase:** 4-column grid of popular templates with category filters
4. **Benefits Section:** 2-column alternating image-text highlighting business outcomes
5. **Social Proof:** Testimonial carousel with company logos + quotes
6. **Pricing Table:** 3-tier comparison with feature checkmarks
7. **Final CTA:** Centered with trial signup form
8. **Footer:** Multi-column with product links, resources, social, newsletter signup

### Dashboard/App Interface
- **Left Sidebar:** Project navigation, templates, assets, settings
- **Main Content Area:** Dynamic workspace - switches between template gallery, editor canvas, analytics
- **Top Bar:** Search, notifications, help, user profile
- **Quick Actions Panel:** Floating bottom-right button for "New Content"

---

## Images

### Hero Image
**Yes, large hero image required**
- **Description:** Clean screenshot of the dashboard showing content editor with multiple templates/posts being worked on simultaneously. Modern, organized interface with visible brand elements
- **Placement:** Right 50% of hero section on desktop, full-width below headline on mobile
- **Treatment:** Subtle shadow, slight perspective tilt for depth

### Feature Section Images
- **Template Examples:** High-quality mockups of social posts, blog graphics, email headers created with the tool
- **Dashboard Screenshot:** Analytics view showing growth metrics and engagement stats
- **Mobile Preview:** Phone mockup showing responsive content previews

### Template Gallery
- **Individual Thumbnails:** Preview images for each template category (social media, blog, email, presentations)
- **Style:** Consistent aspect ratio, professional photography/graphics, brand colors visible

---

## Icons
**Library:** Heroicons (via CDN)
- Navigation: outline style
- Buttons/actions: solid style
- Feature highlights: large outline icons (w-12 h-12)

## Animations
**Minimal and purposeful:**
- Card hover: subtle lift (translate-y) + shadow increase
- Button interactions: scale on active
- Sidebar collapse/expand: smooth width transition
- Template preview: fade-in overlay on hover
- **No:** scroll-triggered animations, parallax, complex transitions

---

## Accessibility
- All interactive elements have focus states with visible ring
- Form labels always present and properly associated
- Minimum contrast ratios: 4.5:1 for body text, 3:1 for large text
- Icon buttons include aria-labels
- Keyboard navigation fully supported throughout editor