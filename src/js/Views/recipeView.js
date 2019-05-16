import $ from 'jquery';
import moment from 'moment';
import CrossSVG from '../../img/Cross.svg';
import { elements } from './base';

// Jacket potatoes with tuna and spring onions
// http://localhost:1234/recipe.html#b943440b-af1d-46e1-b9d9-8fd8ebd62fb7

export default function renderSingleRecipe(currentState) {
	const state = {
		recipeEntries: [
			{
				title: 'Jacket potatoes with tuna and spring onions',
				id: 'b943440b-af1d-46e1-b9d9-8fd8ebd62fb7',
				rating: 2,
				cookingTime: 40,
				creationTime: '2019-05-16T11:48:42+01:00',
				mealType: 'fishDish',
				ingredients: [
					{
						ingredientID: '01',
						text: 'Potatoes',
					},
					{
						ingredientID: '02',
						text: 'Tuna',
					},
					{
						ingredientID: '03',
						text: 'Spring Onions',
					},
					{
						ingredientID: '04',
						text: 'Mayo',
					},
				],
				instructions: [
					{
						instructionID: '01',
						text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae omnis quisquam laudantium eligendi alias facere eum odio aperiam dolores facilis sunt ipsam odit eos iure animi ut, repellat debitis quod',
					},
					{
						instructionID: '02',
						text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate dignissimos facilis necessitatibus dolorum, ratione repellendus.',
					},
					{
						instructionID: '03',
						text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam totam quas eum incidunt, et asperiores commodi unde! In, cupiditate reprehenderit.',
					},
				],
			},
		],
		shoppingList: ['Potatoes', 'Tuna', 'Spring Onions', 'Mayo'],
	};
	// Get the current recipe object
	const currentRecipe = getCurrentRecipe(state);
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

function getCurrentRecipe(state) {
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

function setIngredients(ingredients) {
	ingredients.forEach((item) => {
		$(elements.shoppingList).append(`
			<li class="${item.ingredientID}">${item.text}
				<a href="#" class="inline-button inline-button__delete delete_step">
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
		console.log(rating);
		const stars = $('li.star');
		let i;
		console.log(stars);
		for (i = 0; i < rating; i++) {
			$(stars[i]).addClass('selected');
		}
	}
}

function setCookingTime(time) {
	$(elements.cookingTime).val(time);
}

function setMealType(meal) {
	$(elements.mealType).find(`#${meal}`).attr('checked', true);
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
