// first page function, transfers hand data to second page
// via sessionStorage, changes window to second page
function getValue(){
    let hand = document.getElementById("hand_data").value;
    sessionStorage.setItem("hand", hand);
    window.location = "tablePage/table.html";
}

// initializations
let line = 0;
let finalSeatLine = 2;
let holeLine = 0;
let arr = [];
let arrTemp = [];
let totalPot = 0;
let rake = 0;
let toggle = -1;
let potUpdated = [0,0,0,0,0,0,0,0,0];
let collectCount = 0;

// if not null:
// 0-1: players name (string), players balance (float)
let pairs = {
    0:null,
    1:null,
    2:null,
    3:null,
    4:null,
    5:null,
    6:null,
    7:null,
    8:null
};

// maps number to the positions of where their box, name, button, and cards should go (indices)
// 0-1: box top, box left,
// 2-3: name top, name/bal left,
// 4-5: btn top, btn left,
// 6-8: left/right card top, left card left, right card left
// 9: bal top
// 10-11: bet top, bet left
let locations = {
    0: ["5%","42%","5%","42.5%","18%","52%","0%","42.3%","48%","10%","19%","43%"],// seat 1
    1: ["8%","58%","9%","58.5%","20%","56%","3%","58.5%","64.2%","13%","21%","58%"],// seat 2
    2: ["25%","72%","25.5%","72.5%","30%","70%","19%","72.5%","78.2%","30%","31.5%","65%"],// seat 3
    3: ["52%","73%","53%","73.5%","52%","70%","46.5%","73.5%","79.2%","57%","45%","65%"],// seat 4
    4: ["70%","60%","71%","60.5%","71%","57.5%","65%","60.5%","66.2%","75%","59%","55%"],// seat 5
    5: ["70%","25%","71%","25.5%","71%","38%","65%","25.5%","31.2%","75%","58%","35%"],// seat 6
    6: ["52%","11%","53%","11.5%","50%","24%","46.5%","11.5%","17.2%","57%","48%","26.5%"],// seat 7
    7: ["25%","12%","26%","12.5%","38%","24%","20%","12.5%","18.2%","30%","29%","24.5%"],// seat 8
    8: ["8%","25%","9%","25.5%","23%","35%","3%","25.5%","31.2%","13%","19%","28%"]// seat 9
}

// turns hand history into an array separated by newlines
function setArr(){
    let hand = sessionStorage.getItem("hand");
    arrTemp = hand.split('\n');
    for(let i = 0; i < arrTemp.length; i++){
        if(arrTemp[i].includes("***") && arrTemp[i].includes("SUMMARY")) break;
        arr.push(arrTemp[i].split(' '));
    }

    // set attributes of box and name
    for(let i = 0; i < 9; i++){
        let percentages = locations[i];
        let boxShort = "box" + i.toString();
        let nameShort = "name" + i.toString();
        let cardLeft = "card" + i + 0;
        let cardRight = "card" + i + 1;
        let bal = "bal" + i;
        let bet = "bet" + i;

        // box
        document.getElementById(boxShort).style.display = "none"; // block
        document.getElementById(boxShort).style.backgroundColor = "lightblue";
        document.getElementById(boxShort).style.width = "12%";
        document.getElementById(boxShort).style.height = "12%";
        document.getElementById(boxShort).style.position = "fixed";
        document.getElementById(boxShort).style.top = percentages[0];
        document.getElementById(boxShort).style.left = percentages[1];

        // name

        document.getElementById(nameShort).style.fontSize = "120%";
        document.getElementById(nameShort).style.color = "black";
		/*
        document.getElementById(nameShort).style.position = "fixed";
        document.getElementById(nameShort).style.top = percentages[2];
        document.getElementById(nameShort).style.left = percentages[3];
		*/

        // left card
        document.getElementById(cardLeft).style.display = "none";
        document.getElementById(cardLeft).style.height = "15%";
        document.getElementById(cardLeft).style.width = "5.5%";
        document.getElementById(cardLeft).style.position = "fixed";
        document.getElementById(cardLeft).style.top = percentages[6];
        document.getElementById(cardLeft).style.left = percentages[7];

        // right card
        document.getElementById(cardRight).style.display = "none";
        document.getElementById(cardRight).style.height = "15%";
        document.getElementById(cardRight).style.width = "5.5%";
        document.getElementById(cardRight).style.position = "fixed";
        document.getElementById(cardRight).style.top = percentages[6];
        document.getElementById(cardRight).style.left = percentages[8];

        // balance of player
        document.getElementById(bal).style.display = "none";
        document.getElementById(bal).style.fontSize = "150%";
		/*
        document.getElementById(bal).style.position = "fixed";
        document.getElementById(bal).style.top = percentages[9];
        document.getElementById(bal).style.left = percentages[3];
		*/

        // bet location
        document.getElementById(bet).style.color = "white";
        document.getElementById(bet).style.fontSize = "120%";
        document.getElementById(bet).style.position = "fixed";
        document.getElementById(bet).style.top = percentages[10];
        document.getElementById(bet).style.left = percentages[11];
    }

    findRake();
    setFinalSeatLine();
    right();
}

