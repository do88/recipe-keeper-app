// Modules imports
import $ from 'jquery';
// Data imports
import * as recipeObj from './Models/Recipe';
import * as localStorage from './Models/LocalStorage';
// View imports
import * as homeView from './Views/homeView';
import * as recipeView from './Views/recipeView';
import filterRecipesList from './Views/searchView';
import { elements, getCurrentRecipe } from './Views/base';

//  ===========================================
//  Init functions - Get the ball rolling
//  ===========================================

// Define state var
let state;

$(document).ready(() => {
	// Load state from local storage
	state = localStorage.loadData();
	window.state = state; // Temp exposure of state object

	if (window.location.pathname === '/') {
		// Render the home HTML
		homeView.renderHomeView(state);
	} else {
		// Load state from local storage
		recipeView.renderSingleRecipe(state);
	}
});

//  ===========================================
//  Home Search Controller
//  ===========================================

elements.recipeSearch.on('keyup', (e) => {
	const searchValue = e.target.value.toLowerCase();
	filterRecipesList(searchValue);
});

//  ===========================================
//  Shopping Basket Controller
//  ===========================================

//  ===========================================
//  Recipe Controller
//  ===========================================

$('#addRecipe').on('click', () => {
	// Create new object
	const recipe = recipeObj.createNewRecipe();
	// push it to the state
	state.recipeEntries.push(recipe);
	// Save state to localStorage
	localStorage.saveData(state);
	// redirect to new recipe page
	window.location.assign(`recipe.html#${recipe.id}`);
});

//  ===========================================
//  Single Recipe Page Controllers
//  ===========================================

// ------------------ Add new ingredient ------------------ //
$(elements.addIngredient).on('click', () => {
	$(elements.addIngredientForm).css('display', '');
});

$(elements.addIngredientForm).on('submit', (e) => {
	e.preventDefault();
	const currentRecipe = getCurrentRecipe(state);
	// Push value into current state object
	state.recipeEntries.ingredients.push(e.target[0].value);
	// Hide form
	$(this).css('display', 'none');
	// Update list HTML
	// Show saving message
	// save state to localhost
});

// ------------------ Delete all ingredients ------------------ //
$(elements.deleteIngredients).on('click', () => {
	const currentRecipe = getCurrentRecipe(state);
	currentRecipe.ingredients = [];
	$(elements.shoppingList).html('');
});
