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
let arr = [];
let arrTemp = [];
let totalPot = 0;

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
    0: ["5%","42%","2%","42.5%","18%","52%","0%","42.3%","48%","10%","19%","43%"],// seat 1
    1: ["8%","58%","6%","58.5%","20%","56%","3%","58.5%","64.2%","13%","21%","58%"],// seat 2
    2: ["25%","72%","22.5%","72.5%","30%","70%","19%","72.5%","78.2%","30%","31.5%","65%"],// seat 3
    3: ["52%","73%","50%","73.5%","52%","70%","46.5%","73.5%","79.2%","57%","45%","65%"],// seat 4
    4: ["70%","60%","68%","60.5%","71%","57.5%","65%","60.5%","66.2%","75%","59%","55%"],// seat 5
    5: ["70%","25%","68%","25.5%","71%","38%","65%","25.5%","31.2%","75%","58%","35%"],// seat 6
    6: ["52%","11%","50%","11.5%","50%","24%","46.5%","11.5%","17.2%","57%","48%","26.5%"],// seat 7
    7: ["25%","12%","23%","12.5%","38%","24%","20%","12.5%","18.2%","30%","29%","24.5%"],// seat 8
    8: ["8%","25%","6%","25.5%","23%","35%","3%","25.5%","31.2%","13%","19%","28%"]// seat 9
}

// turns hand history into an array separated by newlines
function setArr(){
    let hand = sessionStorage.getItem("hand");
    arrTemp = hand.split('\n');
    for(let i = 0; i < arrTemp.length; i++){
        arr.push(arrTemp[i].split(' '));
    }
    setFinalSeatLine();
    right();

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
        document.getElementById(boxShort).style.borderStyle = "solid";
        document.getElementById(boxShort).style.borderWidth = "large";
        document.getElementById(boxShort).style.borderColor = "black";
        document.getElementById(boxShort).style.position = "fixed";
        document.getElementById(boxShort).style.top = percentages[0];
        document.getElementById(boxShort).style.left = percentages[1];

        // name
        document.getElementById(nameShort).style.fontSize = "120%";
        document.getElementById(nameShort).style.position = "fixed";
        document.getElementById(nameShort).style.color = "black";
        document.getElementById(nameShort).style.top = percentages[2];
        document.getElementById(nameShort).style.left = percentages[3];

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
        document.getElementById(bal).style.position = "fixed";
        document.getElementById(bal).style.top = percentages[9];
        document.getElementById(bal).style.left = percentages[3];

        // bet location
        document.getElementById(bet).style.color = "white";
        document.getElementById(bet).style.fontSize = "120%";
        document.getElementById(bet).style.position = "fixed";
        document.getElementById(bet).style.top = percentages[10];
        document.getElementById(bet).style.left = percentages[11];
    }
}

// sets finalSeatLine to the final line for seating in arr
function setFinalSeatLine(){
    while(arr[finalSeatLine][0] == "Seat"){
        finalSeatLine++;
    }
    finalSeatLine--;
}

// "next" button is clicked
function right(){
    if(line >= arr.length) return;

    if(line <= 1){
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
        while(arr[1][i] != "Seat"){
            i++;
        }
        i++;
        s = arr[1][i].slice(1,arr[1][i].length);
        let btn = document.getElementById("btn");
        btn.style.top = locations[parseInt(s) - 1][4];
        btn.style.left = locations[parseInt(s) - 1][5];
        line = 2;
    }
    else if(line <= finalSeatLine){
        document.getElementById("btn").style.display = "block";
        line = 2;
        for(let i = line; i < finalSeatLine + 1; i++){
            let s = arr[i][1];
            let player = arr[i][2]
            let bal = arr[i][3].slice(1,arr[i][3].length);

            let num = parseInt(s.slice(0, s.length - 1)) - 1;
            pairs[parseInt(num)] = [player];

            // name appears
            document.getElementById("name" + num).innerHTML = player;

            // block appears
            document.getElementById("box" + num).style.display = "block";
            
            // adds balance to pairs hashtable
            pairs[parseInt(num)].push(parseFloat(bal));

            // balance appears
            document.getElementById("bal" + num).innerHTML = bal;
            document.getElementById("bal" + num).style.display = "block";
        }
        line = finalSeatLine + 1;
    }
    else if(line == finalSeatLine + 1){
        totalPot += parseFloat(arr[line][4]);
        let numValue = getPlayerNumValue(arr[line][0].slice(0,arr[line][0].length - 1));
        document.getElementById("bet" + numValue).innerHTML = arr[line][4];
        line++;
    }
    else if(line == finalSeatLine + 2){
        totalPot += parseFloat(arr[line][4]);
        let numValue = getPlayerNumValue(arr[line][0].slice(0,arr[line][0].length - 1));
        document.getElementById("bet" + numValue).innerHTML = arr[line][4];
        line++;
    }
    // hole cards
    else if(line <= finalSeatLine + 4){
        line = finalSeatLine + 4;
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
    }
}

// returns seat number (0-8) given player name
function getPlayerNumValue(playerName){
    for(let i = 0; i < 9; i++){
        if(pairs[i][0] == playerName){
            return i;
        }
    }
}
function left(){
    alert(pairs[1][0].toString() + pairs[1][1]);
}
