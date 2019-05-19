// Modules imports
import $ from 'jquery';
// Data imports
import * as recipeObj from './Models/Recipe';
import * as localStorage from './Models/LocalStorage';
// View imports
import * as homeView from './Views/homeView';
import * as recipeView from './Views/recipeView';
import renderMessage from './Views/messageView';
import filterRecipesList from './Views/searchView';
import { elements, getCurrentRecipe } from './Views/base';

//  ======================================================================================
//  Init functions - Get the ball rolling
//  ======================================================================================

// Define state var
let state;

$(document).ready(() => {
	// Load state from local storage
	state = localStorage.loadData();
	window.state = state; // Temp exposure of state object

	if (window.location.pathname === '/index.html' || window.location.pathname === '/') {
		// Render the home HTML
		homeView.renderHomeView(state);
	} else {
		// Load state from local storage
		recipeView.renderSingleRecipe(state);
	}
});

$('a').on('click', (e) => {
	e.preventDefault();
});

//  ======================================================================================
//  Home Search Controller
//  ======================================================================================

// Filter results based on search input
elements.recipeSearch.on('keyup', (e) => {
	const searchValue = e.target.value.toLowerCase();
	filterRecipesList(searchValue);
});

//  ======================================================================================
//  Shopping Basket Controllers
//  ======================================================================================

// -------------- Add recipe ingredients to shopping basket //
elements.recipeContainer.on('click', (e) => {
	if ($(e.target).hasClass('addToBasket')) {
		const recipeID = $(e.target).parent().parent().attr('id');
		// Get recipe that was clicked on
		const currentRecipe = getCurrentRecipe(state, recipeID);
		// Push ingredients to state.basket
		currentRecipe.ingredients.forEach((item) => {
			state.shoppingList.push(item);
		});
		// Save to localhost
		localStorage.saveData(state);
		// Update basket HTML
		homeView.renderShoppingBasket(state.shoppingList);
	}
});

// -------------- Clear all shopping basket items //
elements.clearShopping.on('click', () => {
	// Empty array of ingredients
	state.shoppingList = [];
	// Save to localhost
	localStorage.saveData(state);
	// Update basket HTML
	homeView.renderShoppingBasket(state.shoppingList);
});

// -------------- Delete ingredient from list //
elements.shoppingList.on('click', (e) => {
	if ($(e.target).hasClass('delete-ingredient')) {
		const clickedIngredient = state.shoppingList.findIndex(i => i.ingredientID === e.target.parentElement.id);
		// Delete ingredient from state
		state.shoppingList.splice(clickedIngredient, 1);
		// Save to localhost
		localStorage.saveData(state);
		// Update basket HTML
		homeView.renderShoppingBasket(state.shoppingList);
	}
});

//  ======================================================================================
//  Add Recipe Controller
//  ======================================================================================

// -------------- Add new recipe to state and goto new page //
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

//  ======================================================================================
//  Single Recipe Page Controllers
//  ======================================================================================

// -------------- Save and exit back to home //
elements.saveAndExit.on('click', () => {
	const currentRecipe = getCurrentRecipe(state);
	// Check if title has been entered
	if (currentRecipe.title === '') {
		// Show error message
		renderMessage('error', 'Please enter a recipe title before saving');
	} else {
		// Save state to localStorage
		localStorage.saveData(state);
		// back to home page
		window.location.assign('/');
	}
});

/**
 * MAKE BELOW SECTION DRYER MAYBE?
 */
// -------------- Show title input form //
elements.editTitle.on('click', () => {
	const currentRecipe = getCurrentRecipe(state);
	elements.recipeFormTitle.find('h1').hide();
	elements.singleRecipeTitle.val(currentRecipe.title).show();
});

// -------------- Save title input field //
elements.saveTitle.on('click', () => {
	const currentRecipe = getCurrentRecipe(state);
	currentRecipe.title = elements.singleRecipeTitle.val();
	localStorage.saveData(state);
	elements.singleRecipeTitle.hide();
	elements.recipeFormTitle.find('h1').html(elements.singleRecipeTitle.val()).show();
});

// -------------- Edit title input form //
elements.singleRecipeTitle.on('keyup', (e) => {
	const currentRecipe = getCurrentRecipe(state);
	currentRecipe.title = e.target.value;
	localStorage.saveData(state);
});

// -------------- Set star rating //
elements.ratingsRecipe.on('click', (e) => {
	const currentRecipe = getCurrentRecipe(state);
	currentRecipe.rating = $(e.target).closest('li').data('value');
	localStorage.saveData(state);
});

// --------------  Update cooking time //
elements.cookingTime.on('keyup', (e) => {
	const currentRecipe = getCurrentRecipe(state);
	currentRecipe.cookingTime = e.target.value;
	localStorage.saveData(state);
});

// --------------  Set meal type //
elements.mealType.on('click', (e) => {
	const currentRecipe = getCurrentRecipe(state);
	const results = $(e.target).toArray();
	currentRecipe.mealType = results[0].id;
	localStorage.saveData(state);
});

/**
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 */
// -------------- Add new ingredient //
elements.addIngredient.on('click', () => {
	elements.addIngredientForm.css('display', '');
});
elements.addIngredientForm.on('submit', (e) => {
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

// -------------- Delete all ingredients //
$(elements.deleteIngredients).on('click', () => {
	const currentRecipe = getCurrentRecipe(state);
	currentRecipe.ingredients = [];
	$(elements.shoppingList).html('');
});
