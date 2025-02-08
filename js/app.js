class CalorieTracker {
  constructor() {
    this._caloriesLimit = Storage.getCaloriesLimit();
    this._totalCalories = Storage.getTotalCalories(0);
    this._meals = Storage.getMeals();
    this._workout = Storage.getWorkout();
    this._displayCaloriesTotal();
    this._displayCaloriesLimit();
    this._displayCaloriesConsumed();
    this._displayCaloriesBurned();
    this._displayCaloriesRemaining();
    this._displayCaloriesProgress();
    document.getElementById("limit").value = this._caloriesLimit;
  }
  loadItems() {
    this._meals.forEach((item) => {
      this._displayNewMeal(item);
    });
    this._workout.forEach((item) => {
      this._displayNewWorkout(item);
    });
  }
  // Public Methods
  addMeal(meal) {
    this._meals.push(meal);
    this._totalCalories += meal.calories;
    Storage.updateTotalCalories(this._totalCalories);
    Storage.saveMeals(meal);
    this._displayNewMeal(meal);
    this._render();
  }
  addWorkout(workout) {
    this._workout.push(workout);
    this._totalCalories -= workout.calories;
    Storage.updateTotalCalories(this._totalCalories);
    Storage.saveWorkout(workout);
    this._displayNewWorkout(workout);
    this._render();
  }
  removeMeal(id) {
    const index = this._meals.findIndex((meal) => meal.id === id);
    if (index != -1) {
      const meal = this._meals[index];
      this._totalCalories -= meal.calories;
      Storage.updateTotalCalories(this._totalCalories);
      this._meals.splice(index, 1);
      Storage.removeMeal(id);
      this._render();
    }
  }
  removeWorkout(id) {
    const index = this._workout.findIndex((work) => work.id === id);
    const work = this._workout[index];
    this._totalCalories += work.calories;
    Storage.updateTotalCalories(this._totalCalories);
    this._workout.splice(index, 1);
    Storage.removeWorkout(id);
    this._render();
  }
  reset() {
    Storage.clearAll();
    this._totalCalories = 0;
    this._meals = [];
    this._workout = [];
    this._render();
  }
  setLimit(calorieLimit) {
    Storage.setCaloriesLimit(calorieLimit);
    this._caloriesLimit = calorieLimit;
    this._displayCaloriesLimit();
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
  _displayNewMeal(meal) {
    const mealsEl = document.getElementById("meal-items");
    const mealEl = document.createElement("div");
    mealEl.classList.add("my-2", "card");
    mealEl.setAttribute("data-id", meal.id);
    mealEl.innerHTML = `
        <div class="card-body">
                <div class="d-flex align-items-center justify-content-between">
                  <h4 class="mx-1">${meal.name}</h4>
                  <div
                    class="fs-1 bg-primary text-white text-center rounded-2 px-2 px-sm-5"
                  >
                    ${meal.calories}
                  </div>
                  <button class="delete btn btn-danger btn-sm mx-2">
                    <i class="fa-solid fa-xmark"></i>
                  </button>
                </div>
         </div>
    `;
    mealsEl.appendChild(mealEl);
  }
  _displayNewWorkout(workout) {
    const workoutsEl = document.getElementById("workout-items");
    const workouEl = document.createElement("div");
    workouEl.classList.add("my-2", "card");
    workouEl.setAttribute("data-id", workout.id);
    workouEl.innerHTML = `
        <div class="card-body">
                <div class="d-flex align-items-center justify-content-between">
                  <h4 class="mx-1">${workout.name}</h4>
                  <div
                    class="fs-1 bg-secondary text-white text-center rounded-2 px-2 px-sm-5"
                  >
                    ${workout.calories}
                  </div>
                  <button class="delete btn btn-danger btn-sm mx-2">
                    <i class="fa-solid fa-xmark"></i>
                  </button>
                </div>
         </div>
    `;
    workoutsEl.appendChild(workouEl);
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

class Storage {
  static getCaloriesLimit(defaultLimit = 2000) {
    let caloriesLimit;
    if (localStorage.getItem("caloriesLimit") === null) {
      caloriesLimit = defaultLimit;
    } else {
      caloriesLimit = +localStorage.getItem("caloriesLimit");
    }
    return caloriesLimit;
  }
  static setCaloriesLimit(caloriesLimit) {
    localStorage.setItem("caloriesLimit", caloriesLimit);
  }
  static getTotalCalories(defaultCalories = 0) {
    let totoalCalories;
    if (localStorage.getItem("totoalCalories") === null) {
      totoalCalories = defaultCalories;
    } else {
      totoalCalories = +localStorage.getItem("totoalCalories");
    }
    return totoalCalories;
  }
  static updateTotalCalories(calories) {
    localStorage.setItem("totoalCalories", calories);
  }
  static getMeals() {
    let meals;
    if (localStorage.getItem("meals") === null) {
      meals = [];
    } else {
      meals = JSON.parse(localStorage.getItem("meals"));
    }
    return meals;
  }
  static saveMeals(meal) {
    let meals;
    if (localStorage.getItem("meals") === null) {
      meals = [];
    } else {
      meals = JSON.parse(localStorage.getItem("meals"));
    }
    meals.push(meal);
    localStorage.setItem("meals", JSON.stringify(meals));
  }
  static removeMeal(id) {
    const meals = Storage.getMeals();
    meals.forEach((item, index) => {
      if (item.id === id) {
        meals.splice(index, 1);
      }
    });
    localStorage.setItem("meals", JSON.stringify(meals));
  }
  static getWorkout() {
    let workouts;
    if (localStorage.getItem("workouts") === null) {
      workouts = [];
    } else {
      workouts = JSON.parse(localStorage.getItem("workouts"));
    }
    return workouts;
  }
  static saveWorkout(workout) {
    let workouts;
    if (localStorage.getItem("workouts") === null) {
      workouts = [];
    } else {
      workouts = JSON.parse(localStorage.getItem("workouts"));
    }
    workouts.push(workout);
    localStorage.setItem("workouts", JSON.stringify(workouts));
  }
  static removeWorkout(id) {
    const workouts = Storage.getWorkout();
    workouts.forEach((item, index) => {
      if (item.id === id) {
        workouts.splice(index, 1);
      }
    });
    localStorage.setItem("workouts", JSON.stringify(workouts));
  }
  static clearAll() {
    localStorage.removeItem("totalcalories");
    localStorage.removeItem("meals");
    localStorage.removeItem("workouts");
    localStorage.removeItem("totoalCalories");
  }
}

class App {
  constructor() {
    this._tracker = new CalorieTracker();
    this._loadEventListners();
    this._tracker.loadItems();
  }
  _loadEventListners() {
    document
      .getElementById("meal-form")
      .addEventListener("submit", this._newItem.bind(this, "meal"));
    document
      .getElementById("workout-form")
      .addEventListener("submit", this._newItem.bind(this, "workout"));
    document
      .getElementById("meal-items")
      .addEventListener("click", this._removeItem.bind(this, "meal"));
    document
      .getElementById("workout-items")
      .addEventListener("click", this._removeItem.bind(this, "workout"));
    document
      .getElementById("filter-meals")
      .addEventListener("keyup", this._filterItems.bind(this, "meal"));
    document
      .getElementById("filter-workouts")
      .addEventListener("keyup", this._filterItems.bind(this, "workout"));
    document
      .getElementById("reset")
      .addEventListener("click", this._reset.bind(this));
    document
      .getElementById("limit-form")
      .addEventListener("submit", this._setLimit.bind(this));
  }
  _newItem(type, e) {
    e.preventDefault();
    const name = document.getElementById(`${type}-name`);
    const calories = document.getElementById(`${type}-calories`);
    // validation
    if (name.value === "" || calories.value === 0) {
      alert("please fill in all the fileds!");
      return;
    }
    if (type === "meal") {
      const meal = new Meal(name.value, +calories.value);
      this._tracker.addMeal(meal);
    } else {
      const workout = new Workout(name.value, +calories.value);
      this._tracker.addWorkout(workout);
    }
    name.value = "";
    calories.value = "";
    const collapsItem = document.getElementById(`collapse-${type}`);
    const bscollapse = new bootstrap.Collapse(collapsItem, {
      toggle: true,
    });
  }
  _removeItem(type, e) {
    if (
      e.target.classList.contains("delete") ||
      e.target.classList.contains("fa-xmark")
    ) {
      if (confirm("Are you sure?")) {
        const id = e.target.closest(".card").getAttribute("data-id");
        type === "meal"
          ? this._tracker.removeMeal(id)
          : this._tracker.removeWorkout(id);
        e.target.closest(".card").remove();
      }
    }
  }
  _filterItems(type, e) {
    const text = e.target.value.toLowerCase();
    document.querySelectorAll(`#${type}-items .card`).forEach((item) => {
      const name =
        item.firstElementChild.firstElementChild.textContent.toLocaleLowerCase();
      if (name.indexOf(text) !== -1) {
        item.style.display = "block";
      } else {
        item.style.display = "none";
      }
    });
  }
  _reset() {
    this._tracker.reset();
    document.getElementById("meal-items").innerHTML = "";
    document.getElementById("workout-items").innerHTML = "";
    document.getElementById("filter-meals").value = "";
    document.getElementById("filter-workouts").value = "";
  }
  _setLimit(e) {
    e.preventDefault();
    const limit = document.getElementById("limit");
    if (limit.value === "") {
      alert("please add a limit");
      return;
    }
    this._tracker.setLimit(+limit.value);
    limit.value = "";
    const modalEl = document.getElementById("limit-modal");
    const modal = bootstrap.Modal.getInstance(modalEl);
    modal.hide();
  }
}
const app = new App();
