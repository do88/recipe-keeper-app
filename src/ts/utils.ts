// ============================================
// Recipe Keeper — Utility Functions
// ============================================

import type { Recipe, MealType, ToastType } from './types';

// ---------- UUID Generator ----------
export function generateId(): string {
  return crypto.randomUUID();
}

// ---------- Date Formatting ----------
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffSecs < 60) return 'just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  if (diffWeeks < 5) return `${diffWeeks} week${diffWeeks > 1 ? 's' : ''} ago`;
  if (diffMonths < 12) return `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`;
  return `${diffYears} year${diffYears > 1 ? 's' : ''} ago`;
}

export function formatFullDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

// ---------- Cooking Time Formatting ----------
export function formatCookingTime(minutes: string | number): string {
  const mins = typeof minutes === 'string' ? parseInt(minutes, 10) : minutes;
  if (!mins || isNaN(mins)) return '';
  
  const hours = Math.floor(mins / 60);
  const remainingMins = mins % 60;
  
  if (hours > 0 && remainingMins > 0) {
    return `${hours}h ${remainingMins}min`;
  }
  if (hours > 0) {
    return `${hours}h`;
  }
  return `${mins}min`;
}

// ---------- Meal Type Helpers ----------
export function getMealTypeLabel(type: MealType): string {
  const labels: Record<MealType, string> = {
    fishDish: 'Fish',
    vegDish: 'Veggie',
    meatDish: 'Meat',
    '': ''
  };
  return labels[type];
}

export function getMealTypeEmoji(type: MealType): string {
  const emojis: Record<MealType, string> = {
    fishDish: '🐟',
    vegDish: '🥬',
    meatDish: '🥩',
    '': ''
  };
  return emojis[type];
}

export function getMealTypeClass(type: MealType): string {
  const classes: Record<MealType, string> = {
    fishDish: 'recipe-card__type--fish',
    vegDish: 'recipe-card__type--veg',
    meatDish: 'recipe-card__type--meat',
    '': ''
  };
  return classes[type];
}

// ---------- Recipe Factory ----------
export function createRecipe(): Recipe {
  return {
    id: generateId(),
    title: '',
    rating: 0,
    cookingTime: '',
    creationTime: new Date().toISOString(),
    mealType: '',
    ingredients: [],
    instructions: []
  };
}

// ---------- Toast Notifications ----------
export function showToast(message: string, type: ToastType = 'success'): void {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.innerHTML = `
    <span class="toast__icon">${type === 'success' ? '✓' : '!'}</span>
    <span class="toast__message">${escapeHtml(message)}</span>
    <button class="toast__close" aria-label="Close">
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M18 6L6 18M6 6l12 12"></path>
      </svg>
    </button>
  `;

  container.appendChild(toast);

  // Auto remove after 4 seconds
  const timeout = setTimeout(() => removeToast(toast), 4000);

  // Manual close
  toast.querySelector('.toast__close')?.addEventListener('click', () => {
    clearTimeout(timeout);
    removeToast(toast);
  });
}

function removeToast(toast: HTMLElement): void {
  toast.classList.add('toast--exiting');
  setTimeout(() => toast.remove(), 300);
}

// ---------- HTML Escaping ----------
export function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ---------- Debounce ----------
export function debounce<T extends (...args: never[]) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

