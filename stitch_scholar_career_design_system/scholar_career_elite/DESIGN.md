---
name: Scholar Career Elite
colors:
  surface: '#fdf8f8'
  surface-dim: '#ddd9d8'
  surface-bright: '#fdf8f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f7f3f2'
  surface-container: '#f1edec'
  surface-container-high: '#ebe7e6'
  surface-container-highest: '#e5e2e1'
  on-surface: '#1c1b1b'
  on-surface-variant: '#444748'
  inverse-surface: '#313030'
  inverse-on-surface: '#f4f0ef'
  outline: '#747878'
  outline-variant: '#c4c7c7'
  surface-tint: '#5f5e5e'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1c1b1b'
  on-primary-container: '#858383'
  inverse-primary: '#c8c6c5'
  secondary: '#5e5e5e'
  on-secondary: '#ffffff'
  secondary-container: '#e1dfdf'
  on-secondary-container: '#626262'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#1d1b1a'
  on-tertiary-container: '#868381'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e5e2e1'
  primary-fixed-dim: '#c8c6c5'
  on-primary-fixed: '#1c1b1b'
  on-primary-fixed-variant: '#474646'
  secondary-fixed: '#e4e2e2'
  secondary-fixed-dim: '#c7c6c6'
  on-secondary-fixed: '#1b1c1c'
  on-secondary-fixed-variant: '#464747'
  tertiary-fixed: '#e6e1df'
  tertiary-fixed-dim: '#cac6c3'
  on-tertiary-fixed: '#1d1b1a'
  on-tertiary-fixed-variant: '#484645'
  background: '#fdf8f8'
  on-background: '#1c1b1b'
  surface-variant: '#e5e2e1'
typography:
  h1:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  h2:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  h3:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.4'
    letterSpacing: '0'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.1em
  button:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '600'
    lineHeight: '1'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 48px
  xl: 80px
  container-max: 1200px
  gutter: 32px
---

## Brand & Style

The design system is anchored in a **Corporate-Modern** aesthetic that blends the high-utility efficiency of technical tools like Linear with the welcoming clarity of Notion. It is designed to evoke a sense of prestigious reliability and calm focus, essential for users navigating high-stakes career and educational milestones. 

The style prioritizes clarity over decoration, using ample whitespace and a rigorous 8px grid to establish trust. By combining a warm, off-white foundation with sharp, technical accents, the system feels premium and "human-centric" rather than cold and institutional.

## Colors

This design system utilizes a sophisticated, low-fatigue palette. The background uses a warm off-white to reduce screen glare during long research sessions. 

- **Primary & Neutral:** Charcoal provides high-contrast legibility for core UI elements, while warm grey handles metadata and secondary information without cluttering the visual hierarchy.
- **Accent:** Electric Indigo is reserved strictly for interactive elements (CTAs), progress indicators, and active navigational states to provide a clear "trail" for the user's eye.
- **Semantic:** Success and error states use muted, earthy tones rather than neon variants to maintain the system's professional temperament.

## Typography

The system relies on **Inter** for its neutral, systematic character. The typographic hierarchy is strictly enforced to ensure complex information remains digestible.

- **Headings:** Set at 600 weight with tight tracking to create a "locked-in" professional appearance.
- **Body:** Standardized at 400 weight with a generous line height (1.6) to facilitate deep reading of fellowship requirements.
- **Labels:** Small-caps labels with high letter spacing (0.1em) serve as "wayfinders" for category headers and overlines, creating a distinct visual break from body text.

## Layout & Spacing

The layout follows an **8px linear grid system**. All margins, paddings, and component heights must be multiples of 8. 

The system employs a **Fixed Grid** model for the main content area (max-width 1200px) to ensure a controlled, premium reading experience. For data-heavy scholarship lists, the system allows for wider viewports but maintains substantial 48px (lg) internal padding for cards to provide "breathing room," signaling a high-end SaaS experience rather than a cluttered database.

## Elevation & Depth

Visual hierarchy is achieved through a combination of **Tonal Layering** and **Ambient Shadows**. 

The design system avoids heavy drop shadows. Instead, it uses ultra-diffused, low-opacity shadows (e.g., `y: 4, blur: 20, opacity: 0.04`) to lift cards off the off-white background. Borders remain the primary method of separation, using a 1px weight in light grey for static containers and increasing to 1.5px or indigo for active states. When elements overlap (e.g., dropdowns), a subtle backdrop blur (8-12px) is applied to maintain context while focusing attention.

## Shapes

The shape language is defined by "Large Softness." By utilizing a **12px to 16px corner radius**, the UI feels approachable and modern. 

- **Standard Components:** 12px (Buttons, Input fields, Small cards).
- **Major Containers:** 16px (Large feature cards, Modals, Onboarding containers).
- **Interactive States:** When a card is hovered, the shadow deepens slightly, but the shape remains constant to ensure layout stability.

## Components

### Buttons
- **Primary:** Solid Electric Indigo (#3D5AFE) background with white text. High-contrast, 12px radius, minimal 8px horizontal padding beyond the text.
- **Secondary:** Ghost/Outline style with a 1.5px border (#E8E6E1) and Charcoal text. On hover, the background shifts to a very faint indigo tint (2% opacity).

### Input Fields
- **Floating Labels:** Labels transition from body-md to label-caps when the field is active.
- **Borders:** 1.5px thickness. Default color is #E8E6E1. 
- **Focus State:** Border color shifts to Electric Indigo with a soft 2px outer glow in the same hue.

### Cards
- **Padding:** Fixed at 48px (lg) for primary dashboard cards to emphasize the "Premium" nature of the service.
- **Border:** Constant 1px light grey border.

### Chips / Badges
- Used for scholarship tags (e.g., "Full Ride," "STEM"). 
- Styling: Rounded-full, charcoal text on a slightly darker grey background (#F0EFEA) to differentiate from the main page background.

### Progress Bars
- 4px height, using Electric Indigo for the fill and Light Grey for the track. No rounded ends; clean, flat terminations.