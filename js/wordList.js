const words = [
    { word: 'pikachu', colors: ['yellow', 'red', 'black'] },
    { word: 'mickey mouse', colors: ['black', 'red', 'yellow'] },
    { word: 'superman', colors: ['blue', 'red', 'yellow'] },
    { word: 'spongebob', colors: ['yellow', 'brown', 'white'] },

    { word: 'rainbow', colors: ['red', 'orange', 'yellow', 'green', 'blue', 'purple'] },
    { word: 'traffic light', colors: ['red', 'yellow', 'green'] },
    { word: 'rubiks cube', colors: ['red', 'yellow', 'blue', 'green', 'orange', 'white'] },
    { word: 'candy cane', colors: ['red', 'white'] },
    { word: 'basketball', colors: ['orange', 'black'] },
    { word: 'ladybug', colors: ['red', 'black'] },
    { word: 'bee', colors: ['yellow', 'black'] },
    { word: 'minecraft creeper', colors: ['green', 'black'] },


    { word: 'watermelon', colors: ['green', 'red', 'black'] },
    { word: 'tiger', colors: ['orange', 'black', 'white'] },
    { word: 'panda', colors: ['black', 'white'] },


    { word: 'american flag', colors: ['red', 'white', 'blue'] },
    { word: 'canadian flag', colors: ['red', 'white'] },
    { word: 'japanese flag', colors: ['red', 'white'] },


    { word: 'mcdonalds logo', colors: ['red', 'yellow'] },
    { word: 'pepsi logo', colors: ['red', 'white', 'blue'] },
    { word: 'youtube logo', colors: ['red', 'white'] },


    { word: 'candy corn', colors: ['orange', 'yellow', 'white', 'black'] },
    { word: 'christmas tree', colors: ['green', 'yellow', 'red'] },
    { word: 'jack o lantern', colors: ['orange', 'black', 'yellow'] }
];

const successMessages = [
    "I know, it's a {word}!",
    "Of course, that's a {word}!",
    "Aha! That's definitely a {word}!",
    "That's got to be a {word}!",
    "Finally! It's a {word}!"
];

// function getColors(ctx, canvas) {
//     const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
//     const colors = { red: 0, green: 0, blue: 0, yellow: 0, brown: 0, orange: 0 };
//     let totalPixels = 0;

//     for (let i = 0; i < imageData.length; i += 4) {
//         if (imageData[i + 3] > 0) {
//             const r = imageData[i];
//             const g = imageData[i + 1];
//             const b = imageData[i + 2];
//             totalPixels++;

//             if (r > 200 && g < 100 && b < 100) colors.red++;
//             else if (r < 100 && g > 200 && b < 100) colors.green++;
//             else if (r > 200 && g > 200 && b < 100) colors.yellow++;
//             else if (r < 100 && g < 100 && b > 200) colors.blue++;
//             else if (r > 180 && g > 100 && b < 100) colors.orange++;
//             else if (r > 100 && g < 80 && b < 80) colors.brown++;
//         }
//     }

//     return Object.entries(colors)
//         .filter(([_, count]) => count / totalPixels > 0.05)
//         .map(([color]) => color);
// }

