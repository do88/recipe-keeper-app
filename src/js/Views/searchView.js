/* eslint-disable no-param-reassign */
import $ from 'jquery';
import { elements } from './base';

export default function filterRecipesList(searchText) {
	// Get all the recipe entries
	// const entryArray = elements.recipeEntry.toArray();
	const entryArray = elements.recipeContainer.find('.recipe__entry').toArray();
	// Array counter to check each entry
	let numberOfEntries = 0;

	// Loop through each title to see if it matches the value
	entryArray.forEach((item) => {
		const recipeTitle = $(item).find('.recipe__title')
			.text()
			.toLowerCase()
			.trim();
		if (recipeTitle.includes(searchText)) {
			$(item).show();
			elements.searchMessage.html('');
		} else {
			$(item).hide();
			numberOfEntries += 1;
		}
	});

	// If there are no matches for any entries display message
	if (numberOfEntries === entryArray.length) {
		elements.searchMessage.html('😔 Sorry there are no results for this search... ');
	}
}
