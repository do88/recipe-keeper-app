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

// Define state and currentRecipe var
let state;
let currentRecipe;

$(document).ready(() => {
	// Load state from local storage
	state = localStorage.loadData();
	currentRecipe = getCurrentRecipe(state);

	window.state = state;
	window.currentRecipe = currentRecipe;

	if (window.location.pathname === '/index.html' || window.location.pathname === '/') {
		// Render the home HTML
		homeView.renderHomeView(state);
	} else {
		// Load state from local storage
		recipeView.renderSingleRecipe(state);
	}
});

// Disable default actions for buttons through site except for footer
$('a').on('click', (e) => {
	if (!$('footer')) e.preventDefault();
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
		e.preventDefault();
		const recipeID = $(e.target).parent().parent().attr('id');
		// Get recipe that was clicked on
		const currentRecipeHome = getCurrentRecipe(state, recipeID);
		// Push ingredients to state.basket
		currentRecipeHome.ingredients.forEach((item) => {
			state.shoppingList.push(item);
		});
		localStorage.saveData(state);
		homeView.renderShoppingBasket(state.shoppingList);
	}
});

// -------------- Clear all shopping basket items //
elements.clearShopping.on('click', () => {
	state.shoppingList = [];
	localStorage.saveData(state);
	homeView.renderShoppingBasket(state.shoppingList);
});

// -------------- Delete ingredient from list //
elements.shoppingList.on('click', (e) => {
	if ($(e.target).closest('a').hasClass('delete-ingredient') && currentRecipe === undefined) {
		e.preventDefault();
		const clickedIngredientID = $(e.target).closest('li').attr('id');
		const clickedIngredient = state.shoppingList.findIndex(i => i.ingredientID === clickedIngredientID);
		// Delete ingredient from state
		state.shoppingList.splice(clickedIngredient, 1);
		localStorage.saveData(state);
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
	localStorage.saveData(state);
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
		localStorage.saveData(state);
		window.location.assign('/index.html');
	}
});

// -------------- Show title input form //
elements.editTitle.on('click', (e) => {
	e.preventDefault();
	elements.recipeFormTitle.find('h1').hide();
	elements.singleRecipeTitle.val(currentRecipe.title).show();
});

// -------------- Save title input field //
elements.saveTitle.on('click', (e) => {
	e.preventDefault();
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
elements.addInstruction.on('click', (e) => {
	e.preventDefault();
	elements.addInstructionForm.slideDown();
});

// -------------- Edit instructional step //
elements.recipeSteps.on('click', (e) => {
	e.preventDefault();
	if ($(e.target).closest('a').hasClass('edit-instruction')) {
		// Check for active classes and remove it
		$(elements.recipeSteps).find('.active').removeClass('active');
		// Set li class to active
		$(e.target).closest('li').addClass('active');
		// Show the form
		elements.addInstructionForm.slideDown(() => {
			// Get the data and fill the form with it
			const clickedId = $(e.target).closest('li').attr('id');
			const clickedInstructionIndex = currentRecipe.instructions.findIndex(i => i.instructionID === clickedId);
			$(elements.addInstructionForm).find('textarea').val(currentRecipe.instructions[clickedInstructionIndex].text);
		});
	}
});

// -------------- Add instructional step to recipe //
elements.addInstructionForm.on('submit', (e) => {
	e.preventDefault();
	const checkForClass = elements.recipeSteps.children().hasClass('active');
	// Check if this is new information or editing existing by checking for active status
	if (checkForClass) {
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

	localStorage.saveData(state);
	elements.addInstructionForm.slideUp(() => {
		elements.addInstructionForm[0].reset();
		recipeView.setInstructions(currentRecipe.instructions);
	});
});

// -------------- Delete instructional step //
elements.recipeSteps.on('click', (e) => {
	e.preventDefault();
	const checkIfBeingEdited = $(e.target).closest('ol').children().hasClass('active');
	const checkifButton = $(e.target).closest('a').hasClass('delete-instruction');
	const clickedInstructionID = $(e.target).closest('li').attr('id');

	if (checkifButton === true && checkIfBeingEdited === false) {
		// Find the index of clicked instruction & index of current recipe in state
		const clickedInstructionIndex = currentRecipe.instructions.findIndex(i => i.instructionID === clickedInstructionID);
		const currentRecipeIndex = state.recipeEntries.findIndex(i => i.id === currentRecipe.id);
		// Delete ingredient from state
		state.recipeEntries[currentRecipeIndex].instructions.splice(clickedInstructionIndex, 1);
		localStorage.saveData(state);
		recipeView.setInstructions(currentRecipe.instructions);
	}
});

// -------------- Show ingredient form //
elements.addIngredient.on('click', (e) => {
	e.preventDefault();
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

	localStorage.saveData(state);
	elements.addIngredientForm.slideUp(() => {
		elements.addIngredientForm[0].reset();
		recipeView.setIngredients(currentRecipe.ingredients);
	});
});

// -------------- Delete single ingredient //
elements.shoppingList.on('click', (e) => {
	if ($(e.target).closest('a').hasClass('delete-ingredient') && currentRecipe !== undefined) {
		e.preventDefault();
		// get the ingredient id
		const clickedIngredientID = $(e.target).closest('li').attr('id');
		// get the current recipe index
		const currentRecipeIndex = state.recipeEntries.findIndex(i => i.id === currentRecipe.id);
		// get the ingredient index value in the current recipe
		const clickedIngredient = state.recipeEntries[currentRecipeIndex]
			.ingredients.findIndex(i => i.ingredientID === clickedIngredientID);

		// Delete ingredient from state
		state.recipeEntries[currentRecipeIndex].ingredients.splice(clickedIngredient, 1);
		localStorage.saveData(state);
		recipeView.setIngredients(currentRecipe.ingredients);
	}
});

// -------------- Delete all ingredients //
$(elements.deleteIngredients).on('click', (e) => {
	e.preventDefault();
	const currentRecipeIndex = state.recipeEntries.findIndex(i => i.id === currentRecipe.id);
	state.recipeEntries[currentRecipeIndex].ingredients = [];
	localStorage.saveData(state);
	$(elements.shoppingList).html('');
});

// -------------- Open Modal for Delete //
$(elements.deleteRecipe).on('click', () => {
	$(elements.myModal).fadeToggle();
});

// -------------- Close modal //
$(elements.closeWindow).on('click', () => {
	$(elements.myModal).fadeToggle();
});

// -------------- Delete Recipe Confirm //
$(elements.deleteRecipeConfirm).on('click', () => {
	const currentRecipeIndex = state.recipeEntries.findIndex(i => i.id === currentRecipe.id);
	state.recipeEntries.splice(currentRecipeIndex, 1);
	localStorage.saveData(state);
	window.location.assign('/index.html');
});
