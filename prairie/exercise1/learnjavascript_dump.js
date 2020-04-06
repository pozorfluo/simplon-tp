/**
 * @param {number} a
 * @param {number} b
 */
function sum(a, b){
    return a + b;
}

//sample usage
console.log(sum(1, 3));
console.log(sum(2, 5));
//------------------------------------------------------------------------------
/**
 * @param {number} a
 * @param {number} b
 */
function multiply(a, b){
    return a * b;
}

//sample usage
console.log(multiply(2, 4));
console.log(multiply(3, 2));
//------------------------------------------------------------------------------
/**
 * @param {string} name
 */
function getNameLength(name){
    return name.length ;
}

//sample usage
console.log(getNameLength("John"));
console.log(getNameLength("Argentina!"));
console.log(getNameLength("Macedonia"));
//------------------------------------------------------------------------------
/**
 * @param {string} name
 */
function nameInUpperCase(name){
    return name.toUpperCase();
}

//sample usage
console.log(nameInUpperCase("Jennifer"));
console.log(nameInUpperCase("Diego"));

//------------------------------------------------------------------------------
/**
 * @param {string} name
 */
function nameInLowerCase(name){
    return name.toLowerCase();
}

//sample usage
console.log(nameInLowerCase("Jennifer"));
console.log(nameInLowerCase("BELGIUM"));

//------------------------------------------------------------------------------
/**
 * @param {string} name
 */
function getFirstCharacter(name){
    return name[0];
}

//sample usage
console.log(getFirstCharacter("Blane"));
console.log(getFirstCharacter("Amsterdam"));

//------------------------------------------------------------------------------
/**
 * @param {string} name
 */
function getLastCharacter(name){
    return name[name.length - 1];
  }
  
  //sample usage
  console.log(getLastCharacter("John"));
  console.log(getLastCharacter("Jennifer"));
//------------------------------------------------------------------------------
/**
 * @param {string} name
 */
function skipFirstCharacter(name){
    return name.substring(1);
}

//sample usage
console.log(skipFirstCharacter("Iamsterdam"));

//------------------------------------------------------------------------------
/**
 * @param {string} name
 */
function getThreeChars(name){
    //start from the 2nd character
    return name.substring(1,4);
}

//sample usage
console.log(getThreeChars("Hello"));

//------------------------------------------------------------------------------
/**
 * @param {string} firstNameInitial
 * @param {string} lastNameInitial
 */
function concatInitials(firstNameInitial, lastNameInitial){
    return firstNameInitial + lastNameInitial;
}

//sample usage
console.log(concatInitials("J", "D"));

//------------------------------------------------------------------------------
/**
 * @param {string} name
 */
function sayHello(name){
    return `Hello ${name}`;
}

//sample usage
console.log(sayHello("John"));

//------------------------------------------------------------------------------
/**
 * @param {string} firstName
 * @param {string} lastName
 */
function getFullName(firstName, lastName){
    return `${firstName} ${lastName}`;
}

//sample usage
console.log(getFullName("John", "Doe"));

//------------------------------------------------------------------------------
function getMultilineString() {
    //move "are so powerful!" to a new line in the same string
    return `Template strings 
are so powerful!`;
}

//sample usage
console.log(getMultilineString());

//------------------------------------------------------------------------------
/**
 * @param {string} word
 */
function capitalize(word){
    return word[0].toUpperCase() + word.substring(1).toLowerCase();
}

//sample usage
console.log(capitalize("john")); //John
console.log(capitalize("BRAVO")); //Bravo
console.log(capitalize("BLAne")); //Blane
//------------------------------------------------------------------------------
/**
 * @param {string} text
 */
function removeExtraWhitespace(text){
    return text.trim();
}

//sample usage
console.log(removeExtraWhitespace(" What's up "));

//------------------------------------------------------------------------------
/**
 * @param {string} description
 */
function amsterdamIsFirstWord(description){
    return description.startsWith("Amsterdam");
}

//sample usage
console.log(amsterdamIsFirstWord("Amsterdam is the capital of NL"));

//------------------------------------------------------------------------------
/** @param {string} name */
export function getNumberOfChars(name) {
    // return the number of characters in: name
    return name.length;
}

export function getFirstChar(name) {
    // return the first character of: name
    return name[0];
}

export function getLastChar(name) {
    // return the last character of: name
    return name[name.length - 1];
}

export function getLower(name) {
    // return name all in lower case (example: "ABC" becomes "abc")
    return name.toLowerCase();
}

