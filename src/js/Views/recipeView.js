import $ from 'jquery';
import moment from 'moment';
import CrossSVG from '../../img/Cross.svg';
import { elements, getCurrentRecipe, jqueryStarRatingWatchers } from './base';

// Jacket potatoes with tuna and spring onions
// http://localhost:1234/recipe.html#b943440b-af1d-46e1-b9d9-8fd8ebd62fb7

export function renderSingleRecipe(currentState) {
	// Get the current recipe object
	const currentRecipe = getCurrentRecipe(currentState);
	// Set the page <title></title>
	document.title = `Recipe Keeper - ${currentRecipe.title}`;
	// Start the star rating watcher
	jqueryStarRatingWatchers();
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

function setDate(creationTime) {
	$(elements.singRecipeCreated).html(`Created ${moment(creationTime).format('Do MMMM YYYY')}`);
}

export function setIngredients(ingredients) {
	$(elements.shoppingList).html('');
	ingredients.forEach((item) => {
		$(elements.shoppingList).append(`
			<li id="${item.ingredientID}">
			${item.text}
				<a href="#" class="inline-button inline-button--delete delete-ingredient">
					<svg>
						<use href="${CrossSVG}#Cross"></use>
					</svg>Delete
				</a>
			</li>
		`);
	});
}

export function setInstructions(instructions) {
	$(elements.recipeSteps).html('');
	instructions.forEach((item) => {
		$(elements.recipeSteps).append(`
		<li id="${item.instructionID}">
			<p>${item.text}</p>
			<a href="#" class="inline-button edit-instruction">Edit</a>
			<a href="#" class="inline-button inline-button--delete delete-instruction">
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
		for (let i = 0; i < rating; i++) {
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
