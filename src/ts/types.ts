// ============================================
// Recipe Keeper — Type Definitions
// ============================================

export interface Ingredient {
  ingredientID: string;
  text: string;
}

export interface Instruction {
  instructionID: string;
  text: string;
}

export type MealType = 'fishDish' | 'vegDish' | 'meatDish' | '';

export interface Recipe {
  id: string;
  title: string;
  rating: number;
  cookingTime: string;
  creationTime: string;
  mealType: MealType;
  ingredients: Ingredient[];
  instructions: Instruction[];
}

export interface AppState {
  recipeEntries: Recipe[];
  shoppingList: Ingredient[];
}

export type ToastType = 'success' | 'error';

