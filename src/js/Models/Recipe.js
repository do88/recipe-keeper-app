import uuidv4 from 'uuid/v4';
import moment from 'moment';

// eslint-disable-next-line import/prefer-default-export
export function createNewRecipe() {
	// Set new ID to use in array and URL hash link
	const newID = uuidv4();
	// Get the current time and convert it to timestamp format to save into note
	const timestamp = moment().format();
	// Create new object with the values
	const newRecipe = {
		title: '',
		id: newID,
		rating: '',
		cookingTime: '',
		creationTime: timestamp,
		mealType: '',
		ingredients: [],
		instructions: [],
		report() {
			console.log(this);
		},
	};
	return newRecipe;
}
