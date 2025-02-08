class CalorieTracker {
  constructor() {
    this._caloriesLimit = 2000;
    this._totalCalories = 0;
    this._meals = [];
    this._workout = [];
    this._displayCaloriesTotal();
    this._displayCaloriesLimit();
    this._displayCaloriesConsumed();
    this._displayCaloriesBurned();
    this._displayCaloriesRemaining();
    this._displayCaloriesProgress();
  }
  // Public Methods
  addMeal(meal) {
    this._meals.push(meal);
    this._totalCalories += meal.calories;
    this._render();
  }
  addWorkout(workout) {
    this._workout.push(workout);
    this._totalCalories -= workout.calories;
    this._render();
  }
  // private methods
  _displayCaloriesTotal() {
    const totalCaloriesEl = document.getElementById("calories-total");
    totalCaloriesEl.innerHTML = this._totalCalories;
  }
  _displayCaloriesLimit() {
    const caloriesLimitEl = document.getElementById("calories-limit");
    caloriesLimitEl.innerHTML = this._caloriesLimit;
  }
  _displayCaloriesConsumed() {
    const caloriesConsumedEl = document.getElementById("calories-consumed");
    const consumed = this._meals.reduce(
      (acc, item) => (acc += item.calories),
      0
    );
    caloriesConsumedEl.innerHTML = consumed;
  }
  _displayCaloriesBurned() {
    const caloriesBurnedEl = document.getElementById("calories-burned");
    const burned = this._workout.reduce(
      (acc, item) => (acc += item.calories),
      0
    );
    caloriesBurnedEl.innerHTML = burned;
  }
  _displayCaloriesRemaining() {
    const caloriesRemainingEl = document.getElementById("calories-remaining");
    const remaining = this._caloriesLimit - this._totalCalories;
    const progressEl = document.getElementById("calorie-progress");
    caloriesRemainingEl.innerHTML = remaining;
    if (remaining < 0) {
      caloriesRemainingEl.parentElement.parentElement.classList.remove(
        "bg-light"
      );
      progressEl.classList.remove("bg-success");
      progressEl.classList.add("bg-danger");
      caloriesRemainingEl.parentElement.parentElement.classList.add(
        "bg-danger"
      );
    } else {
      caloriesRemainingEl.parentElement.parentElement.classList.add("bg-light");
      progressEl.classList.add("bg-success");
      progressEl.classList.remove("bg-danger");
      caloriesRemainingEl.parentElement.parentElement.classList.remove(
        "bg-danger"
      );
    }
  }
  _displayCaloriesProgress() {
    const progressEl = document.getElementById("calorie-progress");
    const percent = (this._totalCalories / this._caloriesLimit) * 100;
    const width = Math.min(percent, 100);
    progressEl.style.width = `${width}%`;
  }
  _render() {
    this._displayCaloriesTotal();
    this._displayCaloriesConsumed();
    this._displayCaloriesBurned();
    this._displayCaloriesRemaining();
    this._displayCaloriesProgress();
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

class App {
  constructor() {
    this._tracker = new CalorieTracker();
    document
      .getElementById("meal-form")
      .addEventListener("submit", this._newMeal.bind(this));
    document
      .getElementById("workout-form")
      .addEventListener("submit", this._newWorkout.bind(this));
  }
  _newMeal(e) {
    e.preventDefault();
    const name = document.getElementById("meal-name");
    const calories = document.getElementById("meal-calories");
    // validation
    if (name.value === "" || calories.value === 0) {
      alert("please fill in all the fileds!");
      return;
    }
    const meal = new Meal(name.value, +calories.value);
    this._tracker.addMeal(meal);
    name.value = "";
    calories.value = "";
    const collapsMeal = document.getElementById("collapse-meal");
    const bscollapse = new bootstrap.Collapse(collapsMeal, {
      toggle: true,
    });
  }
  _newWorkout(e) {
    e.preventDefault();
    const name = document.getElementById("workout-name");
    const calories = document.getElementById("workout-calories");
    // validation
    if (name.value === "" || calories.value === 0) {
      alert("please fill in all the fileds!");
      return;
    }
    const workout = new Workout(name.value, +calories.value);
    this._tracker.addWorkout(workout);
    name.value = "";
    calories.value = "";
    const collapsWorkout = document.getElementById("collapse-workout");
    const bscollapse = new bootstrap.Collapse(collapsWorkout, {
      toggle: true,
    });
  }
}
const app = new App();
