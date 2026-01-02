// ============================================
// Recipe Keeper — Home Page Controller
// ============================================

import type { AppState, Recipe, Ingredient } from './types';
import { loadState, saveState, addRecipe, addToShoppingList, removeFromShoppingList, clearShoppingList } from './storage';
import { createRecipe, showToast, formatRelativeTime, formatCookingTime, getMealTypeLabel, getMealTypeEmoji, getMealTypeClass, escapeHtml, debounce } from './utils';

// ---------- State ----------
let state: AppState;

// ---------- DOM Elements ----------
const $ = <T extends HTMLElement>(selector: string): T | null => document.querySelector(selector);

const elements = {
  searchInput: $('#search-input') as HTMLInputElement,
  addRecipeBtn: $('#add-recipe-btn') as HTMLButtonElement,
  addFirstRecipeBtn: $('#add-first-recipe-btn') as HTMLButtonElement,
  recipesGrid: $('#recipes-grid') as HTMLDivElement,
  recipeCount: $('#recipe-count') as HTMLDivElement,
  emptyState: $('#empty-state') as HTMLDivElement,
  shoppingList: $('#shopping-list') as HTMLUListElement,
  shoppingEmpty: $('#shopping-empty') as HTMLDivElement,
  clearShoppingBtn: $('#clear-shopping-btn') as HTMLButtonElement,
  currentYear: $('#current-year') as HTMLSpanElement,
};

// ---------- Initialize ----------
function init(): void {
  state = loadState();
  
  // Set current year
  if (elements.currentYear) {
    elements.currentYear.textContent = new Date().getFullYear().toString();
  }
  
  renderRecipes(state.recipeEntries);
  renderShoppingList(state.shoppingList);
  setupEventListeners();
}

// ---------- Event Listeners ----------
function setupEventListeners(): void {
  // Add recipe buttons
  elements.addRecipeBtn?.addEventListener('click', handleAddRecipe);
  elements.addFirstRecipeBtn?.addEventListener('click', handleAddRecipe);
  
  // Search
  elements.searchInput?.addEventListener('input', debounce(handleSearch, 200));
  
  // Clear shopping
  elements.clearShoppingBtn?.addEventListener('click', handleClearShopping);
  
  // Recipe grid delegation (add to basket)
  elements.recipesGrid?.addEventListener('click', handleRecipeGridClick);
  
  // Shopping list delegation (delete item)
  elements.shoppingList?.addEventListener('click', handleShoppingListClick);
}

// ---------- Recipe Rendering ----------
function renderRecipes(recipes: Recipe[]): void {
  if (!elements.recipesGrid) return;
  
  // Update count
  if (elements.recipeCount) {
    const count = recipes.length;
    elements.recipeCount.textContent = `${count} recipe${count !== 1 ? 's' : ''}`;
  }
  
  // Show/hide empty state
  if (elements.emptyState) {
    elements.emptyState.style.display = recipes.length === 0 ? 'block' : 'none';
  }
  
  if (recipes.length === 0) {
    elements.recipesGrid.innerHTML = '';
    return;
  }
  
  elements.recipesGrid.innerHTML = recipes.map((recipe, index) => renderRecipeCard(recipe, index)).join('');
}

function renderRecipeCard(recipe: Recipe, index: number): string {
  const mealTypeClass = getMealTypeClass(recipe.mealType);
  const mealTypeLabel = getMealTypeLabel(recipe.mealType);
  const mealTypeEmoji = getMealTypeEmoji(recipe.mealType);
  const cookingTime = formatCookingTime(recipe.cookingTime);
  const createdTime = formatRelativeTime(recipe.creationTime);
  const stars = renderStars(recipe.rating);
  
  return `
    <article class="recipe-card" data-id="${recipe.id}" style="animation-delay: ${index * 0.05}s">
      <div class="recipe-card__header">
        ${recipe.mealType ? `
          <span class="recipe-card__type ${mealTypeClass}">
            ${mealTypeEmoji} ${mealTypeLabel}
          </span>
        ` : ''}
        <h3 class="recipe-card__title">
          <a href="/recipe.html#${recipe.id}">${escapeHtml(recipe.title || 'Untitled Recipe')}</a>
        </h3>
        <div class="recipe-card__meta">
          <div class="recipe-card__meta-item">
            <div class="recipe-card__stars">${stars}</div>
          </div>
          ${cookingTime ? `
            <div class="recipe-card__meta-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              ${cookingTime}
            </div>
          ` : ''}
          <div class="recipe-card__meta-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            ${createdTime}
          </div>
        </div>
      </div>
      <div class="recipe-card__footer">
        <button class="recipe-card__add-btn" data-action="add-to-basket" data-recipe-id="${recipe.id}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 5v14M5 12h14"></path>
          </svg>
          Add to shopping list
        </button>
      </div>
    </article>
  `;
}