// "next" button is clicked
function right(){
    // combines players winnings with their balance, not included in text
    if(line >= arr.length){
        for(let i = 0; i < 9; i++){
            if(document.getElementById("bet" + i).innerHTML.length > 0){
                let total = parseFloat(document.getElementById("bet" + i).innerHTML);
                document.getElementById("bet" + i).innerHTML = "";
                updateBalance(0 - total, i);
                break;
            }
        }
    }
    // puts some info about the game on screen
    else if(line <= 1){
        let s = "";
        let i = 0;
        while(arr[0][i] != "-"){
            s += arr[0][i] + " ";
            i++;
            // shouldnt ever go over 10
            if(i > 10) break;
        }
        document.getElementById("topLeft").innerHTML = s;
        i = 0;
        // goes to first seat line
        while(arr[1][i] != "Seat"){
            i++;
        }
        i++;
        // moves button to correct location
        s = arr[1][i].slice(1,arr[1][i].length);
        let btn = document.getElementById("btn");
        btn.style.top = locations[parseInt(s) - 1][4];
        btn.style.left = locations[parseInt(s) - 1][5];
        line = 2;
    }
    // seats the players, reveals balances
    else if(line <= finalSeatLine){
        document.getElementById("btn").style.display = "block";
        line = 2;
        for(let i = line; i < finalSeatLine + 1; i++){
            let s = arr[i][1];
            let player = arr[i][2]
            let bal = arr[i][3].slice(1,arr[i][3].length);

            let num = parseInt(s.slice(0, s.length - 1)) - 1;
            pairs[num] = [player];

            // name appears
            document.getElementById("name" + num).innerHTML = player;

            // block appears
            document.getElementById("box" + num).style.display = "block";

            // adds balance to pairs hashtable
            pairs[num].push(removeComma(bal));

            // balance appears
            document.getElementById("bal" + num).innerHTML = removeComma(bal);
            document.getElementById("bal" + num).style.display = "block";
        }
        line = finalSeatLine + 1;
    }
    // post small / big blind or ante
    else if(arr[line][1] == "posts"){
        if(arr[line][2] == "small"){
            collectBets();
        }
        totalPot += parseFloat(removeComma(arr[line][4]));
        let numValue = getPlayerNumValue(arr[line][0].slice(0,arr[line][0].length - 1));
        // updates the players balance
        updateBalance(parseFloat(arr[line][4]), numValue);
        //update bet value
        document.getElementById("bet" + numValue).innerHTML = removeComma(arr[line][4]);
        line++;
    }
    // reveals hole cards, shows hero's hole cards
    else if(line <= holeLine){
        line = holeLine;
        let firstCard = arr[line][3].slice(1,arr[line][3].length);
        let secondCard = arr[line][4].slice(0,arr[line][3].length - 1);
        for(let i = 0; i < 9; i++){
            if(pairs[i] == null) continue;
            if(pairs[i][0] == arr[line][2]){
                document.getElementById("card" + i + 0).src = "../images/cards/" + firstCard + ".jpg";
                document.getElementById("card" + i + 1).src = "../images/cards/" + secondCard + ".jpg";
            }
            // cards appear
            document.getElementById("card" + i + 0).style.display = "block";
            document.getElementById("card" + i + 1).style.display = "block";
        }
        line++;
    }

    // from second line of hole cards to end
    else if(line < arr.length){
        let identifier = arr[line][1];
        let name = arr[line][0].replace(':', '');
        let num = getPlayerNumValue(name);
        // player folds, remove them, make the box gray
        if(identifier == "folds" || identifier == "mucks"){
            document.getElementById("box" + num).style.backgroundColor = "gray";
            document.getElementById("card" + num + 0).style.display = "none";
            document.getElementById("card" + num + 1).style.display = "none";
        }
        // player raises or bets, change color to red and put out bet
        else if(identifier == "raises" || identifier == "bets"){
            document.getElementById("box" + num).style.backgroundColor = "lightcoral";
            let raiseAmount = parseFloat(removeComma(arr[line][2]));
            totalPot += raiseAmount;
            updateBalance(raiseAmount, num);
            if(identifier == "raises"){
                document.getElementById("bet" + num).innerHTML = removeComma(arr[line][4]);
            }
            if(identifier == "bets"){
                document.getElementById("bet" + num).innerHTML = removeComma(arr[line][2]);
            }
        }
        // calls (difference between the opponents bet and their current bet)
        else if(identifier == "calls"){
            document.getElementById("box" + num).style.backgroundColor = "lightsalmon";
            let callAmount = parseFloat(removeComma(arr[line][2]));
            totalPot += callAmount
            updateBalance(callAmount, num);
            let firstAdd = document.getElementById("bet" + num).innerHTML;
            if(firstAdd.length == 0){
                firstAdd = "0";
            }
            let totalAdd = parseFloat(firstAdd) + parseFloat(callAmount);
            document.getElementById("bet" + num).innerHTML = totalAdd.toString();
        }
        // checks, just changes box color
        else if(identifier == "checks"){
            document.getElementById("box" + num).style.backgroundColor = "lightgreen";
        }
        // uncalled bet returned
        else if(identifier == "bet"){
            name = arr[line][5];
            num = getPlayerNumValue(name);
            document.getElementById("bet" + num).innerHTML = "";
            let betReverse = 0 - parseFloat(removeComma(arr[line][2].slice(1, arr[line][2].length - 1)));
            updateBalance(betReverse, num);

            // update totalPot
            totalPot += parseFloat(betReverse.toFixed(2));
            document.getElementById("pot").innerHTML = "Total Pot: " + totalPot.toString();

            line++;
            right();
            return;
        }
        // if player shows, reveal their cards
        else if(identifier == "shows"){
            let firstShow = arr[line][2].slice(1, arr[line][2].length);
            let secondShow = arr[line][3].slice(0, arr[line][3].length - 1);
            document.getElementById("card" + num + 0).src = "../images/cards/" + firstShow + ".jpg";
            document.getElementById("card" + num + 1).src = "../images/cards/" + secondShow + ".jpg";
        }
        // collects their winnings, move winnings to bet location
        else if(identifier == "collected"){
            potUpdated[num] += parseFloat(removeComma(arr[line][2]));
            document.getElementById("bet" + num).innerHTML = potUpdated[num].toString();
            document.getElementById("rake").innerHTML = "Rake: " + rake.toString();
            document.getElementById("rake").style.display = "block";
        }
        // (*** SHOW DOWN ***)
        else if(identifier == "SHOW"){
            collectBets();
            line++;
            right();
            return;
        }
        // (*** RIVER ***)
        else if(identifier == "RIVER"){
            collectBets();
            let riverCard = arr[line][7].slice(1,arr[line][7].length - 1);
            document.getElementById("river").src = "../images/cards/" + riverCard + ".jpg";
            document.getElementById("river").style.display = "block";
        }
        // (*** TURN ***)
        else if(identifier == "TURN"){
            collectBets();
            let turnCard = arr[line][6].slice(1,arr[line][6].length - 1);
            document.getElementById("turn").src = "../images/cards/" + turnCard + ".jpg";
            document.getElementById("turn").style.display = "block";
        }
        // (*** FLOP ***), collects bets, does flop
        else if(identifier == "FLOP"){
            collectBets();
            let threeArr = [arr[line][3].slice(1),
            arr[line][4],
            arr[line][5].slice(0, arr[line][5].length - 1)];
            for(let i = 0; i < 3; i++){
                document.getElementById("flop" + i).src = "../images/cards/" + threeArr[i] + ".jpg";
                document.getElementById("flop" + i).style.display = "block";
            }
        }
        // sometimes non important text is there, this speeds it up
        else{
            line++;
            right();
            return;
        }
        line++;
    }
}

