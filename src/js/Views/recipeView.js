import $ from 'jquery';
import moment from 'moment';
import loadStateToLocalStorage from '../Models/LoadFromLocal';
import { elements } from './base';

export default function renderSingleRecipe() {
	// FUNC to get the current recipe object
	const currentRecipe = getCurrentRecipe();
	console.log(currentRecipe);
	// FUNC to fill in the date
	setDate(currentRecipe.creationTime);
}

function getCurrentRecipe() {
	// Load the current state object
	const state = loadStateToLocalStorage();
	// Get the current page hash
	const pageID = window.location.hash.substr(1);
	// Check hash against object ids
	const currentRecipeIndex = state.recipeEntries.findIndex(item => item.id === pageID);
	// Get correct object from recipeEntries array
	const currentRecipe = state.recipeEntries[currentRecipeIndex];
	// Return current recipe object
	return currentRecipe;
}

function setDate(creationTime) {
	// Set element HTML
	$(elements.singRecipeCreated).html(`Created ${moment(creationTime).format('Do MMMM YYYY')}`);
}
