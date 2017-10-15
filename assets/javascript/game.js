



function Character(displayName, healthPoints, initialHealthPoints, attackPower, counterAttackPower) {
    this.displayName = displayName;
    this.healthPoints = healthPoints;
    this.initialHealthPoints = initialHealthPoints;
    this.attackPower = attackPower;
    this.counterAttackPower = counterAttackPower;
}


var allCharacters = {
    ".obi-wan": new Character("Obi-Wan Kenobi", 120, 120, 8, 8),
    ".luke-sky": new Character("Luke Skywalker", 180, 180, 25, 25),
    ".darth-sid": new Character("Darth Sidious", 150, 150, 20, 20),
    ".darth-maul": new Character("Darth Maul", 100, 100, 5, 5)
}



$(document).ready(function(){

    var hero;
    var enemy;
    var heroKey;
    var enemyKey;
    var chooseHero;
    var chooseEnemy;
    var enemiesRemaining;

    function initializeGame() {
        hero = null;
        enemy = null;
        heroKey = "";
        enemyKey = "";
        chooseHero = true;
        chooseEnemy = true;
        enemiesRemaining = Object.keys(allCharacters).length - 1;
        $("#arena").empty();
        $("#fight-commentary-1, #fight-commentary-2").empty();
        $("#instruction").html("Choose your character");
    }


    function updateHealth() {
        for (var key in allCharacters) {
            $(key + "-hp").html(allCharacters[key].healthPoints);
        }
    }

    $("#reset").on("click", function() {

        for (var key in allCharacters) {
            $(key, + "#bull-pen").show();
            allCharacters[key].healthPoints = allCharacters[key].initialHealthPoints;
            allCharacters[key].attackPower = allCharacters[key].counterAttackPower;
        }

        initializeGame();
        updateHealth();
        
    });

    $(".card").on("click", function() {

        if (!chooseHero && !chooseEnemy) return;

        $("#fight-commentary-1, #fight-commentary-2").empty();

        if (chooseHero) {
            heroKey = "." + this.classList[1]; //classList = ["card", "obi-wan"]
            hero = allCharacters[heroKey];
            chooseHero = false;
            $("#arena").append($(this).clone());
            $(this).hide();
            $("#instruction").html("Choose your first enemy");
            
        }
        else if ((chooseEnemy) && (this.classList[1] !== heroKey)) {
            enemyKey = "." + this.classList[1];
            enemy = allCharacters[enemyKey];
            chooseEnemy = false;
            $("#arena").append($(this).clone());
            $(this).hide();
            enemiesRemaining--;
            if (enemiesRemaining > 0) $("#instruction").html("Up next:");
        }
    });


    $("#attack").on("click", function() {

        if (chooseHero) {
            $("#fight-commentary-1").html("Choose your character first.");
            return;
        }
        else if (chooseEnemy) {
            $("#fight-commentary-1").html("Enemy not ready.");
            return;
        }

        // Hero attacks first
        enemy.healthPoints -= hero.attackPower;
        if (enemy.healthPoints < 1) {
            $(enemyKey, + "#arena").hide();
            $("#fight-commentary-1").html("You have defeated " + enemy.displayName + ".");
            if (enemiesRemaining > 0) {
                chooseEnemy = true;
                $("#fight-commentary-2").html("Choose your next enemy.");
            }
            else {
                $("#fight-commentary-2").html("You won the game!");
                $("#instruction").empty();
            }
            
        }
        else { // If the enemy is not defeated, it gets to attack second
            hero.healthPoints -= enemy.counterAttackPower;
            if (hero.healthPoints < 1) {
                $(heroKey, + "#arena").hide();
                $("#fight-commentary-1").html("You lost to " + enemy.displayName + ".");
                $("#fight-commentary-2").html("Game over.");
            }
            else {
                $("#fight-commentary-1").html("You attacked " + enemy.displayName + " for " + hero.attackPower + " damage.");
                $("#fight-commentary-2").html(enemy.displayName + " attacked you back for " + enemy.counterAttackPower + " damage.");
            }
        }
        updateHealth();
        hero.attackPower += hero.counterAttackPower;

    });


    initializeGame();
    updateHealth();


});