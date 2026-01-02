// ============================================
// Recipe Keeper — Recipe Page Controller
// ============================================

import type { AppState, Recipe, Ingredient, Instruction, MealType } from './types';
import { loadState, saveState, getRecipeById, updateRecipe, deleteRecipe } from './storage';
import { generateId, showToast, formatFullDate, escapeHtml, debounce } from './utils';

// ---------- State ----------
let state: AppState;
let currentRecipe: Recipe | undefined;
let editingInstructionId: string | null = null;

// ---------- DOM Elements ----------
const $ = <T extends HTMLElement>(selector: string): T | null => document.querySelector(selector);

const elements = {
  // Header
  recipeDate: $('#recipe-date') as HTMLSpanElement,
  saveExitBtn: $('#save-exit-btn') as HTMLButtonElement,
  
  // Title
  recipeTitle: $('#recipe-title') as HTMLInputElement,
  
  // Meta
  starRating: $('#star-rating') as HTMLDivElement,
  cookingTime: $('#cooking-time') as HTMLInputElement,
  mealTypeSelector: $('#meal-type-selector') as HTMLDivElement,
  
  // Instructions
  instructionsList: $('#instructions-list') as HTMLOListElement,
  addInstructionBtn: $('#add-instruction-btn') as HTMLButtonElement,
  instructionForm: $('#instruction-form') as HTMLFormElement,
  instructionTextarea: $('#instruction-textarea') as HTMLTextAreaElement,
  cancelInstructionBtn: $('#cancel-instruction-btn') as HTMLButtonElement,
  
  // Ingredients
  ingredientsList: $('#ingredients-list') as HTMLUListElement,
  ingredientsEmpty: $('#ingredients-empty') as HTMLDivElement,
  addIngredientBtn: $('#add-ingredient-btn') as HTMLButtonElement,
  ingredientForm: $('#ingredient-form') as HTMLFormElement,
  ingredientInput: $('#ingredient-input') as HTMLInputElement,
  clearIngredientsBtn: $('#clear-ingredients-btn') as HTMLButtonElement,
  
  // Delete
  deleteRecipeBtn: $('#delete-recipe-btn') as HTMLButtonElement,
  deleteModal: $('#delete-modal') as HTMLDivElement,
  cancelDeleteBtn: $('#cancel-delete-btn') as HTMLButtonElement,
  confirmDeleteBtn: $('#confirm-delete-btn') as HTMLButtonElement,
  
  // Footer
  currentYear: $('#current-year') as HTMLSpanElement,
};

// ---------- Initialize ----------
function init(): void {
  state = loadState();
  
  // Get recipe ID from URL hash
  const recipeId = window.location.hash.slice(1);
  if (!recipeId) {
    window.location.href = '/';
    return;
  }
  
  currentRecipe = getRecipeById(state, recipeId);
  if (!currentRecipe) {
    showToast('Recipe not found', 'error');
    window.location.href = '/';
    return;
  }
  
  // Set page title
  document.title = `Recipe Keeper — ${currentRecipe.title || 'New Recipe'}`;
  
  // Set current year
  if (elements.currentYear) {
    elements.currentYear.textContent = new Date().getFullYear().toString();
  }
  
  // Render initial state
  renderRecipe();
  setupEventListeners();
}

