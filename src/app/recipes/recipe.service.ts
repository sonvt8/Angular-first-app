import { Recipe} from "./recipe.model";
import {EventEmitter} from "@angular/core";
import { Ingredient } from "../shared/ingredients.model";

export class RecipeService {
    recipeSelected = new EventEmitter<Recipe>();

    private recipes: Recipe[] = [
        new Recipe('A Test Recipe',
                   'This is simply a test',
                   'https://i2.wp.com/www.downshiftology.com/wp-content/uploads/2015/11/shakshuka-11.jpg',
                   [
                       new Ingredient('Egg', 3),
                       new Ingredient('Meat', 2)
                   ]),
                   new Recipe('Pizza',
                   'This is simply a test',
                   'https://www.simplyrecipes.com/thmb/TVKI0ehadvD2pvN7utnKR4gPPQk=/960x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/Simply-Recipes-Quesadilla-LEAD-1-b8e325610a7c46e1b6b6c2208d7ed4ee.jpg',
                   [
                        new Ingredient('Bread', 1),
                        new Ingredient('Meat', 2),
                        new Ingredient('French Fries', 30)
                   ]),
    ];

    getRecipes() {
        return this.recipes.slice();
    }
}