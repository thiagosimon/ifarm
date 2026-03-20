# Design System Specification: Editorial Precision

This design system is a bespoke framework crafted for the high-stakes world of Brazilian agribusiness. It rejects the "SaaS template" aesthetic in favor of a sophisticated, editorial-inspired interface that balances organic warmth with mathematical precision.

## 1. Overview & Creative North Star: "The Digital Agronomist"
The Creative North Star for this system is **The Digital Agronomist**. It represents the intersection of raw earth and high-tech data. The visual language moves beyond standard dashboards to feel like a premium, data-rich trade publication.

**Key Deviations from Standard UI:**
*   **Intentional Asymmetry:** Avoid perfectly centered grids. Use the 12-unit spacing scale to create offset layouts that guide the eye like a magazine spread.
*   **Tonal Depth:** We do not use lines to separate ideas. We use "Atmospheric Layering"—shifting background values to create natural boundaries.
*   **Editorial Scale:** We utilize extreme typographic contrasts (Display-LG vs Label-SM) to establish an immediate information hierarchy.

---

## 2. Colors & Surface Philosophy
The palette is rooted in the "Seedling" and "Deep Forest" greens, anchored by a "Golden Harvest" secondary that denotes value and maturity.

### The "No-Line" Rule
**Explicit Instruction:** Do not use 1px solid borders to section off parts of the UI. Separation must be achieved through:
1.  **Background Shifts:** Transitioning from `surface` (#1D2022) to `surface-container-low` (#181C1D).
2.  **Negative Space:** Using the `spacing-8` (2rem) or `spacing-10` (2.5rem) tokens to create cognitive breathing room.

### Surface Hierarchy & Nesting
Treat the UI as physical layers of soil and glass. 
*   **Foundation:** `background` (#101415).
*   **Sectioning:** `surface-container-low` (#181C1D) for secondary sidebars or utility zones.
*   **Focus Areas:** `surface-container-high` (#272B2C) for primary content modules.
*   **Signature Glass:** Use the custom glass effect for floating panels: `rgba(39, 42, 44, 0.7)` with `backdrop-blur: 12px`.

### The "Glass & Gradient" Rule
To elevate the "B2B Marketplace" feel, use subtle directional gradients on interactive elements. Transition from `primary` (#A4F5B8) to `primary-container` (#89D89E) at a 135-degree angle for primary CTAs. This prevents the "flat-button" look and suggests a tactile, premium surface.

---

## 3. Typography: The Editorial Voice
We use **Inter** exclusively. The weight range (300–900) is our primary tool for expressing "Serious Stability."

*   **Display (LG/MD):** Weight 300. Use for high-level data summaries (e.g., Total Harvest Value). The light weight at large scale feels sophisticated and precise.
*   **Headlines:** Weight 700. Use for page titles. This is the "Anchor" of the page.
*   **Titles:** Weight 600. For card headers and section titles.
*   **Body:** Weight 400. Optimized for readability against dark surfaces.
*   **Labels:** Weight 800 (Uppercase). Used for "Overlines" or small metadata to provide a "stamped" or "classified" feel.

---

## 4. Elevation & Depth
Depth is a functional tool, not a stylistic flourish.

*   **The Layering Principle:** Place a `surface-container-highest` card on a `surface-dim` background. The delta in luminance creates "lift" without the need for dated drop shadows.
*   **Ambient Shadows:** For floating modals, use an "Agro-Shadow": 
    *   `box-shadow: 0 24px 48px rgba(0, 0, 0, 0.4), 0 8px 16px rgba(137, 216, 158, 0.05);` 
    *   Notice the 5% green tint in the shadow—this mimics light passing through a canopy.
*   **The Ghost Border:** If accessibility requires a stroke, use `outline-variant` (#404940) at **15% opacity**. It should be felt, not seen.

---

## 5. Signature Components

### Buttons: The "Harvest" Action
*   **Primary:** Gradient fill (`primary` to `primary-container`), 8px radius. Text: `label-md` weight 700, color `on-primary`.
*   **Secondary:** Ghost style. No background, `outline` (#899389) border at 20% opacity.
*   **Tertiary:** Text-only, using `secondary` (#F6BE39) for high-value financial actions.

### Cards & Data Lists
*   **Rules:** Forbid 100% width divider lines. 
*   **Interaction:** Use `surface-container-highest` for hover states. 
*   **The "Editorial" Card:** A 12px radius container using the Glass effect. The header should use a `secondary-fixed` gold accent bar (2px wide, vertical) to the left of the title to denote "Market Premium" status.

### Precision Inputs
*   **Field Style:** `surface-container-lowest` background. 
*   **Focus State:** 1px border of `primary` (#A4F5B8) with a soft 4px outer glow of the same color at 20% opacity. 
*   **Error State:** Use `error` (#FFB4AB) for the label and a subtle `error-container` (#93000A) background tint.

### Agrarian Data Chips
*   Small, high-contrast pills. 
*   **Status: Mature:** Background `on-primary-fixed-variant`, Text `primary-fixed`.
*   **Status: Pending:** Background `on-secondary-fixed-variant`, Text `secondary-fixed`.

---

## 6. Do’s and Don’ts

### Do:
*   **Do** use extreme white space. If a section feels "almost right," add another 8px of padding.
*   **Do** use the `secondary` gold for financial figures or "Value at Risk" to distinguish money from metadata.
*   **Do** overlap elements. A glass card can slightly overlap a background image or a secondary container to create a sense of three-dimensional space.

### Don't:
*   **Don't** use pure white (#FFFFFF). Use `on-surface` (#E0E3E4) to avoid eye strain in dark mode.
*   **Don't** use "Grow/Shrink" animations. Use "Fade/Slide" (200ms Ease-Out) to maintain a serious, stable B2B tone.
*   **Don't** use icons as the primary source of truth. In a professional B2B context, an icon must always be accompanied by a `label-sm` text element for clarity.