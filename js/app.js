class CalorieTracker {
  constructor() {
    this._calorieLimit = 200;
    this._totalCalories = 0;
    this._meals = [];
    this._workout = [];
  }
  addMeal(meal) {
    this._meals.push(meal);
    this._totalCalories += meal.calories;
  }
  addWorkout(workout) {
    this._workout.push(workout);
    this._totalCalories -= workout.calories;
  }
}
class Meal {
  constructor(name, calories) {
    this.id = Math.random().toString(16).slice(2);
    this.name = name;
    this.calories = calories;
  }
}
class Workout {
  constructor(name, calories) {
    this.id = Math.random().toString(16).slice(2);
    this.name = name;
    this.calories = calories;
  }
}
const tracker = new CalorieTracker();

const breakfast = new Meal("breakfast", 200);
const food = new Meal("food", 300);
const workout = new Workout("run", 400);

tracker.addMeal(breakfast);
tracker.addMeal(food);
tracker.addWorkout(workout);
