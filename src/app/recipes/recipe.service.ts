import { Recipe} from "./recipe.model";
import {EventEmitter} from "@angular/core";

export class RecipeService {
    recipeSelected = new EventEmitter<Recipe>();

    private recipes: Recipe[] = [
        new Recipe('A Test Recipe', 'This is simply a test', 'https://i2.wp.com/www.downshiftology.com/wp-content/uploads/2015/11/shakshuka-11.jpg'),
        new Recipe('A New Test Recipe', 'This is simply a test', 'https://i2.wp.com/www.downshiftology.com/wp-content/uploads/2015/11/shakshuka-11.jpg')
    ];

    getRecipes() {
        return this.recipes.slice();
    }
}