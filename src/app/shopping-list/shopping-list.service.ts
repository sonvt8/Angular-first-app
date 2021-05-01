import { Ingredient } from '../shared/ingredients.model';
import {EventEmitter} from "@angular/core";
import { Subject } from 'rxjs';

export class ShoppingListService {
    ingredientsChanged= new Subject<Ingredient[]>();
    startedEditing = new Subject<number>(); 

    private ingredients: Ingredient[] = [
        new Ingredient('Apple', 5),
        new Ingredient('Eggs', 4),
    ];

    getIngredients() {
        return this.ingredients.slice();
    }

    addIngredient(ingredient: Ingredient){
        this.ingredients.push(ingredient);
        this.ingredientsChanged.next(this.ingredients.slice())
    }

    addIngredients(ingredients: Ingredient[]) {
        // for (let ingredient of ingredients) {
        //     this.addIngredient(ingredient);
        // }
        this.ingredients.push(...ingredients);
        this.ingredientsChanged.next(this.ingredients.slice())
    }
}