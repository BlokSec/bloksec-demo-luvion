let carts = document.querySelectorAll('.hub-cart')

let products = [
    {
        name: 'Self Design Women\'s Tunic',
        tag: 'selfdesignwomenstunic',
        price: 28.00,
        inCart: 0,
        image: 'pf1.jpg'
    },
    {
        name: 'Embroidered Women\'s Tunic',
        tag: 'embroideredwomenstunic',
        price: 24.99,
        inCart: 0,
        image: 'pf2.jpg'
    },
    {
        name: 'Sleevless Women\'s Top',
        tag: 'sleevelesswomenstop',
        price: 20.99,
        inCart: 0,
        image: 'pf3.jpg'
    },
    {
        name: 'Popnetic Casual Full Sleeve Top',
        tag: 'popneticcasualfullsleevetop',
        price: 14.99,
        inCart: 0,
        image: 'pf4.jpg'
    },
    {
        name: 'Moderno Solid Women\'s Tunic',
        tag: 'modernosolidwomenstunic',
        price: 27.00,
        inCart: 0,
        image: 'pf7.jpg'
    },
    {
        name: 'Casual 3/4th Sleeve Yellow Top',
        tag: 'casualsleeveyellowtop',
        price: 24.00,
        inCart: 0,
        image: 'pf5.jpg'
    },
    {
        name: 'Casual Polo Women\'s T-Shirt',
        tag: 'casualpolowomenstshirt',
        price: 13.00,
        inCart: 0,
        image: 'pf6.jpg'
    },
    {
        name: 'Casual 3/4th Sleeve Top',
        tag: 'casualsleevetop',
        price: 19.00,
        inCart: 0,
        image: 'pf8.jpg'
    },
    {
        name: 'Slim Women\'s Blue Jeans',
        tag: 'slimwomensbluejeans',
        price: 19.99,
        inCart: 0,
        image: 'pf9.jpg'
    },
    {
        name: 'Slim Women\'s Black Jeans',
        tag: 'slimwomensblackjeans',
        price: 24.99,
        inCart: 0,
        image: 'pf10.jpg'
    },
    {
        name: 'Slim Women\'s Blue Jeans',
        tag: 'slimwomensbluejeans2',
        price: 14.99,
        inCart: 0,
        image: 'pf11.jpg'
    },
    {
        name: 'Slim Women\'s Blue Jeans',
        tag: 'slimwomensbluejeans3',
        price: 16.99,
        inCart: 0,
        image: 'pf12.jpg'
    },
    {
        name: 'Slim Women\'s Black Jeans',
        tag: 'slimwomensblackjeans2',
        price: 16.99,
        inCart: 0,
        image: 'pf13.jpg'
    },
    {
        name: 'Slim Light Blue Jeans',
        tag: 'slimlightbluejeans',
        price: 20.99,
        inCart: 0,
        image: 'pf14.jpg'
    },
    {
        name: 'Slim Light Dark Blue Jeans',
        tag: 'slimlightdarkbluejeans',
        price: 12.99,
        inCart: 0,
        image: 'pf15.jpg'
    },
    {
        name: 'Slim Women\'s Beige Jeans',
        tag: 'slimwomensbeigejeans',
        price: 14.99,
        inCart: 0,
        image: 'pf16.jpg'
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