// returns seat number (0-8) given player name
function getPlayerNumValue(playerName){
    for(let i = 0; i < 9; i++){
        if(pairs[i] == null){
            continue;
        }
        if(pairs[i][0] == playerName){
            return i;
        }
    }
}

// sets finalSeatLine to the final line for seating in arr
function setFinalSeatLine(){
    while(arr[finalSeatLine][0] == "Seat"){
        finalSeatLine++;
    }
    finalSeatLine--;

    // sets holeLine
    while(arr[holeLine][1] != "HOLE"){
        holeLine++;
    }
    holeLine++;
}

// updates player's balance given the bet size (float) and their player number (int)
function updateBalance(betSize, playerNumValue){
    betSize = betSize.toFixed(2);
    pairs[playerNumValue][1] -= betSize;
    document.getElementById("bal" + playerNumValue).innerHTML = parseFloat(pairs[playerNumValue][1]).toFixed(2);
}

// removes commas from string s
function removeComma(s){
    let returnString = ""
    for(let i = 0; i < s.length; i++){
        if(s[i] != ','){
            returnString += s[i];
        }
    }
    return returnString;
}
// hides all bets, reveals new totalPot value
// also resets colors of non-folded hands to light blue (default)
function collectBets(){
    document.getElementById("pot").style.display = "block";
    document.getElementById("pot").innerHTML = "Total Pot: " +
    // rounds to 2 digits
    (Math.round((totalPot + Number.EPSILON) * 100) / 100).toString();
    for(let i = 0; i < 9; i++){
        document.getElementById("bet" + i).innerHTML = "";
        if(document.getElementById("box" + i).style.backgroundColor != "gray"){
            document.getElementById("box" + i).style.backgroundColor = "lightblue";
        }
    }
}

// finds rake value
function findRake(){
    for(let i = 0; i < arrTemp.length; i++){
        if(arrTemp[i].includes("Rake")){
            let rakeArr = arrTemp[i].split(' ');
            for(let i = 0; i < rakeArr.length; i++){
                if(rakeArr[i] == "Rake"){
                    rake = parseFloat(rakeArr[i + 1]);
                    break;
                }
            }
            return;
        }
    }
}

// sleeps for (ms) milliseconds
// source: https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// reset button pushed
function reset(){
    location.reload();
}

// play/pause button pushed
function left(){
    toggle *= -1;
    // toggle off
    if(toggle < 0){
        document.getElementById("pauseChamp").innerHTML = "Play";
    }
    // toggle on
    else{
        document.getElementById("pauseChamp").innerHTML = "Pause";
        go();
    }
}

// runs until toggle is toggled off or reaches end
async function go(){
    while(line <= arr.length && toggle > 0){
        // split these up to make it teleport less if button is spammed
        await sleep(625);
        if(line <= arr.length && toggle > 0){
            right();
        }
        await sleep(625);
    }
}
