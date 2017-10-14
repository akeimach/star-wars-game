



function Character(displayName, healthPoints, initialHealthPoints, attackPower, counterAttackPower) {
    this.displayName = displayName;
    this.healthPoints = healthPoints;
    this.initialHealthPoints = initialHealthPoints;
    this.attackPower = attackPower;
    this.counterAttackPower = counterAttackPower;
}


var allCharacters = {
    ".obi-wan": new Character("Obi-Wan Kenobi", 120, 120, 8, 8),
    ".luke-sky": new Character("Luke Skywalker", 100, 100, 5, 5),
    ".darth-sid": new Character("Darth Sidious", 150, 150, 20, 20),
    ".darth-maul": new Character("Darth Maul", 180, 180, 25, 25)
}



$(document).ready(function(){

    var hero;
    var enemy;
    var heroKey;
    var enemyKey;
    var chooseHero;
    var chooseEnemy;


    function initializeGame() {
        hero = null;
        enemy = null;
        heroKey = "";
        enemyKey = "";
        chooseHero = true;
        chooseEnemy = true;
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
            $("#instruction").html("Up next:");
            $("#fight-commentary-1").empty();
        }
    });


    $("#attack").on("click", function() {

        if (chooseEnemy) {
            $("#fight-commentary-1").html("Enemy not ready");
            return;
        }
        // Hero attacks first
        enemy.healthPoints -= hero.attackPower;
        if (enemy.healthPoints < 1) {
            $("#fight-commentary-1").html("You have defeated " + enemy.displayName + ", choose your next enemy.");
            $("#fight-commentary-2").empty();
            $(enemyKey, + "#arena").hide();
            $("#instruction").html("Choose your character");
            chooseEnemy = true;
        }
        else {
            hero.healthPoints -= enemy.counterAttackPower;
            if (hero.healthPoints < 1) {
                $("#fight-commentary-1").html("You lost to " + enemy.displayName + ", game over.");
                $("#fight-commentary-2").empty();
                $(heroKey, + "#arena").hide();
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