export function getUpper(name) {
    // return name all in upper case (example: "abc" becomes "ABC")
    return name.toUpperCase();
}

export function getCapitalized(name) {
    // return a capitalized version of name (example: "alEX" becomes "Alex")
    name = name.trim();
    return name[0].toUpperCase() + name.substring(1).toLowerCase();
}

export function getClean(name) {
    // return name without trailing and leading space (example: " alex " becomes: "alex")
    return name.trim();
}

//------------------------------------------------------------------------------
/**
 * @param {number} number
 */
function convertNumberToString(number){
    return number.toString();
}

//sample usage
console.log(convertNumberToString(42));
console.log(convertNumberToString(97));
console.log(convertNumberToString(11));

//------------------------------------------------------------------------------
/**
 * @param {string} string
 */
function convertStringToNumber(string){
    return parseInt(string);
}

//sample usage
console.log(convertStringToNumber("42"));
console.log(convertStringToNumber("97"));
console.log(convertStringToNumber("11"));

//------------------------------------------------------------------------------
/**
 * @param {number} a
 * @param {number} b
 */
function divideNumbers(a, b){
    return a / b;
}

//sample usage
console.log(divideNumbers(8, 2));
console.log(divideNumbers(10, 5));

//------------------------------------------------------------------------------
/**
 * @param {number} a
 * @param {number} b
 */
function divisionRemainder(a, b){
    return a % b;
}

//sample usage
console.log(divisionRemainder(7, 2));
console.log(divisionRemainder(10, 2));
//------------------------------------------------------------------------------
/**
 * @param {number} x
 */
function isEven(x){
    return x % 2 === 0;
}

//sample usage
console.log(isEven(4));
console.log(isEven(5));
console.log(isEven(6));
//------------------------------------------------------------------------------
/**
 * @param {number} x
 */
function isOdd(x){
    return x % 2 !== 0;
}

//sample usage
console.log(isOdd(4));
console.log(isOdd(5));
console.log(isOdd(6));

//------------------------------------------------------------------------------
function defineVariable(){
    //define a variable "count" with value 0
    let count = 0;
    //then increment it
    count++;
    //finally return it
    return count;
}

//------------------------------------------------------------------------------
function defineVariable(){
    //define a variable "ageLimit" with value 18 that cannot be re-assigned
    const ageLimit = 18;
}

//------------------------------------------------------------------------------
/**
 * @param {number} age
 */
function canVote(age){
    if (age >= 18) {
        return true;
    }
}

//sample usage
console.log(canVote(25));

//------------------------------------------------------------------------------
/**
 * @param {number} age
 */
function canVote(age){
    return age >= 18;
}

//sample usage
console.log(canVote(25));

//------------------------------------------------------------------------------
/**
 * @param {number} age
 */
function canVote(age){
    return age >= 18;
}

//sample usage
console.log(canVote(25)) ;

//------------------------------------------------------------------------------
/*
var items = [{name:"Smarties", code:"A01", quantity:10, price:0.60},
             {name:"Caramac Bar", code:"A02", quantity:5, price:0.60},
             {name:"Dairy Milk", code:"A03", quantity:1, price:0.65},
             {name:"Freddo", code:"A04", quantity:1, price:0.25},
             {name:"Cheese and Onion Crisps", code:"B06", quantity:0, price:0.25}];
*/
             
var items = {"A01" : {name:"Smarties", quantity:10, price:0.60},
             "A02" : {name:"Caramac Bar", quantity:5, price:0.60},
             "A03" : {name:"Dairy Milk", quantity:1, price:0.65},
             "A04" : {name:"Freddo", quantity:1, price:0.25},
             "B06" : {name:"Cheese and Onion Crisps", quantity:0, price:0.25}};  
             
function VendingMachine(items, money) {
  this.items = items;
  this.money = money;
};

