import $ from 'jquery';
import createNewRecipe from './Models/NewRecipe';
import { saveLocalStorage, loadLocalStorage } from './Models/LocalStorage';
import filterRecipesList from './Views/searchView';
import renderSingleRecipe from './Views/recipeView';
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
		renderSingleRecipe(state);
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
//  Single Recipe Page Controller
//  ===========================================
