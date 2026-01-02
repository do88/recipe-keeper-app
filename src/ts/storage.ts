// ============================================
// Recipe Keeper — Local Storage Management
// ============================================

import type { AppState, Recipe, Ingredient } from './types';
import { defaultState } from './defaultData';

const STORAGE_KEY = 'recipe_keeper_state';

// ---------- Load State ----------
export function loadState(): AppState {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : defaultState;
  } catch {
    console.warn('Failed to load state from localStorage, using default');
    return defaultState;
  }
}

// ---------- Save State ----------
export function saveState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save state to localStorage:', error);
  }
}

// ---------- Recipe Operations ----------
export function getRecipeById(state: AppState, id: string): Recipe | undefined {
  return state.recipeEntries.find(recipe => recipe.id === id);
}

export function getRecipeIndex(state: AppState, id: string): number {
  return state.recipeEntries.findIndex(recipe => recipe.id === id);
}

export function addRecipe(state: AppState, recipe: Recipe): AppState {
  return {
    ...state,
    recipeEntries: [...state.recipeEntries, recipe]
  };
}

export function updateRecipe(state: AppState, updatedRecipe: Recipe): AppState {
  return {
    ...state,
    recipeEntries: state.recipeEntries.map(recipe =>
      recipe.id === updatedRecipe.id ? updatedRecipe : recipe
    )
  };
}

export function deleteRecipe(state: AppState, id: string): AppState {
  return {
    ...state,
    recipeEntries: state.recipeEntries.filter(recipe => recipe.id !== id)
  };
}

// ---------- Shopping List Operations ----------
export function addToShoppingList(state: AppState, ingredients: Ingredient[]): AppState {
  return {
    ...state,
    shoppingList: [...state.shoppingList, ...ingredients]
  };
}

export function removeFromShoppingList(state: AppState, ingredientId: string): AppState {
  return {
    ...state,
    shoppingList: state.shoppingList.filter(item => item.ingredientID !== ingredientId)
  };
}

export function clearShoppingList(state: AppState): AppState {
  return {
    ...state,
    shoppingList: []
  };
}

