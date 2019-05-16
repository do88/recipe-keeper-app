/** Global state of the app model
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
 *
 */

// eslint-disable-next-line no-unused-vars
const state = {
	recipeEntries: [
		{
			title: 'Jacket potatoes with tuna and spring onions',
			id: 'b943440b-af1d-46e1-b9d9-8fd8ebd62fb7',
			rating: 3,
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

export function loadLocalStorage() {
	// Load state from localStorage
	const data = localStorage.getItem('state_LocalStorage');
	try {
		return data
			? JSON.parse(data)
			: {
				recipeEntries: [],
				shoppingList: [],
			};
	} catch (error) {
		return {};
	}
}

export function saveLocalStorage(data) {
	// Save state to localStorage
	localStorage.setItem('state_LocalStorage', JSON.stringify(data));
}
