/* eslint-disable no-unneeded-ternary */
import $ from 'jquery';
import CrossSVG from '../../img/Cross.svg';
import StarGreySVG from '../../img/StarGrey.svg';
import { elements, getCurrentRecipe } from './base';

// eslint-disable-next-line import/prefer-default-export
export function renderHomeView(currentState) {
	// Clear the search input
	$(elements.recipeSearch).val('');
	// Render the recipe articles
	renderRecipeArticles(currentState.recipeEntries);
	// Render the shopping basket
	// renderShoppingBasket(currentState.recipeEntries);
}

function renderRecipeArticles(entries) {
	entries.forEach((item) => {
		const cookingHours = `${Math.floor(item.cookingTime / 60)} h`;
		const cookingminutes = `${item.cookingTime % 60} min`;
		// const creationTime = item.creationTime;
		$(elements.recipeContainer).append(() => `
			<article class="recipe__entry ${item.id}">
				<div class="recipe__meta">
					<div class="recipe__rating">
						<span>Rating: </span>
						<ul id="ratingsHome">
							<li>
								<svg>
									<use href="${StarGreySVG}#StarGrey"></use>
								</svg>
							</li>
							<li>
								<svg>
									<use href="${StarGreySVG}#StarGrey"></use>
								</svg>
							</li>
							<li>
								<svg>
									<use href="${StarGreySVG}#StarGrey"></use>
								</svg>
							</li>
							<li>
								<svg>
									<use href="${StarGreySVG}#StarGrey"></use>
								</svg>
							</li>
							<li>
								<svg>
									<use href="${StarGreySVG}#StarGrey"></use>
								</svg>
							</li>
						</ul>

					</div>
					<div class="recipe__time">
						Cooking Time: <span> ${cookingHours ? cookingHours > 0 : ''} ${cookingminutes}min</span>
					</div>
					<div class="recipe__created">
						Created: <span>6 days ago</span>
					</div>
					<div class="recipe__type">
						<svg>
							<use href="/src/img/FishDish.svg#FishDish"></use>
						</svg>
					</div>
				</div>
				<div class="recipe__title">
					<a href="#">
						<h3>Jacket potatoes with tuna and spring onions</h3>
					</a>
				</div>
				<div class="recipe__list-button">
					<a href="#" class="inline-button inline-button--green">
						<svg>
							<use href="/src/img/PlusSymbol.svg#PlusSymbol"></use>
						</svg>
						Add to basket
					</a>
				</div>
			</article>
		`);
	});
}
