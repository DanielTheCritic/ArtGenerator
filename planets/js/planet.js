var colors;
    var tileNum = 0;
    var tiles;
    var colorsLand;
    var colorsWater;
    var rndLandColor;
    var rndWaterColor;

    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");

    window.onload = function () {
        generatePlanet();
    }

    function generatePlanet() {
        //reset
        tileNum = 0;
        tiles = [{ x: 0, y: 0, land: false }];

        //Retrive colors
        colorsLand = interpolateColors("rgb(" + getColor(true) + ")", "rgb(" + getColor(true) + ")", 6000);
        colorsWater = interpolateColors("rgb(" + getColor(false) + ")", "rgb(" + getColor(false) + ")", 6000);

      //  canvas.style.borderImage = "linear-gradient(" + "red" + ", " + "orange" + ") 1 ";

        //Creates a array of my tiles and sets either water or land to them and calculates the % of being water/land
        for (var i = 0; i < 5040; i++) {
            var currentTile = tiles[tiles.length - 1];            
            if (currentTile.x <= 69) {
                var isLand = false;
                if (currentTile.land == true || tiles.length > 70 && tiles[tiles.length - 70].land == true) {                    
                    isLand = (Math.floor(Math.random() * 100) + 1) > 35;
                }
                else if (currentTile.land == true || tiles.length > 70 &&
                    (tiles[tiles.length - 1].land == true ||
                        tiles[tiles.length - 70].land == true)) {
                    isLand = (Math.floor(Math.random() * 100) + 1) > 70;
                }
                else {
                    isLand = (Math.floor(Math.random() * 100) + 1) > 99;
                }
                tiles.push({ x: currentTile.x + 1, y: currentTile.y, land: isLand });
            }
            else {
                tiles.push({ x: 0, y: currentTile.y + 1, land: isLand });
            }
        }
        drawPlanet();

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(5, 5);
        ctx.quadraticCurveTo(288, 0, 388, 150);
        ctx.lineWidth = 10;
        ctx.quadraticCurveTo(288, 288, 188, 150);
        ctx.lineWidth = 10;

        ctx.clip();

    }

    //retrive a random color if it's a land tile i want it dark water i want light
    function getColor(land) {
        while (true) {
            var r = Math.floor(Math.random() * 256) + 1
            var g = Math.floor(Math.random() * 256) + 1
            var b = Math.floor(Math.random() * 256) + 1
            hsp = Math.sqrt(
                0.299 * (r * r) +
                0.587 * (g * g) +
                0.114 * (b * b)
            );
            //light color
            if (hsp > 127.5 && land == false) {
                return r + "," + g + "," + b;
            }
            //dark color
            else if (hsp < 127.5 && land == true) {

                return r + "," + g + "," + b;
            }
        }
    }

    //these 2 functions interpolateColor(s) takes 2 colors and gives me 'steps' colors between
    function interpolateColors(color1, color2, steps) {
        var stepFactor = 1 / (steps - 1),
            interpolatedColorArray = [];
        color1 = color1.match(/\d+/g).map(Number);
        color2 = color2.match(/\d+/g).map(Number);

        for (var i = 0; i < steps; i++) {
            interpolatedColorArray.push(interpolateColor(color1, color2, stepFactor * i));
        }
        return interpolatedColorArray;
    }

    function interpolateColor(color1, color2, factor) {
        if (arguments.length < 3) {
            factor = 0.5;
        }
        var result = color1.slice();
        for (var i = 0; i < 3; i++) {
            result[i] = Math.round(result[i] + factor * (color2[i] - color1[i]));
        }
        return result;
    };

    //retrives a random color for land
    function rndLandColor() {
        return 'rgb(' + colorsLand[Math.floor(Math.random() * 5999) + 1] + ')';
    }
    //retrives a random color for water
    function rndWaterColor() {
        return 'rgb(' + colorsWater[Math.floor(Math.random() * 5999) + 1] + ')';
    }

    function drawPlanet() {
        var i = 0, j = 0;
        function animate() {
            ctx.beginPath();

            //fill in holes in the land that is bigger then 1
            var score = 0;
            if (tiles[tileNum - 71] !== undefined && tiles[tileNum + 71] !== undefined) {
                if (tiles[tileNum].land == false) {
                    score++;
                }
                if (tiles[tileNum - 1].land == true) {
                    score++;
                }
                if (tiles[tileNum + 1].land == true) {
                    score++;
                }
                if (tiles[tileNum + 71].land == true) {
                    score++;
                }
                if (tiles[tileNum - 71].land == true) {
                    score++;
                }
            }

            if (score >= 3) {
                ctx.fillStyle = rndLandColor;
            }

            //cover single land tiles with water (if land tile is up,down,left and right of this tile)
            else if (
                tiles[tileNum - 71] !== undefined &&
                tiles[tileNum + 71] !== undefined &&
                tiles[tileNum - 1].land == false &&
                tiles[tileNum + 1].land == false &&
                tiles[tileNum - 71].land == false &&
                tiles[tileNum + 71].land == false) {
                ctx.fillStyle = rndWaterColor();
            }

            //cover single water tiles with land (if water tile is up,down,left and right of this tile)
            else if (
                tiles[tileNum - 71] !== undefined &&
                tiles[tileNum + 71] !== undefined &&
                tiles[tileNum - 1].land == true &&
                tiles[tileNum + 1].land == true &&
                tiles[tileNum - 71].land == true &&
                tiles[tileNum + 71].land == true) {
                ctx.fillStyle = rndLandColor();
            }
            //cover tile with land
            else if (tiles[tileNum] !== undefined && tiles[tileNum].land == true) {
                ctx.fillStyle = rndLandColor();
            }

            //cover tile with water
            else if (tiles[tileNum] !== undefined && tiles[tileNum].land == false) {
                ctx.fillStyle = rndWaterColor();
            }
            tileNum++;

            ctx.fill();
            ctx.closePath();
            ctx.fillRect(10 * j, 10 * i, 10, 10);

            j++;
            if (j >= 71) {
                i++;
                j = 0;
            }
            if (i <= 71) {
                animate();
            }
        }
        animate();
    }