import $ from 'jquery';
import moment from 'moment';
import CrossSVG from '../../img/Cross.svg';
import PlusSymbolSVG from '../../img/PlusSymbol.svg';
import StarGreySVG from '../../img/StarGrey.svg';
import FishDishSVG from '../../img/FishDish.svg';
import MeatDishSVG from '../../img/MeatDish.svg';
import VegDishSVG from '../../img/VegDish.svg';
import { elements } from './base';

// eslint-disable-next-line import/prefer-default-export
export function renderHomeView(currentState) {
	// Clear the search input
	$(elements.recipeSearch).val('');
	// Render the shopping basket
	renderShoppingBasket(currentState.shoppingList);
	// Render the recipe articles
	renderRecipeArticles(currentState.recipeEntries);
}

export function renderShoppingBasket(basketItems) {
	// Sort array alphabetically
	const sortedItems = basketItems.sort((a, b) => (a.text.toUpperCase() > b.text.toUpperCase() ? 1 : -1));
	// Clear HTML
	$(elements.shoppingList).html('');
	// Add items in the HTML elements
	sortedItems.forEach((item) => {
		$(elements.shoppingList).append(`
			<li id="${item.ingredientID}">${item.text}
				<a href="#" class="inline-button inline-button--delete delete-ingredient">
					<svg>
						<use href="${CrossSVG}#Cross"></use>
					</svg>Delete
				</a>
			</li>
		`);
	});
}

// Function to set rating
function setRating(rating, id) {
	if (rating) {
		const stars = $(`#${id} li.star`);
		for (let i = 0; i < rating; i++) {
			$(stars[i]).addClass('selected');
		}
	}
}

// Function to find meal type
function mealType(type) {
	let result;
	if (type === 'fishDish') {
		result = {
			link: FishDishSVG,
			id: 'FishDish',
		};
	} else if (type === 'meatDish') {
		result = {
			link: MeatDishSVG,
			id: 'MeatDish',
		};
	} else if (type === 'vegDish') {
		result = {
			link: VegDishSVG,
			id: 'VegDish',
		};
	} else {
		result = '';
	}
	return result;
}

function renderRecipeArticles(entries) {
	entries.forEach((item) => {
		// calculate cooking times from minutes
		const cookingHours = Math.floor(item.cookingTime / 60);
		const cookingMinutes = item.cookingTime % 60;

		// Format creation time
		const creationTime = moment(item.creationTime).fromNow();

		// Get the mealType
		const mealClass = mealType(item.mealType);

		// Render HTML
		$(elements.recipeContainer).append(() => `
			<article class="recipe__entry" id="${item.id}">
				<div class="recipe__meta">
					<div class="recipe__rating">
						<span>Rating: </span>
						<ul id="ratingsHome">
							<li class="star" data-value="1">
								<svg>
									<use href="${StarGreySVG}#StarGrey"></use>
								</svg>
							</li>
							<li class="star" data-value="2">
								<svg>
									<use href="${StarGreySVG}#StarGrey"></use>
								</svg>
							</li>
							<li class="star" data-value="3">
								<svg>
									<use href="${StarGreySVG}#StarGrey"></use>
								</svg>
							</li>
							<li class="star" data-value="4">
								<svg>
									<use href="${StarGreySVG}#StarGrey"></use>
								</svg>
							</li>
							<li class="star" data-value="5">
								<svg>
									<use href="${StarGreySVG}#StarGrey"></use>
								</svg>
							</li>
						</ul>

					</div>
					<div class="recipe__time">
						Cooking Time: <span> ${cookingHours > 0 ? `${cookingHours}h` : ''} ${cookingMinutes > 0 ? `${cookingMinutes}min` : ''}</span>
					</div>
					<div class="recipe__created">
						Created: <span>${creationTime}</span>
					</div>
					<div class="recipe__type ${mealClass.id}">
						<svg>
							<use href="${`${mealClass.link}#${mealClass.id}`}"></use>
						</svg>
					</div>
				</div>
				<div class="recipe__title">
					<h3><a href="/recipe.html#${item.id}">${item.title}</a></h3>
				</div>
				<div class="recipe__list-button">
					<a href="#" class="inline-button inline-button--green addToBasket">
						<svg>
							<use href="${PlusSymbolSVG}#PlusSymbol"></use>
						</svg>
						Add to basket
					</a>
				</div>
			</article>
		`);
		// Set rating for stars
		setRating(item.rating, item.id);
	});
}
