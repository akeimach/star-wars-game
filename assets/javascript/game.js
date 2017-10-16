



function Character(displayName, healthPoints, initialHealthPoints, attackPower, counterAttackPower) {
    this.displayName = displayName;
    this.healthPoints = healthPoints;
    this.initialHealthPoints = initialHealthPoints;
    this.attackPower = attackPower;
    this.counterAttackPower = counterAttackPower;
}


var allCharacters = {
    '.obi-wan': new Character('Obi-Wan Kenobi', 120, 120, 8, 8),
    '.luke-sky': new Character('Luke Skywalker', 180, 180, 25, 25),
    '.darth-sid': new Character('Darth Sidious', 150, 150, 20, 20),
    '.darth-maul': new Character('Darth Maul', 100, 100, 5, 5)
}



$(document).ready(function(){

    var hero;
    var enemy;
    var heroKey;
    var enemyKey;
    var chooseHero;
    var chooseEnemy;
    var enemiesRemaining;
    var gameOver;
    var detachedCards = [];

    function initializeGame() {
        hero = null;
        enemy = null;
        heroKey = '';
        enemyKey = '';
        chooseHero = true;
        chooseEnemy = true;
        enemiesRemaining = Object.keys(allCharacters).length - 1;
        gameOver = false;
        $('#fight-commentary-1, #fight-commentary-2').empty();
        $('#instruction').html('Choose your character');
    }


    function updateHealth() {
        for (var key in allCharacters) {
            $(key + '-hp').html(allCharacters[key].healthPoints);
        }
    }


    (function($) {
        $.prototype.dragCard = function(event) {

            event = $.extend({handle:"",cursor:"move"}, event);
            
            return $(this).css('cursor', event.cursor).on("mousedown", function(e) {
                var $drag = $(this).addClass('draggable');
                var    pos_y = $drag.offset().top + $drag.outerHeight() - e.pageY;
                var    pos_x = $drag.offset().left + $drag.outerWidth() - e.pageX;
                $drag.css('z-index', 1000).parents().on("mousemove", function(e) {
                    $('.draggable').offset({
                        top:e.pageY + pos_y - $drag.outerHeight(),
                        left:e.pageX + pos_x - $drag.outerWidth()
                    }).on("mouseup", function() {
                        $(this).removeClass('draggable').css('z-index', $drag.css('z-index'));
                    });
                });
                e.preventDefault(); // so card moves only as a whole
            }).on("mouseup", function() {
                $(this).removeClass('draggable');
            });

        }
    })(jQuery);


    $('#reset').on("click", function() {
        location.reload(true);
        initializeGame();
        updateHealth();
    });


    $('#attack').on("click", function() {

        if (gameOver) return;

        $('#fight-commentary-1, #fight-commentary-2').empty();

        if (chooseHero) {
            for (var key in allCharacters) {
                var position = $(key).position();
                if ((Math.abs(position.top - $('#hero-box').position().top) < 50) &&
                    (Math.abs(position.left - $('#hero-box').position().left) < 50)) {
                    heroKey = key;
                    hero = allCharacters[heroKey];
                    chooseHero = false;
                    detachedCards.push(heroKey); // so won't be chosen for enemy
                    // TODO: make sure two cards aren't in same box
                }
            }
            if (chooseHero) {
                $('#fight-commentary-1').html('You need to choose a hero.');
                $('#fight-commentary-2').html('Rearrange your set up.');
                return;
            }
        }

        if (chooseEnemy) {
            for (var key in allCharacters) {
                if (detachedCards.indexOf(key) === -1) {
                    var position = $(key).position();
                    if ((Math.abs(position.top - $('#enemy-box').position().top) < 50) &&
                        (Math.abs(position.left - $('#enemy-box').position().left) < 50)) {
                        enemyKey = key;
                        enemy = allCharacters[enemyKey];
                        chooseEnemy = false;
                        // TODO: make sure two cards aren't in same box
                        enemiesRemaining--;
                        if (enemiesRemaining > 0) {
                            $('#instruction').html('Up next:');
                        }
                        else {
                            $('#instruction').empty();
                        }
                    }
                }
            }
            if (chooseEnemy) {
                // TODO: tell user they can't change their hero
                $('#fight-commentary-1').html('You need to choose an enemy.');
                $('#fight-commentary-2').html('Rearrange your set up.');
                return;
            }
        }

        enemy.healthPoints -= hero.attackPower; // Hero attacks first
        if (enemy.healthPoints < 1) {
            $(enemyKey).detach();
            $('#fight-commentary-1').html('You have defeated ' + enemy.displayName + '.');
            if (enemiesRemaining > 0) {
                chooseEnemy = true;
                detachedCards.push(enemyKey);
                $('#fight-commentary-2').html('Choose your next enemy.');
            }
            else {
                gameOver = true;
                $('#fight-commentary-2').html('You won the game!');
                $('#instruction').empty();
            }

        }
        else { // If the enemy is not defeated, it gets to attack second
            hero.healthPoints -= enemy.counterAttackPower;
            if (hero.healthPoints < 1) {
                $(heroKey).detach();
                gameOver = true;
                $('#fight-commentary-1').html('You lost to ' + enemy.displayName + '.');
                $('#fight-commentary-2').html('Game over.');
            }
            else {
                $('#fight-commentary-1').html('You attacked ' + enemy.displayName + ' for ' + hero.attackPower + ' damage.');
                $('#fight-commentary-2').html(enemy.displayName + ' attacked you back for ' + enemy.counterAttackPower + ' damage.');
            }
        }
        updateHealth();
        hero.attackPower += hero.counterAttackPower;

    });


    initializeGame();
    updateHealth();
    $('.card').dragCard();


});