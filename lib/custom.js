// Load web3
if (typeof web3 !== 'undefined') {
  web3 = new Web3(web3.currentProvider);
} else {
  web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}

// Instantiate the JS object to call the contract
var abi = [ { "constant": true, "inputs": [ { "name": "", "type": "address" } ], "name": "members", "outputs": [ { "name": "", "type": "bool", "value": false } ], "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "address" } ], "name": "booksPerMember", "outputs": [ { "name": "", "type": "uint256", "value": "0" } ], "type": "function" }, { "constant": false, "inputs": [ { "name": "isbn", "type": "uint256" }, { "name": "copy", "type": "uint256" } ], "name": "lendBook", "outputs": [], "type": "function" }, { "constant": false, "inputs": [ { "name": "newMember", "type": "address" } ], "name": "inviteMember", "outputs": [], "type": "function" }, { "constant": false, "inputs": [ { "name": "isbn", "type": "uint256" }, { "name": "copy", "type": "uint256" } ], "name": "borrowBook", "outputs": [], "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "uint256" } ], "name": "books", "outputs": [ { "name": "originalOwner", "type": "address", "value": "0xa871297f33cbd355c15522e7083656754f8fe871" }, { "name": "currentOwner", "type": "address", "value": "0xa871297f33cbd355c15522e7083656754f8fe871" }, { "name": "isbn", "type": "uint256", "value": "0" }, { "name": "copy", "type": "uint256", "value": "0" }, { "name": "available", "type": "bool", "value": false } ], "type": "function" }, { "constant": false, "inputs": [ { "name": "isbn", "type": "uint256" } ], "name": "newBook", "outputs": [], "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "uint256" }, { "name": "", "type": "uint256" } ], "name": "bookIds", "outputs": [ { "name": "", "type": "uint256", "value": "0" } ], "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "uint256" } ], "name": "bookCopies", "outputs": [ { "name": "", "type": "uint256", "value": "0" } ], "type": "function" }, { "inputs": [], "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "newMember", "type": "address" }, { "indexed": false, "name": "referer", "type": "address" } ], "name": "e_NewMember", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "isbn", "type": "uint256" }, { "indexed": false, "name": "copy", "type": "uint256" }, { "indexed": false, "name": "member", "type": "address" } ], "name": "e_NewBookAvailable", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "isbn", "type": "uint256" }, { "indexed": false, "name": "copy", "type": "uint256" }, { "indexed": false, "name": "oldOwner", "type": "address" }, { "indexed": false, "name": "newOwner", "type": "address" } ], "name": "e_NewBookOwner", "type": "event" } ];
var MyContract = web3.eth.contract(abi);
var myContractInstance = MyContract.at("0xa871297f33CBd355C15522E7083656754F8fE871");

$(function() {
  // Set a default account
  web3.eth.defaultAccount = web3.eth.accounts[0];
  
  // Checks if the user is a member of the DAO
  checkUser();
  
  // To load the books
  loadBooks();
});

/* Functions to interact with the contract */

function checkUser() {
  var addr = web3.eth.defaultAccount;
  
  if(!myContractInstance.members(addr))
    showInfo("No eres miembro del DAO", true);  
}

function invite(){
  var addr = $("#userAddr").val();
  
  myContractInstance.inviteMember(addr);
}

function newBook() {
  var isbn = $("#newIsbn").val();
  
  myContractInstance.newBook(isbn);
}

function borrowBook(element) {
  var parent = element.closest(".book");
  
  var isbn = $(parent).children(".isbn")[0].innerHTML;
  var copy = $(parent).children(".copy")[0].innerHTML;
  
  myContractInstance.borrowBook(isbn, copy);
}

function lendBook(element) {
  var parent = element.closest(".book");
  
  var isbn = $(parent).children(".isbn")[0].innerHTML;
  var copy = $(parent).children(".copy")[0].innerHTML;
  
  myContractInstance.lendBook(isbn, copy);
}

// Load all books from the blockchain to the page.
function loadBooks(){
  var owner, isbn, copy, available;  
  var i = 1;
  
  while(myContractInstance.books(i)[0] != "0x"){
    owner = myContractInstance.books(i)[1];
    isbn = myContractInstance.books(i)[2];
    copy = myContractInstance.books(i)[3];
    available = myContractInstance.books(i)[4];
    
    if(available)
      addDaoBook(owner, isbn, copy);
    else if(owner == web3.eth.defaultAccount)
      addMyBook(isbn, copy);
    
    i++;
  }
}

/* Functions to interact with the HTML */

function showInfo(msg, isError){  
  var msgClass = "alert-info";
  
  if(isError)
    msgClass = "alert-danger";

  var html = '<div class="alert ' + msgClass + ' alert-dismissible" role="alert">'
            +   '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>'
            +   '<b>' + msg + '</b><br>'
            + '</div>';
            
  $("#info").html(html);
}

function addDaoBook(currentOwner, isbn, copy){ 
  var id = isbn + '-' + copy;
  
  var html = '<div class="book" id="' + id + '">'
            +   '<b>ISBN (copy):</b> <span class="isbn">' + isbn + '</span> (<span class="copy">' + copy + '</span>)<br>'
            +   '<b>Dueño:</b> <span class="owner">' + currentOwner + '</span><br>'
            +   '<button class="btn btn-default" onclick="borrowBook(this)">Reservar</button>'
            + '</div>';
            
  $("#booksInDao").append(html);
}

function addMyBook(isbn, copy){  
  var id = isbn + '-' + copy;

  var html = '<div class="book" id="' + id + '">'
            +   '<b>ISBN (copy):</b> <span class="isbn">' + isbn + '</span> (<span class="copy">' + copy + '</span>)<br>'
            +   '<button class="btn btn-default" onclick="lendBook(this)">Liberar</button>'
            + '</div>';
            
  $("#myBooks").append(html);
}

/* To watch for events */

myContractInstance.e_NewMember(function(error, result) {
  if (!error){
    showInfo("Hay un nuevo miembro en el DAO", false);
    console.log(result.args);
  }
});

myContractInstance.e_NewBookAvailable(function(error, result) {
  if (!error){
    showInfo("Hay un nuevo libro disponible", false);
    console.log(result.args);
  }
});

myContractInstance.e_NewBookOwner(function(error, result) {
  if (!error){
    showInfo("Se ha comenzado a leer un libro", false);
    console.log(result.args);
  }
});