// ---------- Event Listeners ----------
function setupEventListeners(): void {
  // Save & Exit
  elements.saveExitBtn?.addEventListener('click', handleSaveAndExit);
  
  // Title
  elements.recipeTitle?.addEventListener('input', debounce(handleTitleChange, 300));
  
  // Star Rating
  elements.starRating?.addEventListener('click', handleStarClick);
  elements.starRating?.addEventListener('mouseover', handleStarHover);
  elements.starRating?.addEventListener('mouseout', handleStarMouseOut);
  
  // Cooking Time
  elements.cookingTime?.addEventListener('input', debounce(handleCookingTimeChange, 300));
  
  // Meal Type
  elements.mealTypeSelector?.addEventListener('click', handleMealTypeClick);
  
  // Instructions
  elements.addInstructionBtn?.addEventListener('click', handleShowInstructionForm);
  elements.instructionForm?.addEventListener('submit', handleInstructionSubmit);
  elements.cancelInstructionBtn?.addEventListener('click', handleCancelInstruction);
  elements.instructionsList?.addEventListener('click', handleInstructionListClick);
  
  // Ingredients
  elements.addIngredientBtn?.addEventListener('click', handleShowIngredientForm);
  elements.ingredientForm?.addEventListener('submit', handleIngredientSubmit);
  elements.ingredientsList?.addEventListener('click', handleIngredientListClick);
  elements.clearIngredientsBtn?.addEventListener('click', handleClearIngredients);
  
  // Delete Modal
  elements.deleteRecipeBtn?.addEventListener('click', handleShowDeleteModal);
  elements.cancelDeleteBtn?.addEventListener('click', handleHideDeleteModal);
  elements.confirmDeleteBtn?.addEventListener('click', handleConfirmDelete);
  elements.deleteModal?.querySelector('.modal__backdrop')?.addEventListener('click', handleHideDeleteModal);
}

// ---------- Render Functions ----------
function renderRecipe(): void {
  if (!currentRecipe) return;
  
  // Date
  if (elements.recipeDate) {
    elements.recipeDate.textContent = `Created ${formatFullDate(currentRecipe.creationTime)}`;
  }
  
  // Title
  if (elements.recipeTitle) {
    elements.recipeTitle.value = currentRecipe.title;
  }
  
  // Rating
  renderStars(currentRecipe.rating);
  
  // Cooking Time
  if (elements.cookingTime && currentRecipe.cookingTime) {
    elements.cookingTime.value = currentRecipe.cookingTime;
  }
  
  // Meal Type
  renderMealType(currentRecipe.mealType);
  
  // Instructions
  renderInstructions(currentRecipe.instructions);
  
  // Ingredients
  renderIngredients(currentRecipe.ingredients);
}

function renderStars(rating: number): void {
  if (!elements.starRating) return;
  
  const stars = elements.starRating.querySelectorAll('.star');
  stars.forEach((star, index) => {
    star.classList.toggle('selected', index < rating);
  });
}

function renderMealType(type: MealType): void {
  if (!elements.mealTypeSelector) return;
  
  const buttons = elements.mealTypeSelector.querySelectorAll('.meal-type-btn');
  buttons.forEach(btn => {
    const btnType = (btn as HTMLElement).dataset.type;
    btn.classList.toggle('selected', btnType === type);
  });
}

function renderInstructions(instructions: Instruction[]): void {
  if (!elements.instructionsList) return;
  
  if (instructions.length === 0) {
    elements.instructionsList.innerHTML = '';
    return;
  }
  
  elements.instructionsList.innerHTML = instructions.map((instruction, index) => `
    <li class="instructions-list__item" data-id="${instruction.instructionID}">
      <span class="instructions-list__number">${index + 1}</span>
      <div class="instructions-list__content">${escapeHtml(instruction.text)}</div>
      <div class="instructions-list__actions">
        <button class="instructions-list__btn" data-action="edit" data-id="${instruction.instructionID}" aria-label="Edit step">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
        </button>
        <button class="instructions-list__btn instructions-list__btn--delete" data-action="delete" data-id="${instruction.instructionID}" aria-label="Delete step">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
      </div>
    </li>
  `).join('');
}

function renderIngredients(ingredients: Ingredient[]): void {
  if (!elements.ingredientsList) return;
  
  // Show/hide empty state
  if (elements.ingredientsEmpty) {
    elements.ingredientsEmpty.style.display = ingredients.length === 0 ? 'block' : 'none';
  }
  
  if (ingredients.length === 0) {
    elements.ingredientsList.innerHTML = '';
    return;
  }
  
  elements.ingredientsList.innerHTML = ingredients.map(ingredient => `
    <li class="ingredients-list__item" data-id="${ingredient.ingredientID}">
      <span class="ingredients-list__text">${escapeHtml(ingredient.text)}</span>
      <button class="ingredients-list__delete" data-action="delete" data-id="${ingredient.ingredientID}" aria-label="Delete ingredient">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 6L6 18M6 6l12 12"></path>
        </svg>
      </button>
    </li>
  `).join('');
}

