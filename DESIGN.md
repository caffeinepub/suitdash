# Design Brief

## Purpose & Context
Premium business dashboard for a luxury suit seller business. Revenue tracking, customer management, daily metrics. Professional, intentional, refined.

## Tone
Upscale minimalism. Clean, deliberately sparse. High information density without clutter. Feels premium, not generic.

## Color Palette

| Role | Light | Dark |
|------|-------|------|
| Background | `0.96 0.01 64` (warm beige) | `0.15 0.02 40` (charcoal) |
| Foreground | `0.25 0.02 40` (warm dark brown) | `0.93 0.01 64` (warm white) |
| Primary | `0.35 0.08 40` (charcoal) | `0.72 0.12 70` (warm gold) |
| Accent | `0.75 0.12 70` (warm gold) | `0.78 0.12 70` (warm gold) |
| Muted | `0.88 0.01 64` (light grey) | `0.26 0.02 40` (charcoal grey) |
| Border | `0.92 0.01 64` (light grey) | `0.3 0.02 40` (dark grey) |

## Typography
- **Display**: Fraunces (serif headlines, premium feel)
- **Body**: General Sans (clean, readable, professional)
- **Mono**: Geist Mono (data, codes)

## Elevation & Depth
- `shadow-subtle`: `0 2px 4px rgba(0,0,0,0.05)` (cards, minimal lift)
- `shadow-elevated`: `0 8px 16px rgba(0,0,0,0.08)` (modals, focus states)
- Border-radius: `10px` (subtle rounding, premium)

## Structural Zones

| Zone | Background | Treatment | Purpose |
|------|-----------|-----------|---------|
| Header | `bg-card` with `border-b` | Warm neutral, defined edge | Branding, navigation |
| Sidebar | `bg-sidebar` | Dark charcoal, crisp | Navigation, collapse toggle |
| Main Content | `bg-background` | Warm beige/light grey | Revenue cards, metrics, charts |
| Cards | `bg-card` | White/light, shadow-subtle | Metric blocks, customer list |
| Charts | Dual-tone | Warm grey + gold accents | Revenue trends, customer data |

## Component Patterns
- Cards: Clean borders, shadow-subtle, no gradients
- Buttons: Primary (dark charcoal) with white text, accent (warm gold) for secondary actions
- Tables: Striped rows, warm muted backgrounds, no excessive borders
- Inputs: Light grey borders, rounded, minimal chrome
- Charts: Muted color palette (warm greys + gold), no neon

## Motion
- Default transition: `0.3s cubic-bezier(0.4, 0, 0.2, 1)` (smooth, professional)
- No bounce, no playful animations
- Hover states: Slight shadow increase, text color shift

## Responsive
- Mobile-first, breakpoints at sm/md/lg
- Sidebar collapses to icon nav on mobile
- Cards stack vertically on sm

## Signature Detail
Warm gold accent color paired with charcoal primary creates an unmistakably upscale identity. Serif display font elevates headlines. Neutral palette avoids generic corporate feel. This is a tool built FOR luxury retail, not a template.
