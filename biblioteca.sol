contract Library{
    struct Book {
        address originalOwner; // the person that uploaded the book to the DAO
        address currentOwner; // current owner of the book
        uint isbn; // unique code of the book
        uint copy; // the specific copy of the book registered on the contract
        bool available; // if the book is available for other users or not (you are still reading it)
    }
    
    uint maxBooks = 3; // Maximum number of books that a member can read at the same time
    
    mapping(address => bool) public members; // members of the shared library
    mapping(address => uint) public booksPerMember; // number of books that a member is reading at the moment
    Book[] public books; // list of books that are part of the library (search by bookId)
    mapping(uint => uint) public bookCopies; // number of copies of a book in the library (isbn -> numCopies)
    mapping(uint => mapping(uint => uint)) public bookIds; // to look for a specific book knowing its isbn and copy number ([isbn][copy] -> bookId)
    
    event e_NewMember(address newMember, address referer);
    event e_NewBookAvailable(uint isbn, uint copy, address member);
    event e_NewBookOwner(uint isbn, uint copy, address oldOwner, address newOwner);
    
    modifier only_current_members(address a) {
        if (members[a] == true) _
    }
    
    modifier max_books_per_member(address a) {
        if (booksPerMember[a] < maxBooks) _
    }
    
    modifier only_original_book_owner(uint isbn, uint copy) {
        if (books[bookIds[isbn][copy]].originalOwner == msg.sender) _
    }
    
    modifier only_book_owner(uint isbn, uint copy) {
        if (books[bookIds[isbn][copy]].currentOwner == msg.sender) _
    }
    
    modifier only_available_books(uint isbn, uint copy) {
        if (books[bookIds[isbn][copy]].available == true) _
    }
    
    modifier only_borrowed_books(uint isbn, uint copy) {
        if (books[bookIds[isbn][copy]].available == false) _
    }
    
    function Library() {
        // This is to deal with references where bookId=0
        books.push(Book({
            originalOwner: this,
            currentOwner: this,
            isbn: 0,
            copy: 0,
            available: false
        }));
        
        // The creator of the library is part of it
        members[msg.sender] = true;
    }
    
    // You need an invitation from a member to join the DAO
    function inviteMember(address newMember)
        only_current_members(msg.sender)
    {
        members[newMember] = true;
        
        e_NewMember(newMember, msg.sender);
    }
    
    // Register a new book in the DAO and make it available to borrow by other members
    function newBook(uint isbn)
        only_current_members(msg.sender)
    {
        bookCopies[isbn]++;
        uint copy = bookCopies[isbn];
        uint bookId = books.push(Book({
            originalOwner: msg.sender,
            currentOwner: msg.sender,
            isbn: isbn,
            copy: copy,
            available: true
        })) - 1;
        
        bookIds[isbn][copy] = bookId;
        
        e_NewBookAvailable(isbn, copy, msg.sender);
    }
    
    // Make a book you own available to other members.
    function lendBook(uint isbn, uint copy)
        only_book_owner(isbn, copy)
        only_borrowed_books(isbn, copy)
    {
        books[bookIds[isbn][copy]].available = true;
        booksPerMember[msg.sender]--;
        
        e_NewBookAvailable(isbn, copy, msg.sender);
    }
    
    // Take ownership of an available book to read it.
    function borrowBook(uint isbn, uint copy)
        only_current_members(msg.sender)
        max_books_per_member(msg.sender)
        only_available_books(isbn, copy)
    {
        books[bookIds[isbn][copy]].currentOwner = msg.sender;
        books[bookIds[isbn][copy]].available = false;
        booksPerMember[msg.sender]++;
        
        e_NewBookOwner(isbn, copy, msg.sender, msg.sender);
    }
}