VendingMachine.prototype.vend = function (selection, itemMoney){
  /* 5. If an invalid item is selected return "Invalid selection! : Money in vending machine = 11.20". 
   * Where 11.20 is the machines money float.
   */ 
  if ( !(selection in this.items) ) {
    return `Invalid selection! : Money in vending machine = ${this.money.toFixed(2)}`;
  }

  // 2. If the quantity is 0 for an item return "Item Name: Out of stock!". Where "Item Name" is the name of the item selected.
  if ( this.items[selection].quantity <= 0 ) {
    return `${this.items[selection].name}: Out of stock!`;
  }
  
  // 1. If the money given to the machine is less than the item cost return "Not enough money!"
  if ( itemMoney < this.items[selection].price ) {
    return "Not enough money!";
  }
  
  /* 4. If an item is correctly selected and there is no change needed then return "Vending Item Name". 
   *    Where "Item Name" is the name of the item.
   */
  if ( itemMoney === this.items[selection].price ) {
    return `Vending ${this.items[selection].name}`;
  } 
  /* 3. If an item is correctly selected return "Vending Item Name with 9.40 change.". 
   *    Where "Item Name" is the name of the item and change if any given.
   */
  else {
    const change = itemMoney - this.items[selection].price;
    
    /* Bonus. If the machine has not enough change ... */
    if ( change > this.money ) {
      return `Not enough change! : Money in vending machine = ${this.money.toFixed(2)}`;
    }
    
    this.money -= change;
    return `Vending ${this.items[selection].name} with ${change.toFixed(2)} change.`;
  }
   
};

var machine = new VendingMachine(items,10.00);

machine.vend("A02",0.40);

var machine = new VendingMachine(items,10.00);

console.log(machine.vend("A01",0.60));
console.log(machine.vend("A01",10.0));
console.log(machine.vend("Z01",0.41));
console.log(machine.vend("A02",0.40));
console.log(machine.vend("B06",4.60));
console.log(machine.vend("A01",40.60));
floaty = 4.56454545;
console.log(floaty.toFixed(2));
//------------------------------------------------------------------------------


var items = [{name:"Smarties", code:"A01", quantity:10, price:0.60},
             {name:"Caramac Bar", code:"A02", quantity:5, price:0.60},
             {name:"Dairy Milk", code:"A03", quantity:1, price:0.65},
             {name:"Freddo", code:"A04", quantity:1, price:0.25},
             {name:"Cheese and Onion Crisps", code:"B06", quantity:0, price:0.25}];
/*         
var items = {"A01" : {name:"Smarties", quantity:10, price:0.60},
             "A02" : {name:"Caramac Bar", quantity:5, price:0.60},
             "A03" : {name:"Dairy Milk", quantity:1, price:0.65},
             "A04" : {name:"Freddo", quantity:1, price:0.25},
             "B06" : {name:"Cheese and Onion Crisps", quantity:0, price:0.25}};  
*/             
function VendingMachine(items, money) {
  this.items = items;
  this.money = money;
};

VendingMachine.prototype.vend = function (selection, itemMoney){
  /* We're stuck with a weird datastructure for the problem, 
   * a hashtable with the slot as the key would probably make more sense,
   * but let's play along ...
   */
  const requested_item = this.items.find(item => item.code === selection);

  /* 5. If an invalid item is selected return "Invalid selection! : Money in vending machine = 11.20". 
   * Where 11.20 is the machines money float.
   */ 
  if ( !requested_item ) {
    return `Invalid selection! : Money in vending machine = ${this.money.toFixed(2)}`;
  }

  // 2. If the quantity is 0 for an item return "Item Name: Out of stock!". Where "Item Name" is the name of the item selected.
  if ( requested_item.quantity <= 0 ) {
    return `${requested_item.name}: Out of stock!`;
  }
  
  // 1. If the money given to the machine is less than the item cost return "Not enough money!"
  if ( itemMoney < requested_item.price ) {
    return "Not enough money!";
  }
  
  /* 4. If an item is correctly selected and there is no change needed then return "Vending Item Name". 
   *    Where "Item Name" is the name of the item.
   */
  if ( itemMoney === requested_item.price ) {
    this.money += itemMoney;
    return `Vending ${requested_item.name}`;
  } 
  /* 3. If an item is correctly selected return "Vending Item Name with 9.40 change.". 
   *    Where "Item Name" is the name of the item and change if any given.
   */
  else {
    const change = itemMoney - requested_item.price;
    
    /* Bonus. If the machine has not enough change ... */
    if ( change > this.money ) {
      return `Not enough change! : Money in vending machine = ${this.money.toFixed(2)}`;
    }
    
    this.money += itemMoney - change;
    return `Vending ${requested_item.name} with ${change.toFixed(2)} change.`;
  }
   
};


//------------------------------------------------------------------------------

var items = [{name:"Smarties", code:"A01", quantity:10, price:0.60},
             {name:"Caramac Bar", code:"A02", quantity:5, price:0.60},
             {name:"Dairy Milk", code:"A03", quantity:1, price:0.65},
             {name:"Freddo", code:"A04", quantity:1, price:0.25},
             {name:"Cheese and Onion Crisps", code:"B06", quantity:0, price:0.25}];
