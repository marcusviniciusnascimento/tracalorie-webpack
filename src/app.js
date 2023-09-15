import '@fortawesome/fontawesome-free/js/all';
import { Modal, Collapse } from 'bootstrap';
import CalorieTracker from './Tracker.js';
import { Meal, Workout } from './Item.js';

import './css/bootstrap.css';
import './css/style.css';



class App {
    constructor() {
        this._tracker = new CalorieTracker();
        this._loadEventListeners();
        this._tracker.loadItems();
    }

    _loadEventListeners() {
        document
        .getElementById('meal-form')
        .addEventListener('submit', this._newItem.bind(this, 'meal'));

        document
        .getElementById('workout-form')
        .addEventListener('submit', this._newItem.bind(this, 'workout'));

        document.getElementById('meal-items')
        .addEventListener('click', this._removeItem.bind(this, 'meal'));

        document.getElementById('workout-items')
        .addEventListener('click', this._removeItem.bind(this, 'workout'));

        document.getElementById('filter-meals')
        .addEventListener('keyup', this._filterItems.bind(this, 'meal'));

        document.getElementById('filter-workouts')
        .addEventListener('keyup', this._filterItems.bind(this, 'workout'));

        document.getElementById('reset')
        .addEventListener('click', this._reset.bind(this));

        document.getElementById('limit-form')
        .addEventListener('submit', this._setLimit.bind(this));
    }

    _newItem(type, e) {
        e.preventDefault();
        const name = document.getElementById(`${type}-name`);
        const calories = document.getElementById(`${type}-calories`);

        //Validate inputs
        if ((name.value === '') || (+calories.value === '')) {
            alert('please fill in all fields');
            return;
        } 

        if (type === 'meal') {
            const meal = new Meal(name.value, +calories.value);
            this._tracker.addMeal(meal);
        } else {
            const workout = new Workout(name.value, +calories.value);
            this._tracker.addWorkout(workout);
        }
        name.value = '';
        calories.value = '';

        //close the collapse
        const collapse = document.getElementById(`collapse-${type}`);
        const bsCollapse = new Collapse(collapse, { toggle: true });
    }

    _removeItem(type, e) {
        if(e.target.classList.contains('delete') || e.target.classList.contains('fa-xmark')) {
            if (confirm('Sure?')) {
                const id = e.target.closest('.card').getAttribute('data-id');
                type === 'meal' ? this._tracker.removeMeal(id) : this._tracker.removeWorkout(id);
                e.target.closest('.card').remove();
            }
        }
    }

    _filterItems(type, e) {
        const text = e.target.value.toLowerCase();
        const items = document.querySelectorAll(`#${type}-items .card`);
        console.log(items);
        items.forEach((element) => {
            const elementText = element.querySelector('.mx-1').innerText.toLowerCase();
            if (elementText.indexOf(text) > -1) {
                element.style.display = 'block';
            } else {
                element.style.display = 'none';
            }
        });
    }

    _reset() {
        this._tracker.reset();
        document.getElementById('meal-items').innerHTML = '';
        document.getElementById('workout-items').innerHTML = '';
        document.getElementById('workout-items').innerHTML = '';
        document.getElementById('filter-meals').value = '';
        document.getElementById('filter-workouts').value = '';
    }

    _setLimit(e) {
        e.preventDefault();

        const limit = document.getElementById('limit');

        if (limit.value === '') {
            alert('please add a limit');
            return;
        }

        this._tracker.setLimit(+limit.value);
        limit.value = '';

        const modalEl = document.getElementById('limit-modal');
        const modal = Modal.getInstance(modalEl);
        modal.hide();
    }
}

const app = new App();

// const tracker = new CalorieTracker();
// const breakfast = new Meal('Breakfast', 400);
// const lunch = new Meal('Lunch', 750);
// tracker.addMeal(breakfast);
// tracker.addMeal(lunch);

// const run = new Workout('Morning run', 320);

// tracker.addWorkout(run);

// console.log(tracker._meals);
// console.log(tracker._workouts);
// console.log(tracker._totalCalories);
