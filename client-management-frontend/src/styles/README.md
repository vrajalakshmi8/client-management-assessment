# Shared Styles Documentation

## Overview
This project uses a centralized design system with shared SCSS variables, mixins, and utility classes.

## File Structure
```
src/styles/
├── _variables.scss  # Design tokens (colors, spacing, typography, etc.)
├── _mixins.scss     # Reusable mixins and animations
└── _buttons.scss    # Button utility classes
```

## Usage

### 1. In Global styles.scss
The shared styles are already imported in the main `styles.scss`:
```scss
@import 'styles/variables';
@import 'styles/mixins';
@import 'styles/buttons';
```

### 2. In Component SCSS Files
Import variables and mixins at the top of your component SCSS:
```scss
@import '/src/styles/variables';
@import '/src/styles/mixins';

.my-component {
  background: $color-bg-white;
  padding: $spacing-lg;
  border-radius: $radius-md;
  
  @include card;
  
  @include md {
    padding: $spacing-xl;
  }
}
```

### 3. In Component HTML Templates
Use button utility classes directly in templates:
```html
<!-- Primary Buttons -->
<button class="btn btn-primary">Primary</button>
<button class="btn btn-primary btn-sm">Small Primary</button>
<button class="btn btn-primary btn-lg">Large Primary</button>

<!-- Other Variants -->
<button class="btn btn-secondary">Secondary</button>
<button class="btn btn-success">Success</button>
<button class="btn btn-warning">Warning</button>
<button class="btn btn-danger">Danger</button>

<!-- Outline Variants -->
<button class="btn btn-outline">Outline</button>
<button class="btn btn-outline-primary">Outline Primary</button>
<button class="btn btn-outline-danger">Outline Danger</button>

<!-- Light Variants -->
<button class="btn btn-light-primary">Light Primary</button>
<button class="btn btn-light-success">Light Success</button>
<button class="btn btn-light-danger">Light Danger</button>

<!-- Block (Full Width) -->
<button class="btn btn-primary btn-block">Full Width Button</button>

<!-- Icon Button -->
<button class="btn btn-icon btn-primary">
  <i class="icon"></i>
</button>

<!-- Button Group -->
<div class="btn-group">
  <button class="btn btn-primary">Left</button>
  <button class="btn btn-secondary">Middle</button>
  <button class="btn btn-secondary">Right</button>
</div>
```

## Available Design Tokens

### Colors
- **Primary**: `$color-primary`, `$color-primary-hover`, `$color-primary-dark`, `$color-primary-light`, `$color-primary-lighter`
- **Warning**: `$color-warning`, `$color-warning-hover`, `$color-warning-dark`, `$color-warning-light`, etc.
- **Danger**: `$color-danger`, `$color-danger-hover`, `$color-danger-dark`, `$color-danger-light`, etc.
- **Success**: `$color-success`, `$color-success-hover`, `$color-success-dark`, `$color-success-light`, etc.
- **Text**: `$color-text-primary`, `$color-text-secondary`, `$color-text-muted`
- **Background**: `$color-bg-white`, `$color-bg-gray`, `$color-bg-gray-light`
- **Border**: `$color-border`, `$color-border-hover`

### Spacing
- `$spacing-xs` (0.25rem / 4px)
- `$spacing-sm` (0.5rem / 8px)
- `$spacing-md` (0.75rem / 12px)
- `$spacing-lg` (1rem / 16px)
- `$spacing-xl` (1.5rem / 24px)
- `$spacing-2xl` (3rem / 48px)

### Border Radius
- `$radius-sm` (0.375rem / 6px)
- `$radius-md` (0.5rem / 8px)
- `$radius-lg` (0.75rem / 12px)
- `$radius-full` (9999px)

### Shadows
- `$shadow-sm`, `$shadow-md`, `$shadow-lg`, `$shadow-xl`
- `$shadow-focus` (for focus states)

### Typography
- **Sizes**: `$text-xs`, `$text-sm`, `$text-base`, `$text-lg`, `$text-xl`, `$text-2xl`, `$text-3xl`
- **Weights**: `$font-weight-normal`, `$font-weight-medium`, `$font-weight-semibold`, `$font-weight-bold`

### Z-Index Layers
- `$z-dropdown` (1000)
- `$z-sticky` (1100)
- `$z-fixed` (1200)
- `$z-modal-backdrop` (1300)
- `$z-modal` (1400)
- `$z-popover` (1500)
- `$z-toast` (1600)
- `$z-tooltip` (1700)

## Available Mixins

### Layout
```scss
@include flex-center;     // Flexbox centered
@include flex-between;    // Flexbox space-between
@include flex-column;     // Flexbox column
```

### Components
```scss
@include card;           // Card styling with shadow
@include card-hover;     // Card with hover effect
@include button-base;    // Base button styles
@include focus-ring;     // Consistent focus outline
```

### Typography
```scss
@include text-ellipsis;          // Single line truncation
@include line-clamp(3);          // Multi-line truncation
```

### Responsive Breakpoints
```scss
@include sm { /* styles for ≥640px */ }
@include md { /* styles for ≥768px */ }
@include lg { /* styles for ≥1024px */ }
@include xl { /* styles for ≥1280px */ }
```

### Animations
```scss
@include spinner(24px, $color-primary);  // Loading spinner
```

Available keyframe animations:
- `@keyframes spin` - 360° rotation
- `@keyframes fadeIn` - Fade in with scale
- `@keyframes slideIn` - Slide in from left

## Migration Example

### Before (Component-specific styles):
```scss
// client-form.component.scss
.submit-button {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  background-color: #2563eb;
  color: white;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  
  &:hover {
    background-color: #1d4ed8;
  }
}
```

### After (Using shared styles):
```html
<!-- In template -->
<button class="btn btn-primary" type="submit">Submit</button>
```

Or if you need custom styles:
```scss
// client-form.component.scss
@import '/src/styles/variables';
@import '/src/styles/mixins';

.submit-button {
  @include button-base;
  background-color: $color-primary;
  color: white;
  
  &:hover {
    background-color: $color-primary-hover;
  }
}
```

## Benefits

1. **Consistency**: All components use the same design tokens
2. **Maintainability**: Update colors/spacing in one place
3. **Performance**: Shared utility classes reduce CSS duplication
4. **Scalability**: Easy to add new variants and themes
5. **Developer Experience**: Autocomplete with SCSS variables
6. **Accessibility**: Built-in focus states and proper contrast ratios
