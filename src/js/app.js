import $ from 'jquery';
// Data imports
import createNewRecipe from './Models/Recipe';
import { saveLocalStorage, loadLocalStorage } from './Models/LocalStorage';
// View imports
import * as recipeView from './Views/recipeView';
import filterRecipesList from './Views/searchView';
import { elements, jqueryStarRatingWatchers } from './Views/base';

//  ===========================================
//  Init functions - Get the ball rolling
//  ===========================================

// Define state var
let state;

$(document).ready(() => {
	// Load state from local storage
	state = loadLocalStorage();
	window.state = state; // Temp exposure of state object

	if (window.location.pathname === '/') {
		// Clear the search input
		$(elements.recipeSearch).val('');
	} else {
		// Load state from local storage
		jqueryStarRatingWatchers();
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
	const newRecipe = createNewRecipe();
	// push it to the state
	state.recipeEntries.push(newRecipe);
	// Save state to localStorage
	saveLocalStorage(state);
	// redirect to new recipe page
	window.location.assign(`recipe.html#${newRecipe.id}`);
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
	const currentRecipe = recipeView.getCurrentRecipe(state);
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
	const currentRecipe = recipeView.getCurrentRecipe(state);
	currentRecipe.ingredients = [];
	$(elements.shoppingList).html('');
});
