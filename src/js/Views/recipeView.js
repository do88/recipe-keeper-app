import $ from 'jquery';
import moment from 'moment';
import CrossSVG from '../../img/Cross.svg';
import { elements } from './base';

// Jacket potatoes with tuna and spring onions
// http://localhost:1234/recipe.html#b943440b-af1d-46e1-b9d9-8fd8ebd62fb7

export function renderSingleRecipe(currentState) {
	// Get the current recipe object
	const currentRecipe = getCurrentRecipe(currentState);
	// Set the page <title></title>
	document.title = `Recipe Keeper - ${currentRecipe.title}`;
	// Set date
	setDate(currentRecipe.creationTime);
	// Set ingredients
	setIngredients(currentRecipe.ingredients);
	// // Set title
	setTitle(currentRecipe.title);
	// // Set star ratings
	setRating(currentRecipe.rating);
	// // Set cooking time
	setCookingTime(currentRecipe.cookingTime);
	// // Set meal type
	setMealType(currentRecipe.mealType);
	// // Set instructions
	setInstructions(currentRecipe.instructions);
}

export function getCurrentRecipe(state) {
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
	$(elements.singRecipeCreated).html(`Created ${moment(creationTime).format('Do MMMM YYYY')}`);
}

export function setIngredients(ingredients) {
	ingredients.forEach((item) => {
		$(elements.shoppingList).append(`
			<li class="${item.ingredientID}">${item.text}
				<a href="#" class="inline-button inline-button--delete delete-step">
					<svg>
						<use href="${CrossSVG}#Cross"></use>
					</svg>Delete
				</a>
			</li>
		`);
	});
}

function setTitle(title) {
	if (title) {
		$(elements.recipeFormTitle).find('h1').html(title);
	} else {
		$(elements.singleRecipeTitle).css('display', '');
	}
}

function setRating(rating) {
	if (rating) {
		const stars = $('li.star');
		let i;
		for (i = 0; i < rating; i++) {
			$(stars[i]).addClass('selected');
		}
	}
}

function setCookingTime(time) {
	if (time) $(elements.cookingTime).val(time);
}

function setMealType(meal) {
	if (meal) $(elements.mealType).find(`#${meal}`).attr('checked', true);
}

function setInstructions(instructions) {
	instructions.forEach((item) => {
		$(elements.recipeSteps).append(`
		<li class="${item.instructionID}">${item.text}
			<a href="#" class="inline-button inline-button__delete delete_ingredient">
				<svg>
					<use href="/src/img/Cross.svg#Cross"></use>
				</svg>Delete
			</a>
		</li>
		`);
	});
}
