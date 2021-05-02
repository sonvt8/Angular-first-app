import { Recipe} from "./recipe.model";
import {EventEmitter, Injectable} from "@angular/core";
import { Ingredient } from "../shared/ingredients.model";
import { ShoppingListService } from "../shopping-list/shopping-list.service";
import { Subject } from "rxjs";

@Injectable()
export class RecipeService {
    recipesChanged = new Subject<Recipe[]>();

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

    constructor(private slService: ShoppingListService) { }

    getRecipes() {
        return this.recipes.slice();
    }

    getRecipe(index: number) {
        return this.recipes[index];
    }

    addIngredientToShoppingList(ingredients: Ingredient[]){
        this.slService.addIngredients(ingredients);
    }

    addRecipe(recipe: Recipe){
        this.recipes.push(recipe);
        this.recipesChanged.next(this.recipes.slice());
    }

    updateRecipe(index: number, newRecipe: Recipe) {
        this.recipes[index] = newRecipe;
        this.recipesChanged.next(this.recipes.slice());
    }

    deleteRecipe(index: number) {
        this.recipes.splice(index, 1);
        this.recipesChanged.next(this.recipes.slice());
    }
}