/*         
var items = {"A01" : {name:"Smarties", quantity:10, price:0.60},
             "A02" : {name:"Caramac Bar", quantity:5, price:0.60},
             "A03" : {name:"Dairy Milk", quantity:1, price:0.65},
             "A04" : {name:"Freddo", quantity:1, price:0.25},
             "B06" : {name:"Cheese and Onion Crisps", quantity:0, price:0.25}};  
*/             
function VendingMachine(items, money) {
  this.items = items;
  this.money = money;
};

VendingMachine.prototype.vend = function (selection, itemMoney){
  /* We're stuck with a weird datastructure for the problem, 
   * a hashtable with the slot as the key would probably make more sense,
   * but let's play along ...
   */
  const requested_item = this.items.find(item => item.code === selection);

  /* 5. If an invalid item is selected return "Invalid selection! : Money in vending machine = 11.20". 
   * Where 11.20 is the machines money float.
   */ 
  if ( !requested_item ) {
    return `Invalid selection! : Money in vending machine = ${this.money.toFixed(2)}`;
  }

  // 2. If the quantity is 0 for an item return "Item Name: Out of stock!". Where "Item Name" is the name of the item selected.
  if ( requested_item.quantity <= 0 ) {
    return `${requested_item.name}: Out of stock!`;
  }
  
  // 1. If the money given to the machine is less than the item cost return "Not enough money!"
  if ( itemMoney < requested_item.price ) {
    return "Not enough money!";
  }
  
  /* 4. If an item is correctly selected and there is no change needed then return "Vending Item Name". 
   *    Where "Item Name" is the name of the item.
   */
  if ( itemMoney === requested_item.price ) {
    this.money += itemMoney;
    return `Vending ${requested_item.name}`;
  } 
  /* 3. If an item is correctly selected return "Vending Item Name with 9.40 change.". 
   *    Where "Item Name" is the name of the item and change if any given.
   */
  else {
    const change = itemMoney - requested_item.price;
    
    /* Bonus. If the machine has not enough change ... */
    if ( change > this.money ) {
      return `Not enough change! : Money in vending machine = ${this.money.toFixed(2)}`;
    }
    
    this.money += itemMoney - change;
    return `Vending ${requested_item.name} with ${change.toFixed(2)} change.`;
  }
   
};
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------

//------------------------------------------------------------------------------

//------------------------------------------------------------------------------

//------------------------------------------------------------------------------

//------------------------------------------------------------------------------

//------------------------------------------------------------------------------

//------------------------------------------------------------------------------

//------------------------------------------------------------------------------

//------------------------------------------------------------------------------

//------------------------------------------------------------------------------

//------------------------------------------------------------------------------

//------------------------------------------------------------------------------

//------------------------------------------------------------------------------

//------------------------------------------------------------------------------

//------------------------------------------------------------------------------

//------------------------------------------------------------------------------

//------------------------------------------------------------------------------

//------------------------------------------------------------------------------

//------------------------------------------------------------------------------

//------------------------------------------------------------------------------

//------------------------------------------------------------------------------

//------------------------------------------------------------------------------

//------------------------------------------------------------------------------

//------------------------------------------------------------------------------

//------------------------------------------------------------------------------

//------------------------------------------------------------------------------

//------------------------------------------------------------------------------

//------------------------------------------------------------------------------

//------------------------------------------------------------------------------

//------------------------------------------------------------------------------

//------------------------------------------------------------------------------

//------------------------------------------------------------------------------

//------------------------------------------------------------------------------

//------------------------------------------------------------------------------

//------------------------------------------------------------------------------

//------------------------------------------------------------------------------

//------------------------------------------------------------------------------

//------------------------------------------------------------------------------

//------------------------------------------------------------------------------

//------------------------------------------------------------------------------

//------------------------------------------------------------------------------

//------------------------------------------------------------------------------

//------------------------------------------------------------------------------

//------------------------------------------------------------------------------

//------------------------------------------------------------------------------

//------------------------------------------------------------------------------

//------------------------------------------------------------------------------

//------------------------------------------------------------------------------

//------------------------------------------------------------------------------

//------------------------------------------------------------------------------

//------------------------------------------------------------------------------

//------------------------------------------------------------------------------

//------------------------------------------------------------------------------

//------------------------------------------------------------------------------

//------------------------------------------------------------------------------


