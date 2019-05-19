// Modules imports
import $ from 'jquery';
import uuidv4 from 'uuid/v4';
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

// Prevent button links working
$('a').on('click', (e) => {
	e.preventDefault();
});

// Define state and currentRecipe var
let state;
let currentRecipe;

$(document).ready(() => {
	// Load state from local storage
	state = localStorage.loadData();
	currentRecipe = getCurrentRecipe(state);

	window.state = state; // Temp exposure of state object
	window.currentRecipe = currentRecipe; // Temp exposure of currentRecipe

	if (window.location.pathname === '/index.html' || window.location.pathname === '/') {
		// Render the home HTML
		homeView.renderHomeView(state);
	} else {
		// Load state from local storage
		recipeView.renderSingleRecipe(state);
	}
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
		const currentRecipeHome = getCurrentRecipe(state, recipeID);
		// Push ingredients to state.basket
		currentRecipeHome.ingredients.forEach((item) => {
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
	if ($(e.target).hasClass('delete-ingredient') && currentRecipe === undefined) {
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

// -------------- Show title input form //
elements.editTitle.on('click', () => {
	elements.recipeFormTitle.find('h1').hide();
	elements.singleRecipeTitle.val(currentRecipe.title).show();
});

// -------------- Save title input field //
elements.saveTitle.on('click', () => {
	// Check if field is actually being edited
	if (elements.singleRecipeTitle[0].style.display === 'none') {
		// do nothing
	} else if (currentRecipe.title) {
		currentRecipe.title = elements.singleRecipeTitle.val();
		localStorage.saveData(state);
		elements.singleRecipeTitle.hide();
		elements.recipeFormTitle.find('h1').html(elements.singleRecipeTitle.val()).show();
	} else {
		renderMessage('error', 'Please enter a recipe title before saving');
	}
});

// -------------- Edit title input form //
elements.singleRecipeTitle.on('keyup', (e) => {
	currentRecipe.title = e.target.value;
	localStorage.saveData(state);
});

// -------------- Set star rating //
elements.ratingsRecipe.on('click', (e) => {
	currentRecipe.rating = $(e.target).closest('li').data('value');
	localStorage.saveData(state);
});

// --------------  Update cooking time //
elements.cookingTime.on('keyup', (e) => {
	currentRecipe.cookingTime = e.target.value;
	localStorage.saveData(state);
});

// --------------  Set meal type //
elements.mealType.on('click', (e) => {
	const results = $(e.target).toArray();
	currentRecipe.mealType = results[0].id;
	localStorage.saveData(state);
});

// -------------- Open form to add instructions //
elements.addInstruction.on('click', () => {
	elements.addInstructionForm.slideDown();
});

// -------------- Edit instructional step //
elements.recipeSteps.on('click', (e) => {
	e.preventDefault();
	if ($(e.target).hasClass('edit-instruction')) {
		// Check for active classes and remove it
		$(elements.recipeSteps).find('.active').removeClass('active');
		// Set li class to active
		$(e.target).closest('li').addClass('active');
		// Show the form
		elements.addInstructionForm.slideDown(() => {
			// Get the data and fill the form with it
			const clickedInstructionIndex = currentRecipe.instructions.findIndex(i => i.instructionID === e.target.parentElement.id);
			$(elements.addInstructionForm).find('textarea').val(currentRecipe.instructions[clickedInstructionIndex].text);
		});
	}
});

// -------------- Add instructional step to recipe //
elements.addInstructionForm.on('submit', (e) => {
	// Check if this is new information or editing existing by checking for active status
	if (elements.recipeSteps.children().hasClass('active')) {
		// Ge the ID of the item being edited
		const editingListItemID = elements.recipeSteps.find('.active')[0].id;
		// Find the index of clicked instruction & index of current recipe in state
		const clickedInstructionIndex = currentRecipe.instructions.findIndex(i => i.instructionID === editingListItemID);
		const currentRecipeIndex = state.recipeEntries.findIndex(i => i.id === currentRecipe.id);
		// use the ID of the current recipe and the instructional step to update the objects text property
		state.recipeEntries[currentRecipeIndex].instructions[clickedInstructionIndex].text = e.target[0].value;
	} else {
		// if none have an active status push a new object into the instructional array of the current recipe
		currentRecipe.instructions.push({
			instructionID: uuidv4(),
			text: e.target[0].value,
		});
	}

	// Save submission to state
	localStorage.saveData(state);
	// Update HTML
	elements.addInstructionForm.slideUp(() => {
		elements.addInstructionForm[0].reset();
		recipeView.setInstructions(currentRecipe.instructions);
	});
});

// -------------- Delete instructional step //
elements.recipeSteps.on('click', (e) => {
	e.preventDefault();
	const checkIfBeingEdited = $(e.target).closest('li').hasClass('active');
	const checkifButton = $(e.target).hasClass('delete-instruction');
	if (checkifButton === true && checkIfBeingEdited === false) {
		// Find the index of clicked instruction & index of current recipe in state
		const clickedInstructionIndex = currentRecipe.instructions.findIndex(i => i.instructionID === e.target.parentElement.id);
		const currentRecipeIndex = state.recipeEntries.findIndex(i => i.id === currentRecipe.id);
		// Delete ingredient from state
		state.recipeEntries[currentRecipeIndex].instructions.splice(clickedInstructionIndex, 1);
		// Save to localhost
		localStorage.saveData(state);
		// Update HTML
		recipeView.setInstructions(currentRecipe.instructions);
	}
});

// -------------- Show ingredient form //
elements.addIngredient.on('click', () => {
	elements.addIngredientForm.slideDown();
});

// -------------- Add new ingredient //
elements.addIngredientForm.on('submit', (e) => {
	e.preventDefault();
	// Push value into current state object
	const currentRecipeIndex = state.recipeEntries.findIndex(i => i.id === currentRecipe.id);
	state.recipeEntries[currentRecipeIndex].ingredients.push({
		ingredientID: uuidv4(),
		text: e.target[0].value,
	});

	// Save submission to state
	localStorage.saveData(state);
	// Hide form
	elements.addIngredientForm.slideUp(() => {
		elements.addIngredientForm[0].reset();
		recipeView.setIngredients(currentRecipe.ingredients);
	});
});

// -------------- Delete single ingredient //
elements.shoppingList.on('click', (e) => {
	if ($(e.target).hasClass('delete-ingredient') && currentRecipe !== undefined) {
		e.preventDefault();
		const clickedIngredient = state.shoppingList.findIndex(i => i.ingredientID === e.target.parentElement.id);
		const currentRecipeIndex = state.recipeEntries.findIndex(i => i.id === currentRecipe.id);
		// Delete ingredient from state
		state.recipeEntries[currentRecipeIndex].ingredients.splice(clickedIngredient, 1);
		// Save to localhost
		localStorage.saveData(state);
		// Update basket HTML
		recipeView.setIngredients(currentRecipe.ingredients);
	}
});

// -------------- Delete all ingredients //
$(elements.deleteIngredients).on('click', () => {
	const currentRecipeIndex = state.recipeEntries.findIndex(i => i.id === currentRecipe.id);
	state.recipeEntries[currentRecipeIndex].ingredients = [];
	localStorage.saveData(state);
	$(elements.shoppingList).html('');
});
