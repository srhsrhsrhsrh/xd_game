import StaticEnvironment from "./staticEnvironment.js";
import ItemCreator from "./items.js";
import Player from "./player.js";

const width = 800;
const height = 600;
const xvel = 300;
const yvel = 300;
var max = 0;
var items = Array(1, 2, 3, 4, 5, 6, 7);


document.onreadystatechange = function () {
    if (document.readyState == "complete") {
        var game = new PixelJS.Engine();
        game.init({
            container: 'game_container',
            width: width,
            height: height
        });

        var backgroundLayer = game.createLayer('background');
        backgroundLayer.static = true;

        var staticEnvironment = new StaticEnvironment(backgroundLayer);
        var rightWall, leftWall, topWall, botWall;
        var grass;

        [rightWall,leftWall, topWall, botWall] = staticEnvironment.createWalls();
        grass = staticEnvironment.createGrass();

        var playerLayer = game.createLayer("players");
        var player = Player.createPlayer(playerLayer);

        var itemLayer = game.createLayer('items');
        var itemCreator = new ItemCreator(itemLayer);

        var coin, compost, garbage, recycling;
        [coin, compost, garbage, recycling] = itemCreator.createItems()
       

        var itemLayer1 = game.createLayer('items1');
        var fire = itemLayer1.createEntity();
        fire.pos = { x: 200, y: 100 };
        fire.size = { width: 16, height: 16 };
        fire.asset = new PixelJS.AnimatedSprite();
        fire.asset.prepare({
            name: 'garbagefire.png',
            frames: 1,
            rows: 1,
            speed: 80,
            defaultFrame: 0
        });
        itemLayer1.visible = false;

        var pickupLayer = game.createLayer('pickup');
        var water_bottle = pickupLayer.createEntity();
        water_bottle.pos = {
            x: Math.floor(Math.random() * (700 - 100 + 1) + 100),
            y: Math.floor(Math.random() * (500 - 100 + 1) + 100)
        };
        water_bottle.size = { width: 10, height: 35 };
        water_bottle.asset = new PixelJS.AnimatedSprite();
        water_bottle.asset.prepare({
            name: 'water_bottle.png',
            frames: 1,
            rows: 1,
            speed: 80,
            defaultFrame: 0
        });

        var cup = pickupLayer.createEntity();
        cup.pos = {
            x: Math.floor(Math.random() * (700 - 100 + 1) + 100),
            y: Math.floor(Math.random() * (500 - 100 + 1) + 100)
        };
        cup.size = { width: 10, height: 35 };
        cup.asset = new PixelJS.AnimatedSprite();
        cup.asset.prepare({
            name: 'cup.png',
            frames: 1,
            rows: 1,
            speed: 80,
            defaultFrame: 0
        });

        var collectSound = game.createSound('collect');
        collectSound.prepare({ name: 'coin.mp3' });

        var temp = "";
        player.onCollide(function (entity) {
            if (entity === coin) {
                collectSound.play();
                coin.pos = {
                    x: Math.floor(Math.random() * (700 - 100 + 1) + 100),
                    y: Math.floor(Math.random() * (500 - 100 + 1) + 100)
                };
                score += 1;
                scoreLayer.redraw = true;
                scoreLayer.drawText(
                    'Coins: ' + score,
                    50,
                    50,
                    '14pt "Trebuchet MS", Helvetica, sans-serif',
                    '#FFFFFF',
                    'left'
                );
            }
            if (entity == water_bottle && temp == "") {
                temp = "water bottle";
                holdingLayer.redraw = true;
                holdingLayer.drawText(
                    'Holding: ' + temp,
                    50,
                    80,
                    '14pt "Trebuchet MS", Helvetica, sans-serif',
                    '#FFFFFF',
                    'left'
                );
                water_bottle.dispose();
                water_bottle = null;
            }
            if (entity == cup && temp == ""){
                temp = "styrofoam cup";
                holdingLayer.redraw = true;
                holdingLayer.drawText(
                    'Holding: ' + temp,
                    50,
                    80,
                    '14pt "Trebuchet MS", Helvetica, sans-serif',
                    '#FFFFFF',
                    'left'
                );
                cup.dispose();
                cup = null;
            }
            if (entity === compost || entity === recycling || entity === garbage) {
                player.velocity = { x: 0, y: 0 };
                setTimeout(function () {
                    player.velocity = { x: xvel, y: yvel };
                }, 500);
                if (entity === recycling) {
                    if (temp === "water bottle") {
                        temp = "";
                        score+=5;
                        scoreLayer.redraw = true;
                        scoreLayer.drawText(
                            'Coins: ' + score,
                            50,
                            50,
                            '14pt "Trebuchet MS", Helvetica, sans-serif',
                            '#FFFFFF',
                            'left'
                        );
                        holdingLayer.redraw = true;
                        holdingLayer.drawText(
                            'Holding: ' + temp,
                            50,
                            80,
                            '14pt "Trebuchet MS", Helvetica, sans-serif',
                            '#FFFFFF',
                            'left'
                        );
                    }
                }
                if (entity === garbage){
                    if (temp === "styrofoam cup"){
                        temp = "";
                        score +=5;
                        scoreLayer.redraw = true;
                        scoreLayer.drawText(
                            'Coins: ' + score,
                            50,
                            50,
                            '14pt "Trebuchet MS", Helvetica, sans-serif',
                            '#FFFFFF',
                            'left'
                        );
                        holdingLayer.redraw = true;
                        holdingLayer.drawText(
                            'Holding: ' + temp,
                            50,
                            80,
                            '14pt "Trebuchet MS", Helvetica, sans-serif',
                            '#FFFFFF',
                            'left'
                        );
                    }
                }
            } if (entity === rightWall) {
                player.pos.x = rightWall.pos.x - 68;
            } if (entity === leftWall) {
                player.pos.x = leftWall.pos.x + 425;
            } if (entity === topWall) {
                player.pos.y = topWall.pos.y + 435;
            } if (entity === botWall) {
                player.pos.y = botWall.pos.y - 68;
            }

        });

        backgroundLayer.registerCollidable(rightWall);
        backgroundLayer.registerCollidable(leftWall);
        backgroundLayer.registerCollidable(topWall);
        backgroundLayer.registerCollidable(botWall);
        backgroundLayer.registerCollidable(compost);
        backgroundLayer.registerCollidable(garbage);
        backgroundLayer.registerCollidable(recycling);

        playerLayer.registerCollidable(player);
        itemLayer.registerCollidable(coin);
        itemLayer.registerCollidable(compost);

        pickupLayer.registerCollidable(water_bottle);
        pickupLayer.registerCollidable(cup);

        var score = 0;
        var scoreLayer = game.createLayer("score");
        scoreLayer.static = true;

        var holding = { bool: false, name: "" };
        var holdingLayer = game.createLayer("holding");
        holdingLayer.static = true;

        var highscore = 0;
        var highscoreLayer = game.createLayer("highscore");
        highscoreLayer.static = true;

        var gameOver = "";
        var gameOverLayer = game.createLayer("gameover");
        gameOverLayer.static = true;

        function updateTime() {
            playerLayer.visible = false;
            itemLayer.visible = false;
            itemLayer1.visible = true;
            pickupLayer.visible = false;
            gameOverLayer.redraw = true;
            gameOverLayer.drawText(
                'GAME OVER',
                width/2-45,
                height-40,
                '14pt "Trebuchet MS", Helvetica, sans-serif',
                '#FFFFFF',
                'left'
            )
        }

        game.loadAndRun(function (elapsedTime, dt) {
            scoreLayer.redraw = true;
            scoreLayer.drawText(
                'Coins: ' + score,
                50,
                50,
                '14pt "Trebuchet MS", Helvetica, sans-serif',
                '#FFFFFF',
                'left'
            );
            holdingLayer.redraw = true;
            holdingLayer.drawText(
                'Holding: ' + temp,
                50,
                80,
                '14pt "Trebuchet MS", Helvetica, sans-serif',
                '#FFFFFF',
                'left'
            );
            setTimeout(function () {
                updateTime();
            }, 40000);
            // if (score > max){
            //     max = score;
            //     holdingLayer.drawText(
            //         'Holding: ' + temp,
            //         50,
            //         height - 50,
            //         '14pt "Trebuchet MS", Helvetica, sans-serif',
            //         '#FFFFFF',
            //         'left'
            //     );
            // }
        });
    }
}