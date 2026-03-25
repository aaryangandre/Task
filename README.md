# Daily Calorie Intake Tracker

A modern, AI-powered web application to track your daily calorie intake with automatic calorie detection, image analysis, and stunning 3D animations.

## Features

- **Smart Calorie Detection**: Automatically calculates calories as you type food names using USDA FoodData Central API and local database fallback
- **AI Image Analysis**: Estimates calories from uploaded food images based on portion size and visual characteristics
- **Modern 3D Animations**: Smooth, interactive 3D animations and transitions throughout the UI
- **Real-time Autocomplete**: Get instant food suggestions with calorie information as you type
- **Track Daily Intake**: Monitor total calories, meals logged, and progress toward daily goals
- **Image Upload**: Capture or upload photos of your meals
- **Automatic Daily Reset**: Data resets each day automatically
- **Local Storage Persistence**: All data saved in browser, no server required
- **Responsive Design**: Works perfectly on desktop and mobile devices

## How to Use

1. Open `index.html` in your web browser
2. Start typing a food item in the "Food Item" field:
   - Autocomplete suggestions will appear with calorie information
   - Click a suggestion to auto-fill calories
3. Optionally upload an image of your food:
   - The app will analyze the image and estimate calories based on portion size
   - Works best with clear, well-lit food photos
4. Calories field auto-populates from:
   - Selected autocomplete suggestion
   - Uploaded image analysis
   - Or enter manually if needed
5. Click "Add Meal" to log the entry
6. View your daily summary with interactive 3D cards at the top
7. Delete meals if needed using the Delete button

## Features Details

### Automatic Calorie Detection
- **Live API Integration**: Connects to USDA FoodData Central API for real-time nutritional data
- **Smart Fallback**: Uses built-in database of common foods if API is unavailable
- **Instant Suggestions**: Shows top 5 matching foods with calorie counts as you type
- **No Manual Entry Needed**: Just select from suggestions for accurate calorie tracking

### AI-Powered Image Analysis
- Analyzes food images to estimate calories based on:
  - Portion size (calculated from image dimensions)
  - Visual brightness (lighter foods often lower calorie)
  - Color complexity (more colorful foods may be higher calorie)
  - Food type detection from item name
- Provides reasonable estimates for common foods
- Can be overridden manually if needed

### Modern 3D Animations
- **Container**: Smooth 3D fade-in on page load
- **Title**: Gentle floating animation with 3D rotation
- **Summary Cards**: Slide-in animations with staggered timing, 3D lift on hover
- **Meal Cards**: 3D appearance animation, hover effects with rotation and elevation
- **Buttons**: 3D press effects and pulse animations
- **Images**: Scale and rotation on hover
- All animations use hardware-accelerated transforms for smooth 60fps performance

## Tech Stack

- HTML5
- CSS3 (3D Transforms, Animations)
- Vanilla JavaScript (ES6+)
- USDA FoodData Central API
- Canvas API for image analysis
- LocalStorage API
- FileReader API

## Installation

No installation required! Simply clone the repository and open `index.html` in any modern web browser.

```bash
git clone <repository-url>
cd Task
open index.html
```

## API Configuration

The app uses USDA FoodData Central API with a demo key by default. For production use:
1. Get a free API key from https://fdc.nal.usda.gov/api-key-signup.html
2. Replace `DEMO_KEY` in `script.js` with your API key
3. Demo key has rate limits; personal key provides higher limits

## Browser Compatibility

Works with all modern browsers that support:
- LocalStorage
- FileReader API
- Canvas API
- ES6 JavaScript
- CSS 3D Transforms
- Fetch API