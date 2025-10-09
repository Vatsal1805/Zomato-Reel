# Zomato Reel Authentication System

This project includes a complete authentication system with separate interfaces for customers and food partners.

## Features

### 🎨 Design System
- **Centralized Theme**: CSS variables in `src/styles/theme.css`
- **Dark/Light Mode**: Automatic system preference detection
- **Responsive Design**: Mobile-first approach
- **Accessibility**: WCAG compliant with proper focus states

### 🔐 Authentication Pages

#### Customer Authentication
- **Registration**: `/user/register`
  - Full name, email, phone, password fields
  - Password confirmation
  - Links to partner registration

- **Login**: `/user/login`
  - Email and password
  - Remember me option
  - Forgot password link

#### Food Partner Authentication
- **Registration**: `/food-partner/register`
  - Restaurant details (name, owner, address)
  - Business information (email, phone, cuisine type)
  - Password setup

- **Login**: `/food-partner/login`
  - Business email login
  - Partner dashboard access
  - Links to customer login

### 🎯 Navigation
- **Home Page**: `/` - Role selection interface
- **Cross-linking**: Easy navigation between customer and partner flows

### 🎨 Styling Features

#### CSS Variables (theme.css)
```css
/* Colors automatically adapt to system theme */
--bg-primary: /* Changes based on light/dark preference */
--text-primary: /* Adapts for contrast */
--accent-color: #ff6b35 /* Consistent brand color */

/* Spacing system */
--spacing-xs to --spacing-xxl

/* Typography scale */
--font-xs to --font-xxxl

/* Transitions and animations */
--transition-fast, --transition-normal
```

#### Shared Styles (auth.css)
- Consistent form styling across all pages
- Hover effects and micro-animations
- Focus states for accessibility
- Responsive breakpoints

## File Structure

```
src/
├── components/
│   ├── auth/
│   │   ├── UserRegister.jsx
│   │   ├── UserLogin.jsx
│   │   ├── FoodPartnerRegister.jsx
│   │   ├── FoodPartnerLogin.jsx
│   │   └── index.js
│   └── Home.jsx
├── styles/
│   ├── theme.css          # CSS variables and theme system
│   └── auth.css           # Shared authentication styles
└── routes/
    └── AppRoutes.jsx      # Route configuration
```

## Usage

### Development
```bash
npm run dev
```

### Available Routes
- `/` - Home page with role selection
- `/user/register` - Customer registration
- `/user/login` - Customer login
- `/food-partner/register` - Partner registration
- `/food-partner/login` - Partner login

### Theme Customization

The theme system supports:
1. **Automatic detection** of system preferences
2. **Manual override** with data attributes:
   ```html
   <html data-theme="light"> <!-- Force light theme -->
   <html data-theme="dark">  <!-- Force dark theme -->
   ```

### Form Handling

All forms include:
- Controlled components with state management
- Form validation (HTML5 + custom)
- Placeholder submit handlers (console.log for now)
- Proper accessibility labels and focus management

## Next Steps

1. **Backend Integration**: Replace console.log with API calls
2. **Validation**: Add client-side validation with error states
3. **Authentication Logic**: Implement JWT tokens and protected routes
4. **Profile Management**: Add user/partner profile pages
5. **Dashboard**: Create separate dashboards for users and partners

## Technologies Used

- **React 19**: Latest React with hooks
- **React Router v7**: Client-side routing
- **CSS Variables**: Modern theming approach
- **CSS Grid/Flexbox**: Modern layout techniques
- **System Theme Detection**: `prefers-color-scheme` media query