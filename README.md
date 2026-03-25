# Daily Calorie Intake Tracker

A simple and elegant web application to track your daily calorie intake with image support for food items.

## Features

- Track daily calorie intake with meal logging
- Add images of your food items
- View total calories consumed
- Count of meals logged
- Daily calorie goal tracking
- Automatic daily reset
- Local storage persistence
- Clean and responsive design

## How to Use

1. Open `index.html` in your web browser
2. Fill in the meal details:
   - Meal Name (e.g., Breakfast, Lunch, Dinner, Snack)
   - Food Item description
   - Calories consumed
   - Optional: Upload an image of your food
3. Click "Add Meal" to log the entry
4. View your daily summary at the top
5. Delete meals if needed using the Delete button

## Features Details

### Image Upload
- Supports all common image formats (JPG, PNG, GIF, etc.)
- Image preview before submission
- Images are stored locally in browser storage
- Optional - meals can be logged without images

### Data Persistence
- All data is saved to browser's local storage
- Data automatically resets each day
- No server or database required

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript
- LocalStorage API

## Installation

No installation required! Simply clone the repository and open `index.html` in any modern web browser.

```bash
git clone <repository-url>
cd Task
open index.html
```

## Browser Compatibility

Works with all modern browsers that support:
- LocalStorage
- FileReader API
- ES6 JavaScript