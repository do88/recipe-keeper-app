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

import { preFilledStated } from './DummyStateData';

export function loadData() {
	// Load state from localStorage
	const data = localStorage.getItem('state_LocalStorage');
	try {
		return data
			? JSON.parse(data)
			: preFilledStated;
	} catch (error) {
		return {};
	}
}

export function saveData(data) {
	// Save state to localStorage
	localStorage.setItem('state_LocalStorage', JSON.stringify(data));
}