// ---------- Save Helper ----------
function saveCurrentRecipe(): void {
  if (!currentRecipe) return;
  state = updateRecipe(state, currentRecipe);
  saveState(state);
}

// ---------- Event Handlers ----------
function handleSaveAndExit(): void {
  if (!currentRecipe) return;
  
  if (!currentRecipe.title.trim()) {
    showToast('Please enter a recipe title before saving', 'error');
    elements.recipeTitle?.focus();
    return;
  }
  
  saveCurrentRecipe();
  showToast('Recipe saved!', 'success');
  
  // Small delay to show the toast
  setTimeout(() => {
    window.location.href = '/';
  }, 500);
}

function handleTitleChange(e: Event): void {
  if (!currentRecipe) return;
  const input = e.target as HTMLInputElement;
  currentRecipe.title = input.value;
  document.title = `Recipe Keeper — ${currentRecipe.title || 'New Recipe'}`;
  saveCurrentRecipe();
}

function handleStarClick(e: Event): void {
  if (!currentRecipe) return;
  const target = e.target as HTMLElement;
  const star = target.closest('.star') as HTMLElement;
  if (!star) return;
  
  const value = parseInt(star.dataset.value || '0', 10);
  currentRecipe.rating = value;
  renderStars(value);
  saveCurrentRecipe();
}

function handleStarHover(e: Event): void {
  const target = e.target as HTMLElement;
  const star = target.closest('.star') as HTMLElement;
  if (!star || !elements.starRating) return;
  
  const value = parseInt(star.dataset.value || '0', 10);
  const stars = elements.starRating.querySelectorAll('.star');
  stars.forEach((s, index) => {
    s.classList.toggle('hover', index < value);
  });
}

function handleStarMouseOut(): void {
  if (!elements.starRating) return;
  const stars = elements.starRating.querySelectorAll('.star');
  stars.forEach(s => s.classList.remove('hover'));
}

function handleCookingTimeChange(e: Event): void {
  if (!currentRecipe) return;
  const input = e.target as HTMLInputElement;
  currentRecipe.cookingTime = input.value;
  saveCurrentRecipe();
}

function handleMealTypeClick(e: Event): void {
  if (!currentRecipe) return;
  const target = e.target as HTMLElement;
  const button = target.closest('.meal-type-btn') as HTMLElement;
  if (!button) return;
  
  const type = button.dataset.type as MealType;
  currentRecipe.mealType = type;
  renderMealType(type);
  saveCurrentRecipe();
}

function handleShowInstructionForm(): void {
  editingInstructionId = null;
  if (elements.instructionTextarea) {
    elements.instructionTextarea.value = '';
  }
  if (elements.instructionForm) {
    elements.instructionForm.style.display = 'block';
    elements.instructionTextarea?.focus();
  }
  if (elements.addInstructionBtn) {
    elements.addInstructionBtn.style.display = 'none';
  }
}

function handleCancelInstruction(): void {
  editingInstructionId = null;
  if (elements.instructionForm) {
    elements.instructionForm.style.display = 'none';
  }
  if (elements.addInstructionBtn) {
    elements.addInstructionBtn.style.display = 'inline-flex';
  }
  // Remove editing class
  elements.instructionsList?.querySelectorAll('.editing').forEach(el => el.classList.remove('editing'));
}

