# 🍳 Recipe Keeper

A beautiful, modern recipe management app built with TypeScript and Vite. Store your favorite recipes, manage ingredients, and build shopping lists with a delightful user experience.

![Recipe Keeper Preview](preview.png)

## ✨ Features

- **📖 Recipe Management** — Create, edit, and delete recipes with ease
- **⭐ Star Ratings** — Rate your recipes from 1-5 stars
- **🍳 Meal Types** — Categorize recipes as Fish, Vegetarian, or Meat dishes
- **⏱️ Cooking Times** — Track prep times for better meal planning
- **📝 Step-by-Step Instructions** — Add, edit, and reorder cooking steps
- **🥕 Ingredients List** — Manage ingredients for each recipe
- **🛒 Shopping List** — Add recipe ingredients to your shopping list with one click
- **🔍 Search** — Filter recipes by title or ingredients
- **💾 Local Storage** — All data persists in your browser
- **📱 Responsive** — Works beautifully on desktop, tablet, and mobile

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`

### Building for Production

```bash
npm run build
```

Output will be in the `dist` directory.

## 🎨 Design System

The app features a warm, inviting color palette inspired by culinary aesthetics:

- **Primary**: Terracotta (`#c67b5c`) — warm, appetizing
- **Secondary**: Sage (`#7d9b84`) — fresh, natural
- **Accent**: Golden (`#d4a574`) — highlights and ratings

### Typography

- **Display**: Playfair Display — elegant, editorial headings
- **Body**: DM Sans — clean, readable body text

### Key UI Features

- Glassmorphism header with backdrop blur
- Smooth micro-animations on interactions
- Card-based layout with hover effects
- Toast notifications for feedback
- Modal dialogs for confirmations

## 🛠️ Tech Stack

- **Build Tool**: [Vite](https://vitejs.dev/) — lightning fast HMR
- **Language**: TypeScript — type-safe JavaScript
- **Styling**: Modern CSS — custom properties, flexbox, grid
- **Storage**: LocalStorage API — client-side persistence
- **No Framework** — vanilla TypeScript for maximum performance

## 📁 Project Structure

```
recipe-keeper-app/
├── index.html          # Home page
├── recipe.html         # Recipe editor page
├── src/
│   ├── styles/
│   │   └── main.css    # Complete design system
│   └── ts/
│       ├── types.ts    # TypeScript interfaces
│       ├── utils.ts    # Utility functions
│       ├── storage.ts  # LocalStorage operations
│       ├── defaultData.ts # Sample recipes
│       ├── home.ts     # Home page controller
│       └── recipe.ts   # Recipe page controller
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 🧑‍💻 Author

**Dmitry Osipchuk**

- GitHub: [@do88](https://github.com/do88)
- LinkedIn: [osipchuk](https://www.linkedin.com/in/osipchuk/)

## 📄 License

This project is open source and available under the MIT License.

---

Made with ♥ and lots of ☕
