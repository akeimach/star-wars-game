



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
    var detachedCharacters = [];
    var detachedNames = [];

    function initializeGame() {
        hero = null;
        enemy = null;
        heroKey = '';
        enemyKey = '';
        chooseHero = true;
        chooseEnemy = true;
        enemiesRemaining = Object.keys(allCharacters).length - 1;
        $('#arena').empty();
        $('#fight-commentary-1, #fight-commentary-2').empty();
        $('#instruction').html('Choose your character');
    }


    function updateHealth() {
        for (var key in allCharacters) {
            $(key + '-hp').html(allCharacters[key].healthPoints);
        }
    }

    $('#reset').on("click", function() {
        location.reload(true);
        initializeGame();
        updateHealth();
    });


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

    $('.card').dragCard();


    $('#confirm').on("click", function() {

        $('#fight-commentary-1, #fight-commentary-2').empty();

        var inBounds = [];

        for (var key in allCharacters) {
            if (detachedNames.indexOf(key) === -1) {
                var position = $(key).position();
                if (position.top < $('#arena').position().top + $('#arena').outerHeight()) {
                    inBounds.push(key);
                }
            }
        }

        if (inBounds.length !== 2) {
            $('#fight-commentary-1').html('Place exactly two players in the arena.');
            $('#fight-commentary-2').html('Rearrange your set up.');
        }
        else {
            if (chooseHero && chooseEnemy) {
                if (($(inBounds[0]).position().left < $(inBounds[1]).position().left)) {
                    heroKey = inBounds[0];
                    enemyKey = inBounds[1];
                }
                else {
                    heroKey = inBounds[1];
                    enemyKey = inBounds[0];
                }
                chooseHero = false;
                chooseEnemy = false;
                hero = allCharacters[heroKey];
                enemy = allCharacters[enemyKey];
            }
            else if (chooseEnemy) {
                if (($(inBounds[0]).position().left < $(inBounds[1]).position().left)) {
                    enemyKey = inBounds[1];
                }
                else {
                    enemyKey = inBounds[0];
                }
                if ($(enemyKey).position().left < $(heroKey).position().left) {
                    $('#fight-commentary-1').html('You must play the same character every round.');
                    $('#fight-commentary-2').html('Rearrange your set up.');
                }
                else {
                    chooseEnemy = false;
                    enemy = allCharacters[enemyKey];
                }

            }
            if (chooseEnemy === false) {
                enemiesRemaining--;
                if (enemiesRemaining > 0) {
                    $('#instruction').html('Up next:');
                }
                else {
                    $('#instruction').empty();
                }
            }
        }
    });


    $('#attack').on("click", function() {

        if (chooseHero) {
            $('#fight-commentary-1').html('You need to confirm your cards.');
            return;
        }
        else if (chooseEnemy) {
            $('#fight-commentary-1').html('Enemy not ready.');
            return;
        }

        enemy.healthPoints -= hero.attackPower; // Hero attacks first
        if (enemy.healthPoints < 1) {
            detachedCharacters.push($(enemyKey).detach());
            detachedNames.push(enemyKey);
            $('#fight-commentary-1').html('You have defeated ' + enemy.displayName + '.');
            if (enemiesRemaining > 0) {
                chooseEnemy = true;
                $('#fight-commentary-2').html('Choose your next enemy.');
            }
            else {
                $('#fight-commentary-2').html('You won the game!');
                $('#instruction').empty();
            }

        }
        else { // If the enemy is not defeated, it gets to attack second
            hero.healthPoints -= enemy.counterAttackPower;
            if (hero.healthPoints < 1) {
                detachedCharacters.push($(heroKey).detach());
                detachedNames.push(heroKey);
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


});