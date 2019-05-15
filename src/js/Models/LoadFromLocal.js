export default function loadStateToLocalStorage() {
	// Load state from localStorage
	const recipeJSON = localStorage.getItem('state_LocalStorage');
	// Return the parsed array
	return JSON.parse(recipeJSON);
}
