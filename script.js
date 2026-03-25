let meals = [];
let dailyGoal = 2000;
let debounceTimer;
let currentCalorieSuggestion = null;

const USDA_API_KEY = 'DEMO_KEY';
const USDA_API_BASE = 'https://api.nal.usda.gov/fdc/v1';

document.addEventListener('DOMContentLoaded', function() {
    loadFromLocalStorage();
    updateDisplay();
    displayCurrentDate();

    const mealForm = document.getElementById('mealForm');
    const foodImageInput = document.getElementById('foodImage');
    const imagePreview = document.getElementById('imagePreview');
    const foodItemInput = document.getElementById('foodItem');

    mealForm.addEventListener('submit', handleFormSubmit);
    foodImageInput.addEventListener('change', handleImagePreview);
    foodItemInput.addEventListener('input', handleFoodItemInput);

    document.addEventListener('click', function(e) {
        if (!e.target.closest('.autocomplete-suggestions')) {
            hideAutocompleteSuggestions();
        }
    });
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
            analyzeImageForCalories(e.target.result);
        };
        reader.readAsDataURL(file);
    } else {
        imagePreview.innerHTML = '';
        imagePreview.classList.remove('show');
    }
}

function handleFoodItemInput(event) {
    const query = event.target.value.trim();

    clearTimeout(debounceTimer);

    if (query.length < 2) {
        hideAutocompleteSuggestions();
        return;
    }

    showLoadingStatus();

    debounceTimer = setTimeout(() => {
        searchFoodDatabase(query);
    }, 500);
}

function showLoadingStatus() {
    const statusElement = document.getElementById('calorieStatus');
    statusElement.innerHTML = '<span class="analyzing-badge"><span class="loading-spinner"></span> Searching...</span>';
}

function hideLoadingStatus() {
    const statusElement = document.getElementById('calorieStatus');
    statusElement.innerHTML = '';
}

async function searchFoodDatabase(query) {
    try {
        const response = await fetch(
            `${USDA_API_BASE}/foods/search?api_key=${USDA_API_KEY}&query=${encodeURIComponent(query)}&pageSize=5`
        );

        if (!response.ok) {
            throw new Error('API request failed');
        }

        const data = await response.json();
        displayAutocompleteSuggestions(data.foods || []);
        hideLoadingStatus();
    } catch (error) {
        console.error('Error fetching food data:', error);
        hideLoadingStatus();
        fallbackToLocalDatabase(query);
    }
}

function fallbackToLocalDatabase(query) {
    const localFoodDatabase = {
        'apple': 95,
        'banana': 105,
        'chicken breast': 165,
        'rice': 206,
        'pasta': 220,
        'pizza': 285,
        'salad': 50,
        'sandwich': 300,
        'burger': 540,
        'fries': 365,
        'orange': 62,
        'egg': 78,
        'milk': 149,
        'bread': 79,
        'cheese': 113,
        'yogurt': 100,
        'salmon': 206,
        'steak': 271,
        'broccoli': 55,
        'carrot': 41
    };

    const suggestions = Object.entries(localFoodDatabase)
        .filter(([food]) => food.toLowerCase().includes(query.toLowerCase()))
        .map(([food, calories]) => ({
            description: food.charAt(0).toUpperCase() + food.slice(1),
            calories: calories
        }));

    displayAutocompleteSuggestions(suggestions.map(s => ({
        description: s.description,
        foodNutrients: [{ nutrientName: 'Energy', value: s.calories }]
    })));
}

function displayAutocompleteSuggestions(foods) {
    const suggestionsDiv = document.getElementById('autocompleteSuggestions');

    if (!foods || foods.length === 0) {
        hideAutocompleteSuggestions();
        return;
    }

    const suggestionsHTML = foods.slice(0, 5).map(food => {
        const calories = getCaloriesFromFood(food);
        return `
            <div class="autocomplete-item" onclick='selectFoodItem("${escapeHtml(food.description)}", ${calories})'>
                <div class="food-name">${food.description}</div>
                <div class="food-calories">${calories} calories per serving</div>
            </div>
        `;
    }).join('');

    suggestionsDiv.innerHTML = suggestionsHTML;
    suggestionsDiv.style.display = 'block';
}

function getCaloriesFromFood(food) {
    if (food.foodNutrients) {
        const energyNutrient = food.foodNutrients.find(n =>
            n.nutrientName === 'Energy' || n.nutrientName === 'Calories'
        );
        if (energyNutrient) {
            return Math.round(energyNutrient.value);
        }
    }
    return 0;
}

function selectFoodItem(foodName, calories) {
    document.getElementById('foodItem').value = foodName;
    document.getElementById('calories').value = calories;
    currentCalorieSuggestion = calories;
    hideAutocompleteSuggestions();
}

function hideAutocompleteSuggestions() {
    const suggestionsDiv = document.getElementById('autocompleteSuggestions');
    suggestionsDiv.style.display = 'none';
    suggestionsDiv.innerHTML = '';
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML.replace(/'/g, "\\'");
}

async function analyzeImageForCalories(imageData) {
    const statusElement = document.getElementById('calorieStatus');
    statusElement.innerHTML = '<span class="analyzing-badge">Analyzing image...</span>';

    setTimeout(() => {
        const estimatedCalories = estimateCaloriesFromImage(imageData);

        if (estimatedCalories && !document.getElementById('calories').value) {
            document.getElementById('calories').value = estimatedCalories;
            statusElement.innerHTML = '<span class="analyzing-badge">Estimated from image</span>';

            setTimeout(() => {
                hideLoadingStatus();
            }, 3000);
        } else {
            hideLoadingStatus();
        }
    }, 1500);
}

function estimateCaloriesFromImage(imageData) {
    const img = new Image();
    img.src = imageData;

    img.onload = function() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const imageDataObj = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageDataObj.data;

        let totalBrightness = 0;
        let colorfulness = 0;

        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];

            totalBrightness += (r + g + b) / 3;
            colorfulness += Math.abs(r - g) + Math.abs(g - b) + Math.abs(b - r);
        }

        const avgBrightness = totalBrightness / (data.length / 4);
        const avgColorfulness = colorfulness / (data.length / 4);

        const portionSize = Math.min(canvas.width * canvas.height / 10000, 3);

        let baseCalories = 200;
        if (avgBrightness > 150) {
            baseCalories = 150;
        } else if (avgColorfulness > 100) {
            baseCalories = 300;
        }

        const estimatedCalories = Math.round(baseCalories * portionSize);

        return Math.max(50, Math.min(estimatedCalories, 1500));
    };

    const foodItem = document.getElementById('foodItem').value.toLowerCase();
    if (foodItem.includes('salad') || foodItem.includes('vegetable')) {
        return 150;
    } else if (foodItem.includes('pizza') || foodItem.includes('burger')) {
        return 500;
    } else if (foodItem.includes('fruit')) {
        return 80;
    }

    return 250;
}

function handleFormSubmit(event) {
    event.preventDefault();

    const mealName = document.getElementById('mealName').value;
    const foodItem = document.getElementById('foodItem').value;
    const caloriesInput = document.getElementById('calories').value;
    const calories = caloriesInput ? parseInt(caloriesInput) : (currentCalorieSuggestion || 0);
    const foodImageInput = document.getElementById('foodImage');
    const imagePreview = document.getElementById('imagePreview');

    if (calories === 0) {
        alert('Please enter calories or select a food item from suggestions');
        return;
    }

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
    hideAutocompleteSuggestions();
    hideLoadingStatus();
    currentCalorieSuggestion = null;
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
