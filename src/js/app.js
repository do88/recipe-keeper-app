import $ from 'jquery';
import saveStateToLocalStorage from './Models/SaveToLocal';
import createNewRecipe from './Models/NewRecipe';
import filterRecipesList from './Views/searchView';
import renderSingleRecipe from './Views/recipeView';
import { elements, jqueryStarRatingWatchers } from './Views/base';

//  ===========================================
//  App state
//  ===========================================

/** Global state of the app
 * - Individual recipe entries
	* - Title
	* - Unique ID
	* - Rating score
	* - Cooking time
	* - Creation time
	* - Meal type
	* - Ingredients list (array)
	* - Instructions (array)
 * - Shopping list on home page (array)
 */
const state = {
	recipeEntries: [
		{
			title: 'Jacket potatoes with tuna and spring onions',
			id: '01',
			rating: 3,
			cookingTime: 40,
			creationTime: 1557911957,
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
window.state = state; // Temp exposure of state object

//  ===========================================
//  Init functions - Get the ball rolling
//  ===========================================

$(document).ready(() => {
	if (window.location.pathname === '/') {
		// Clear the search input
		$(elements.recipeSearch).val('');
	} else {
		jqueryStarRatingWatchers();
		renderSingleRecipe();
	}
});

//  ===========================================
//  Home Search Functions
//  ===========================================

elements.recipeSearch.on('keyup', (e) => {
	const searchValue = e.target.value.toLowerCase();
	filterRecipesList(searchValue);
});

//  ===========================================
//  Add recipe
//  ===========================================

$('#addRecipe').on('click', () => {
	// Create new object
	const newRecipe = createNewRecipe();
	// push it to the state
	state.recipeEntries.push(newRecipe);
	// Save state to localStorage
	saveStateToLocalStorage(state);
	// redirect to new recipe page
	window.location.assign(`recipe.html#${newRecipe.id}`);
});

//  ===========================================
//  Add to shopping basket
//  ===========================================
