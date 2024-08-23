// Initialize auctions and bids arrays
const auctions = JSON.parse(localStorage.getItem('auctions')) || [];
const bids = JSON.parse(localStorage.getItem('bids')) || [];

// Function to display auctions
function displayAuctions() {
    const auctionContainer = document.getElementById('auctions');
    auctionContainer.innerHTML = '<h2>Active Auctions</h2>';

    auctions.forEach(auction => {
        const auctionElement = document.createElement('div');
        auctionElement.className = 'auction';
        auctionElement.innerHTML = `
            <h3>${auction.itemName}</h3>
            <p>${auction.description}</p>
            <p>Starting Price: $${auction.startingPrice}</p>
            <p>Current Price: $${auction.currentPrice || auction.startingPrice}</p>
            <button onclick="placeBid('${auction.id}')">Place Bid</button>
        `;
        auctionContainer.appendChild(auctionElement);
    });
}

// Function to create an auction
function createAuction() {
    const itemName = document.getElementById('itemName').value;
    const description = document.getElementById('description').value;
    const startingPrice = parseFloat(document.getElementById('startingPrice').value);

    if (itemName && description && startingPrice) {
        const auction = {
            id: Date.now().toString(),
            itemName,
            description,
            startingPrice,
            currentPrice: startingPrice
        };
        auctions.push(auction);
        localStorage.setItem('auctions', JSON.stringify(auctions));
        displayAuctions();
        clearForm();
    } else {
        alert('Please fill in all fields.');
    }
}

// Function to place a bid
function placeBid(auctionId) {
    const bidAmount = parseFloat(prompt('Enter your bid amount:'));
    if (isNaN(bidAmount) || bidAmount <= 0) {
        alert('Invalid bid amount.');
        return;
    }

    const auction = auctions.find(a => a.id === auctionId);
    if (bidAmount > auction.currentPrice) {
        auction.currentPrice = bidAmount;
        bids.push({ auctionId, bidAmount });
        localStorage.setItem('auctions', JSON.stringify(auctions));
        localStorage.setItem('bids', JSON.stringify(bids));
        displayAuctions();
    } else {
        alert('Bid amount must be higher than the current price.');
    }
}

// Function to clear the form
function clearForm() {
    document.getElementById('itemName').value = '';
    document.getElementById('description').value = '';
    document.getElementById('startingPrice').value = '';
}

// Initial display of auctions
displayAuctions();
