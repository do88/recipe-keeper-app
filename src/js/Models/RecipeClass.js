// NOT USED
export default class Recipe {
	constructor(newID, timestamp) {
		this.title = '';
		this.id = newID;
		this.rating = '';
		this.cookingTime = '';
		this.creationTime = timestamp;
		this.mealType = '';
		this.ingredients = [];
		this.instructions = [];
	}

	report() {
		return this;
	}
}
