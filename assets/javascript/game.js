



function Character(displayName, healthPoints, initialHealthPoints, attackPower, counterAttackPower) {
    this.displayName = displayName;
    this.healthPoints = healthPoints;
    this.initialHealthPoints = initialHealthPoints;
    this.attackPower = attackPower;
    this.counterAttackPower = counterAttackPower;
}


var allCharacters = {
    "obi-wan": new Character("Obi-Wan Kenobi", 120, 120, 8, 8),
    "luke-sky": new Character("Luke Skywalker", 100, 100, 5, 5),
    "darth-sid": new Character("Darth Sidious", 150, 150, 20, 20),
    "darth-maul": new Character("Darth Maul", 180, 180, 25, 25)
}



$(document).ready(function(){

    var hero;
    var enemy;
    var heroKey;
    var enemyKey;
    var chooseHero;
    var chooseEnemy;
    var attackValid;


    function initializeGame() {
        hero = null;
        enemy = null;
        heroKey = "";
        enemyKey = "";
        chooseHero = true;
        chooseEnemy = true;
        attackValid = false;
        $("#instruction").html("Choose your character");

    }

    function updateHealth() {
        for (var key in allCharacters) {
            $("#" + key + "-hp").html(allCharacters[key].healthPoints);
        }
    }

    $(".card").on("click", function() {

        if (!chooseHero && !chooseEnemy) return;

        console.log(this);
        console.log($(this));

        if (chooseHero) {
            hero = allCharacters[this.id];
            heroKey = this.id;
            chooseHero = false;
            $(this).detach();
            $("#arena").append($(this));
            $("#instruction").html("Choose your first enemy");
        }
        else if ((chooseEnemy) && (this.id !== heroKey)) {
            enemy = allCharacters[this.id];
            enemyKey = this.id;
            chooseEnemy = false;
            $(this).detach();
            $("#arena").append($(this));
            $("#instruction").html("Up next:");
            attackValid = true;
            $("#fight-commentary-1").empty();
        }
    });

    $("#attack").on("click", function() {

        if (!attackValid) {
            $("#fight-commentary-1").html("Enemy not ready");
            return;
        }
        // Hero attacks first
        enemy.healthPoints -= hero.attackPower;
        if (enemy.healthPoints < 1) {
            $("#fight-commentary-1").html("You have defeated " + enemy.displayName + ", choose your next enemy.");
            $("#fight-commentary-2").empty();
            $("#" + enemyKey).detach();
            $("#instruction").html("Choose your character");
            chooseEnemy = true;
            attackValid = false;
        }
        else {
            hero.healthPoints -= enemy.counterAttackPower;
            if (hero.healthPoints < 1) {
                $("#fight-commentary-1").html("You lost to " + enemy.displayName + ", game over.");
                $("#fight-commentary-2").empty();
                $("#" + heroKey).detach();
                attackValid = false;
            }
            else {
                $("#fight-commentary-1").html("You attacked " + enemy.displayName + " for " + hero.attackPower + " damage.");
                $("#fight-commentary-2").html(enemy.displayName + " attacked you back for " + enemy.counterAttackPower + " damage.");
            }
        }
        updateHealth();
        hero.attackPower += hero.counterAttackPower;

    });

    $("#reset").on("click", function() {
        for (var key in allCharacters) {
            var cardInPlay = $("#" + key);
            cardInPlay.detach();
            $("#bull-pen").append(cardInPlay);
        }
        for (var key in allCharacters) {
            allCharacters[key].healthPoints = allCharacters[key].initialHealthPoints;
            allCharacters[key].attackPower = allCharacters[key].counterAttackPower;
        }
        updateHealth();
        hero = null;
        enemy = null;
        heroKey = "";
        enemyKey = "";
        chooseHero = true;
        chooseEnemy = true;
        attackValid = false;
        $("#instruction").html("Choose your character");
        $("#fight-commentary-1, #fight-commentary-2").empty();
    });


    initializeGame();
    updateHealth();



});