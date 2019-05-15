/* eslint-disable func-names */
/* eslint-disable import/prefer-default-export */
import $ from 'jquery';

//  ===========================================
//  HTML element for selections
//  ===========================================

export const elements = {
	// Home existing HTML
	recipeSearch: $('#recipeSearch'), // Search box on home
	recipeContainer: $('.recipe--container'), // Container for the recipe entries
	sortOrder: $('#sortOrder'), // Sort order dropdown
	addRecipe: $('#addRecipe'), // Add new recipe button
	clearShopping: $('#clearShopping'), // Clear all the shopping basket button
	recipeMessages: $('.recipe--messages'), // Clear all the shopping basket button

	// Home generated HTML
	recipeAddToBasketButton: $('.recipe--list-button'), // add ingredients to basket button !needs (ID)!!!
	recipeTitle: $('.recipe--title'), // recipe title
	recipeEntry: $('.recipe--entry'), // recipe entries

	// Recipe existing HTML
	saveAndExit: $('#saveAndExit'), // save and exit back to index button
	singRecipeCreated: $('.header--recipe-created'), // save and exit back to index button

	deleteIngredients: $('#deleteIngredients'), // delete all added ingredients
	deleteRecipe: $('#deleteRecipe'), // delete the recipe itself

	saveTitle: $('#saveTitle'), // save the title of the recipe
	editTitle: $('#editTitle'), // edit the title of the recipe

	singleRecipeTitle: $('#recipeTitle'), // input for the recipe title
	ratingsRecipe: $('#ratingsRecipe'), // the rating UL of stars
	cookingTime: $('#cookingTime'), // cooking time of the recipe
	mealType: $('#mealType'), // form for the meal type of the recipe

	addInstruction: $('#addInstruction'), // add extra instruction step to recipe button
	addInstructionForm: $('#addInstructionForm'), // form to add instruction

	addIngredient: $('#addIngredient'), // button to add ingredient
	addIngredientForm: $('#addIngredientForm'), // form for the meal type of the recipe

	// Recipe generated HTML
	deleteStep: $('.delete_step'), // delete a recipe step
	deleteIngredient: $('.delete_ingredient'), // delete a recipe step
};

//  ===========================================
//  jQuery rating system
//  ===========================================

export function jqueryStarRatingWatchers() {
	/* 1. Visualizing things on Hover - See next part for action on click */
	$('#ratingsRecipe li')
		.on('mouseover', function () {
			const onStar = parseInt($(this).data('value'), 10); // The star currently mouse on

			// Now highlight all the stars that's not after the current hovered star
			$(this)
				.parent()
				.children('li.star')
				.each(function (e) {
					if (e < onStar) {
						$(this).addClass('hover');
					} else {
						$(this).removeClass('hover');
					}
				});
		})
		.on('mouseout', function () {
			$(this)
				.parent()
				.children('li.star')
				.each(function (e) {
					$(this).removeClass('hover');
				});
		});

	/* 2. Action to perform on click */
	$('#ratingsRecipe li').on('click', function () {
		const onStar = parseInt($(this).data('value'), 10); // The star currently selected
		const stars = $(this)
			.parent()
			.children('li.star');
		let i;

		for (i = 0; i < stars.length; i++) {
			$(stars[i]).removeClass('selected');
		}

		for (i = 0; i < onStar; i++) {
			$(stars[i]).addClass('selected');
		}

		// JUST RESPONSE (Not needed)
		const ratingValue = parseInt(
			$('#ratingsRecipe li.selected')
				.last()
				.data('value'),
			10,
		);
		console.log(ratingValue);
	});
}
