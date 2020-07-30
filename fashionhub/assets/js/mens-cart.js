let carts = document.querySelectorAll('.hub-cart')

let products = [
    {
        name: 'Solid Formal Black Shirt',
        tag: 'solidformalblackshirt',
        price: 40.00,
        inCart: 0,
        image: 'pm1.jpg'
    },
    {
        name: 'Solid Formal Brown Shirt',
        tag: 'solidformalbrownshirt',
        price: 24.99,
        inCart: 0,
        image: 'pm2.jpg'
    },
    {
        name: 'Solid Formal Green Shirt',
        tag: 'solidformalgreenshirt',
        price: 18.99,
        inCart: 0,
        image: 'pm3.jpg'
    },
    {
        name: 'Solid Formal Blue Shirt',
        tag: 'solidformalblueshirt',
        price: 21.99,
        inCart: 0,
        image: 'pm9.jpg'
    },
    {
        name: 'Black Casual Men\'s Blazer',
        tag: 'blackcasualmensblazer',
        price: 20.00,
        inCart: 0,
        image: 'pm11.jpg'
    },
    {
        name: 'Blue Wedding Formal Blazer',
        tag: 'blueweddingformalblazer',
        price: 35.00,
        inCart: 0,
        image: 'pm12.jpg'
    },
    {
        name: 'Grey Wedding Formal Blazer',
        tag: 'greyweddingformalblazer',
        price: 25.00,
        inCart: 0,
        image: 'pm7.jpg'
    },
    {
        name: 'Blue Casual Men\'s Blazer',
        tag: 'bluecasualmensblazer',
        price: 29.99,
        inCart: 0,
        image: 'pm13.jpg'
    },
    {
        name: 'Slim Fit Men\'s Black Trousers',
        tag: 'slimfitmensblacktrousers',
        price: 14.99,
        inCart: 0,
        image: 'pt1.jpg'
    },
    {
        name: 'Slim Fit Men\'s Denim Jeans',
        tag: 'slimfitmensdenimjeans',
        price: 24.99,
        inCart: 0,
        image: 'pt2.jpg'
    },
    {
        name: 'Slim Fit Men\'s Gold Trousers',
        tag: 'slimfitmensgoldtrousers',
        price: 14.99,
        inCart: 0,
        image: 'pt3.jpg'
    },
    {
        name: 'Slim Fit Men\'s Blue Trousers',
        tag: 'slimfitmensbluetrousers',
        price: 16.99,
        inCart: 0,
        image: 'pt4.jpg'
    },
    {
        name: 'Slim Fit Men\'s Black Jeans',
        tag: 'slimfitmensblackjeans',
        price: 21.99,
        inCart: 0,
        image: 'pt5.jpg'
    },
    {
        name: 'Slim Fit Men\'s Faded Black Jeans',
        tag: 'slimfitmensfadedblackjeans',
        price: 19.99,
        inCart: 0,
        image: 'pt6.jpg'
    },
    {
        name: 'Slim Fit Blue Trousers',
        tag: 'slimfitbluetrousers',
        price: 16.99,
        inCart: 0,
        image: 'pt7.jpg'
    },
    {
        name: 'Slim Fit Men\'s Dark Blue Jeans',
        tag: 'slimfitmensdarkbluejeans',
        price: 17.99,
        inCart: 0,
        image: 'pt8.jpg'
    }
]

for (let i = 0; i < carts.length; i++) {
    carts[i].addEventListener('click', () => {
        cartNumbers(products[i])
        totalCost(products[i])
    })
}

function cartNumbers(product) {

    let productNumbers = localStorage.getItem('cartNumbers')

    productNumbers = parseInt(productNumbers)

    if (productNumbers) {
        localStorage.setItem('cartNumbers', productNumbers + 1)
    } else {
        localStorage.setItem('cartNumbers', 1)
    }

    setItems(product)
}

function setItems(product) {
    let cartItems = localStorage.getItem('productsInCart')
    cartItems = JSON.parse(cartItems)

    if (cartItems != null) {

        if (cartItems[product.tag] == undefined) {
            cartItems = {
                ...cartItems,
                [product.tag]: product
            }
        }

        cartItems[product.tag].inCart += 1
    } else {
        product.inCart = 1
        cartItems = {
            [product.tag]: product
        }
    }

    localStorage.setItem("productsInCart", JSON.stringify(cartItems))
}

function totalCost(product) {
    // console.log("The product price is", product.price)
    let cartCost = localStorage.getItem('totalCost')

    let totalCost = 0

    if (cartCost != null) {
        cartCost = parseFloat(cartCost)
        totalCost = cartCost + product.price
        localStorage.setItem("totalCost", totalCost.toFixed(2))
    } else {
        localStorage.setItem("totalCost", product.price);
    }

}


function displayCart() {
    let cartItems = localStorage.getItem("productsInCart");
    let cartNumbers = localStorage.getItem("cartNumbers");
    let cartBody = document.getElementById("shoppingcart");
    let cartSummary = document.getElementById("shopping-summary");
    let productCountBody = document.getElementById("productCount")
    let dataHtml = '';
    let summaryHtml = '';
    cartItems = JSON.parse(cartItems);
    let count = 0;


    if (cartItems && cartBody && cartSummary) {

        let subtotal = 0
        let taxes = 0
        let grandtotal = 0

        subtotal = localStorage.getItem("totalCost");
        subtotal = parseFloat(subtotal)
        taxes = (subtotal * 0.13).toFixed(2);
        grandtotal = parseFloat(subtotal) + parseFloat(taxes);
        localStorage.setItem("grandTotal", grandtotal.toFixed(2))
        count = 1;
        Object.values(cartItems).map(item => {
            dataHtml += `
            <tr class="rem1">
                <td class="invert">${count}</td>
                    <td class="invert-image">
                                    <a href="single_product.html">
                                        <img src="images/${item.image}" alt=" " class="img-responsive">
                                    </a>
                                </td>
                                <td class="invert">
                                    <div class="quantity">
                                        <div class="quantity-select">
                                            <div class="entry value-minus">&nbsp;</div>
                                            <div class="entry value">
                                                <span>${item.inCart}</span>
                                            </div>
                                            <div class="entry value-plus active">&nbsp;</div>
                                        </div>
                                    </div>
                                </td>
                                <td class="invert">${item.name}</td>

                                <td class="invert">${item.price.toFixed(2)}</td>
                                <td class="invert">
                                    <div class="rem">
                                    <button type="submit" class="close">X
                                </button>
                                    </div>

                                </td>
                            </tr>
                            `;
            cartBody.innerHTML = dataHtml;
            count++;
        })

        

        cartSummary.innerHTML += `
        <li>Subtotal
            <i>:</i>
            <span>$${subtotal.toFixed(2)}</span>
        </li>
        <li>Taxes (13%)
            <i>:</i>
            <span>$${taxes}</span>
        </li>
        <hr>
        <li id="grandTotal">Total
            <i>:</i>
            <span><b>$${grandtotal.toFixed(2)}</b></span>
        </li>`;

        
       productCountBody.innerHTML = '';
       productCountBody.innerHTML += `
       Your shopping cart contains: <span>${cartNumbers} Products</span>
       `;        
    }
}

displayCart();