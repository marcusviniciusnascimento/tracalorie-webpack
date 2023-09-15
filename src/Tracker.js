import Storage from './Storage';

class CalorieTracker {
    constructor() {
        this._calorieLimit = Storage.getCalorieLimit(2000);
        this._totalCalories = Storage.getTotalCalories(0);
        this._meals = Storage.getMeals();
        this._workouts = Storage.getWorkouts();
        this._displayCaloriesTotal();
        this._displayCaloriesLimit();
        this._displayCaloriesConsumed();
        this._displayCaloriesBurned();
        this._displayCaloriesRemaining();
        this._displayCaloriesProgress();

        document.getElementById('limit').value = this._calorieLimit;
    }

    addMeal(meal) {
        this._meals.push(meal);
        this._totalCalories += meal.calories;
        Storage.updateTotalCalories(this._totalCalories);
        Storage.saveMeal(meal);
        this._displayNewMeal(meal);
        this._render();
    };

    removeMeal(id) {
        const index = this._meals.findIndex((meal) => meal.id === id);
        if (index > -1) {
            const meal = this._meals[index];
            this._totalCalories -= meal.calories;
            Storage.updateTotalCalories(this._totalCalories);
            this._meals.splice(index, 1);
            // remove from storage
            Storage.removeMeal(id);
            this._render();
        }
    }

    addWorkout(workout) {
        this._workouts.push(workout);
        this._totalCalories -= workout.calories;
        Storage.updateTotalCalories(this._totalCalories);
        Storage.saveWorkout(workout);
        this._displayNewWorkout(workout);
        this._render();
    };

    removeWorkout(id) {
        const index = this._workouts.findIndex((workout) => workout.id === id);
        if (index > -1) {
            const workout = this._workouts[index];
            this._totalCalories += workout.calories;
            Storage.updateTotalCalories(this._totalCalories);
            this._workouts.splice(index, 1);
            Storage.removeWorkout(id);
            this._render();
        }
    }

    reset() {
        this._totalCalories = 0;
        this._meals = [];
        this._workouts = [];
        Storage.clearAll();
        this._render();
    }

    setLimit(calorieLimit) {
        this._calorieLimit = calorieLimit;
        Storage.setCalorieLimit(calorieLimit);
        this._displayCaloriesLimit();
        this._render();
    }

    loadItems() {
        this._meals.forEach((meal) => this._displayNewMeal(meal));
        this._workouts.forEach((workout) => this._displayNewWorkout(workout));
    }

    // Private methods
    _displayCaloriesTotal() {
        const totalCaloriesEl = document.getElementById('calories-total');
        totalCaloriesEl.innerHTML = this._totalCalories;
    };
    _displayCaloriesLimit() {
        const calorieLimitEl = document.getElementById('calories-limit');
        calorieLimitEl.innerHTML = this._calorieLimit;
    };
    _displayCaloriesConsumed() {
        const calorieConsumedEl = document.getElementById('calories-consumed');
        const consumed = this._meals.reduce((total, meal) => total + meal.calories, 0);
        calorieConsumedEl.innerHTML = consumed;
    };
    _displayCaloriesBurned() {
        const calorieBurnedEl = document.getElementById('calories-burned');
        const burned = this._workouts.reduce((total, workout) => total + workout.calories, 0);
        calorieBurnedEl.innerHTML = burned;
    };
    _displayCaloriesRemaining() {
        const calorieRemainingEl = document.getElementById('calories-remaining');
        const remaining = this._calorieLimit - this._totalCalories;
        const progressEl = document.getElementById('calorie-progress');
        calorieRemainingEl.innerHTML = remaining;

        if (remaining <= 0){
            calorieRemainingEl.parentElement.parentElement.classList.remove('bg-light');
            calorieRemainingEl.parentElement.parentElement.classList.add('bg-danger');
            progressEl.classList.remove('bg-success');
            progressEl.classList.add('bg-danger');
        }else {
            calorieRemainingEl.parentElement.parentElement.classList.add('bg-light');
            calorieRemainingEl.parentElement.parentElement.classList.remove('bg-danger');
            progressEl.classList.remove('bg-danger');
            progressEl.classList.add('bg-success');

        }
    };

    _displayCaloriesProgress() {
        console.log("_displayCaloriesProgress()");
        const progressEl = document.getElementById('calorie-progress');
        const percentage = (this._totalCalories / this._calorieLimit) * 100;
        const width = Math.min(percentage, 100);
        progressEl.style.width = `${width}%`;
    }

    _displayNewMeal(meal) {
        const mealsEl = document.getElementById('meal-items');
        const mealEl = document.createElement('div');

        mealEl.classList.add('card', 'my-2');
        // we will need this value later, when trying to remove an item.
        mealEl.setAttribute('data-id', meal.id);
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
        `
        mealsEl.appendChild(mealEl);
    }

    _displayNewWorkout(workout) {
        const workoutsEl = document.getElementById('workout-items');
        const workoutEl = document.createElement('div');

        workoutEl.classList.add('card', 'my-2');
        // we will need this value later, when trying to remove an item.
        workoutEl.setAttribute('data-id', workout.id);
        workoutEl.innerHTML = `
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
        `
        workoutsEl.appendChild(workoutEl);

    }

    _render() {
        this._displayCaloriesTotal();
        this._displayCaloriesConsumed();
        this._displayCaloriesBurned();
        this._displayCaloriesRemaining();
        this._displayCaloriesProgress();
    }
};

export default CalorieTracker;