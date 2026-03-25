let meals = [];
let dailyGoal = 2000;

document.addEventListener('DOMContentLoaded', function() {
    loadFromLocalStorage();
    updateDisplay();
    displayCurrentDate();

    const mealForm = document.getElementById('mealForm');
    const foodImageInput = document.getElementById('foodImage');
    const imagePreview = document.getElementById('imagePreview');

    mealForm.addEventListener('submit', handleFormSubmit);
    foodImageInput.addEventListener('change', handleImagePreview);
});

function displayCurrentDate() {
    const dateElement = document.getElementById('currentDate');
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateElement.textContent = today.toLocaleDateString('en-US', options);
}

function handleImagePreview(event) {
    const file = event.target.files[0];
    const imagePreview = document.getElementById('imagePreview');

    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imagePreview.innerHTML = `<img src="${e.target.result}" alt="Food preview">`;
            imagePreview.classList.add('show');
        };
        reader.readAsDataURL(file);
    } else {
        imagePreview.innerHTML = '';
        imagePreview.classList.remove('show');
    }
}

function handleFormSubmit(event) {
    event.preventDefault();

    const mealName = document.getElementById('mealName').value;
    const foodItem = document.getElementById('foodItem').value;
    const calories = parseInt(document.getElementById('calories').value);
    const foodImageInput = document.getElementById('foodImage');
    const imagePreview = document.getElementById('imagePreview');

    const meal = {
        id: Date.now(),
        mealName: mealName,
        foodItem: foodItem,
        calories: calories,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        image: null
    };

    if (foodImageInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            meal.image = e.target.result;
            addMealToList(meal);
        };
        reader.readAsDataURL(foodImageInput.files[0]);
    } else {
        addMealToList(meal);
    }

    event.target.reset();
    imagePreview.innerHTML = '';
    imagePreview.classList.remove('show');
}

function addMealToList(meal) {
    meals.push(meal);
    saveToLocalStorage();
    updateDisplay();
}

function deleteMeal(mealId) {
    meals = meals.filter(meal => meal.id !== mealId);
    saveToLocalStorage();
    updateDisplay();
}

function updateDisplay() {
    updateSummary();
    displayMeals();
}

function updateSummary() {
    const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);
    const totalMeals = meals.length;

    document.getElementById('totalCalories').textContent = totalCalories;
    document.getElementById('totalMeals').textContent = totalMeals;
    document.getElementById('dailyGoal').textContent = dailyGoal;
}

function displayMeals() {
    const mealsList = document.getElementById('mealsList');

    if (meals.length === 0) {
        mealsList.innerHTML = '<p class="empty-message">No meals logged yet. Add your first meal above!</p>';
        return;
    }

    mealsList.innerHTML = meals.map(meal => {
        const imageHTML = meal.image
            ? `<img src="${meal.image}" alt="${meal.foodItem}" class="meal-image">`
            : `<div class="meal-image placeholder">🍽️</div>`;

        return `
            <div class="meal-card">
                ${imageHTML}
                <div class="meal-info">
                    <div class="meal-name">${meal.mealName}</div>
                    <div class="food-item">${meal.foodItem}</div>
                    <div class="meal-time">${meal.time}</div>
                </div>
                <div class="meal-calories">${meal.calories} cal</div>
                <button class="btn-delete" onclick="deleteMeal(${meal.id})">Delete</button>
            </div>
        `;
    }).join('');
}

function saveToLocalStorage() {
    const today = new Date().toDateString();
    localStorage.setItem('calorieTrackerDate', today);
    localStorage.setItem('calorieTrackerMeals', JSON.stringify(meals));
}

function loadFromLocalStorage() {
    const savedDate = localStorage.getItem('calorieTrackerDate');
    const today = new Date().toDateString();

    if (savedDate === today) {
        const savedMeals = localStorage.getItem('calorieTrackerMeals');
        if (savedMeals) {
            meals = JSON.parse(savedMeals);
        }
    } else {
        meals = [];
        localStorage.removeItem('calorieTrackerMeals');
        localStorage.removeItem('calorieTrackerDate');
    }
}