function handleInstructionSubmit(e: Event): void {
  e.preventDefault();
  if (!currentRecipe || !elements.instructionTextarea) return;
  
  const text = elements.instructionTextarea.value.trim();
  if (!text) {
    showToast('Please enter instruction text', 'error');
    return;
  }
  
  if (editingInstructionId) {
    // Update existing
    const instruction = currentRecipe.instructions.find(i => i.instructionID === editingInstructionId);
    if (instruction) {
      instruction.text = text;
    }
  } else {
    // Add new
    currentRecipe.instructions.push({
      instructionID: generateId(),
      text
    });
  }
  
  saveCurrentRecipe();
  renderInstructions(currentRecipe.instructions);
  handleCancelInstruction();
  showToast(editingInstructionId ? 'Step updated' : 'Step added', 'success');
}

function handleInstructionListClick(e: Event): void {
  if (!currentRecipe) return;
  const target = e.target as HTMLElement;
  const button = target.closest('[data-action]') as HTMLElement;
  if (!button) return;
  
  const action = button.dataset.action;
  const id = button.dataset.id;
  if (!id) return;
  
  if (action === 'edit') {
    const instruction = currentRecipe.instructions.find(i => i.instructionID === id);
    if (!instruction) return;
    
    editingInstructionId = id;
    if (elements.instructionTextarea) {
      elements.instructionTextarea.value = instruction.text;
    }
    if (elements.instructionForm) {
      elements.instructionForm.style.display = 'block';
      elements.instructionTextarea?.focus();
    }
    if (elements.addInstructionBtn) {
      elements.addInstructionBtn.style.display = 'none';
    }
    // Add editing class to the item
    const item = elements.instructionsList?.querySelector(`[data-id="${id}"]`);
    item?.classList.add('editing');
  } else if (action === 'delete') {
    currentRecipe.instructions = currentRecipe.instructions.filter(i => i.instructionID !== id);
    saveCurrentRecipe();
    renderInstructions(currentRecipe.instructions);
    showToast('Step removed', 'success');
  }
}

function handleShowIngredientForm(): void {
  if (elements.ingredientForm) {
    elements.ingredientForm.style.display = 'flex';
    elements.ingredientInput?.focus();
  }
  if (elements.addIngredientBtn) {
    elements.addIngredientBtn.style.display = 'none';
  }
}

function handleIngredientSubmit(e: Event): void {
  e.preventDefault();
  if (!currentRecipe || !elements.ingredientInput) return;
  
  const text = elements.ingredientInput.value.trim();
  if (!text) {
    showToast('Please enter an ingredient', 'error');
    return;
  }
  
  currentRecipe.ingredients.push({
    ingredientID: generateId(),
    text
  });
  
  saveCurrentRecipe();
  renderIngredients(currentRecipe.ingredients);
  
  // Clear input and keep form open for quick entry
  elements.ingredientInput.value = '';
  elements.ingredientInput.focus();
  showToast('Ingredient added', 'success');
}

function handleIngredientListClick(e: Event): void {
  if (!currentRecipe) return;
  const target = e.target as HTMLElement;
  const button = target.closest('[data-action="delete"]') as HTMLElement;
  if (!button) return;
  
  const id = button.dataset.id;
  if (!id) return;
  
  currentRecipe.ingredients = currentRecipe.ingredients.filter(i => i.ingredientID !== id);
  saveCurrentRecipe();
  renderIngredients(currentRecipe.ingredients);
}

function handleClearIngredients(): void {
  if (!currentRecipe || currentRecipe.ingredients.length === 0) return;
  
  currentRecipe.ingredients = [];
  saveCurrentRecipe();
  renderIngredients(currentRecipe.ingredients);
  showToast('All ingredients cleared', 'success');
}

function handleShowDeleteModal(): void {
  if (elements.deleteModal) {
    elements.deleteModal.classList.add('active');
  }
}

function handleHideDeleteModal(): void {
  if (elements.deleteModal) {
    elements.deleteModal.classList.remove('active');
  }
}

function handleConfirmDelete(): void {
  if (!currentRecipe) return;
  
  state = deleteRecipe(state, currentRecipe.id);
  saveState(state);
  showToast('Recipe deleted', 'success');
  
  setTimeout(() => {
    window.location.href = '/';
  }, 500);
}

// ---------- Start the app ----------
document.addEventListener('DOMContentLoaded', init);

