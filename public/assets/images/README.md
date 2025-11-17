# Default Logos

This folder contains default logo templates that users can choose when creating headers.

## Available Logos

### 1. default-logo.svg

- **Style**: Modern geometric
- **Description**: Clean hexagon shape with gradient, professional and versatile
- **Best for**: Tech companies, startups, modern brands

### 2. logo-modern.svg

- **Style**: Abstract minimalist
- **Description**: Abstract "M" shape with gradient, ultra-modern
- **Best for**: Creative agencies, design studios, modern businesses

### 3. logo-tech.svg

- **Style**: Connected network
- **Description**: Network nodes representing connectivity and innovation
- **Best for**: Technology companies, SaaS products, innovation-focused brands

## Usage

These logos are automatically available in the header component editor when users select "Logo Image" type. Users can:

- Choose one of the default logos for quick setup
- Upload their own custom logo
- Switch between text and image logos anytime

## Adding New Default Logos

To add a new default logo:

1. Create an SVG file with dimensions around 160-180px width, 40-50px height
2. Save it in this folder
3. Add it to the `defaultLogos` array in `src/components/editor/ImageUpload.tsx`

```typescript
const defaultLogos = [
  { name: "Modern", url: "/assets/images/default-logo.svg" },
  { name: "Geometric", url: "/assets/images/logo-modern.svg" },
  { name: "Tech", url: "/assets/images/logo-tech.svg" },
  { name: "Your New Logo", url: "/assets/images/your-logo.svg" }, // Add here
];
```