function renderStars(rating: number): string {
  return Array.from({ length: 5 }, (_, i) => 
    `<span class="recipe-card__star ${i < rating ? 'recipe-card__star--filled' : ''}">★</span>`
  ).join('');
}

// ---------- Shopping List Rendering ----------
function renderShoppingList(items: Ingredient[]): void {
  if (!elements.shoppingList) return;
  
  // Show/hide empty state
  if (elements.shoppingEmpty) {
    elements.shoppingEmpty.style.display = items.length === 0 ? 'block' : 'none';
  }
  
  if (items.length === 0) {
    elements.shoppingList.innerHTML = '';
    return;
  }
  
  // Sort alphabetically
  const sortedItems = [...items].sort((a, b) => 
    a.text.toLowerCase().localeCompare(b.text.toLowerCase())
  );
  
  elements.shoppingList.innerHTML = sortedItems.map(item => `
    <li class="shopping-list__item" data-id="${item.ingredientID}">
      <span class="shopping-list__text">${escapeHtml(item.text)}</span>
      <button class="shopping-list__delete" data-action="delete-item" data-id="${item.ingredientID}" aria-label="Remove item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 6L6 18M6 6l12 12"></path>
        </svg>
      </button>
    </li>
  `).join('');
}

// ---------- Event Handlers ----------
function handleAddRecipe(): void {
  const newRecipe = createRecipe();
  state = addRecipe(state, newRecipe);
  saveState(state);
  window.location.href = `/recipe.html#${newRecipe.id}`;
}

function handleSearch(e: Event): void {
  const input = e.target as HTMLInputElement;
  const searchTerm = input.value.toLowerCase().trim();
  
  if (!searchTerm) {
    renderRecipes(state.recipeEntries);
    return;
  }
  
  const filtered = state.recipeEntries.filter(recipe => 
    recipe.title.toLowerCase().includes(searchTerm) ||
    recipe.ingredients.some(ing => ing.text.toLowerCase().includes(searchTerm))
  );
  
  renderRecipes(filtered);
}

function handleRecipeGridClick(e: Event): void {
  const target = e.target as HTMLElement;
  const button = target.closest('[data-action="add-to-basket"]') as HTMLButtonElement;
  
  if (button) {
    e.preventDefault();
    const recipeId = button.dataset.recipeId;
    if (!recipeId) return;
    
    const recipe = state.recipeEntries.find(r => r.id === recipeId);
    if (!recipe || recipe.ingredients.length === 0) {
      showToast('No ingredients to add!', 'error');
      return;
    }
    
    state = addToShoppingList(state, recipe.ingredients);
    saveState(state);
    renderShoppingList(state.shoppingList);
    showToast(`Added ${recipe.ingredients.length} ingredients to shopping list`, 'success');
  }
}

function handleShoppingListClick(e: Event): void {
  const target = e.target as HTMLElement;
  const button = target.closest('[data-action="delete-item"]') as HTMLButtonElement;
  
  if (button) {
    e.preventDefault();
    const itemId = button.dataset.id;
    if (!itemId) return;
    
    state = removeFromShoppingList(state, itemId);
    saveState(state);
    renderShoppingList(state.shoppingList);
  }
}

function handleClearShopping(): void {
  if (state.shoppingList.length === 0) return;
  
  state = clearShoppingList(state);
  saveState(state);
  renderShoppingList(state.shoppingList);
  showToast('Shopping list cleared', 'success');
}

// ---------- Start the app ----------
document.addEventListener('DOMContentLoaded', init);

