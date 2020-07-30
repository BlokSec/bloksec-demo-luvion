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
        name: 'Sleeveless Women\'s Top',
        tag: 'sleevelesswomenstop',
        price: 20.99,
        inCart: 0,
        image: 'pf3.jpg'
    },
    {
        name: 'Slim Women\'s Blue Jeans',
        tag: 'slimwomensbluejeans',
        price: 19.99,
        inCart: 0,
        image: 'pf9.jpg'
    },
    {
        name: 'Slim Women\'s Blue Jeans',
        tag: 'slimwomensbluejeans2',
        price: 14.99,
        inCart: 0,
        image: 'pf11.jpg'
    },
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
        name: 'Black Casual Men\'s Blazer',
        tag: 'blackcasualmensblazer',
        price: 20.00,
        inCart: 0,
        image: 'pm11.jpg'
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
        name: 'Pink/Blue Knee Length Party Dress',
        tag: 'pink-bluekneelengthpartydress',
        price: 18.00,
        inCart: 0,
        image: 'pg5.jpg'
    },
    {
        name: 'White Knee Length Casual Dress',
        tag: 'whitekneelengthcasualdress',
        price: 20.00,
        inCart: 0,
        image: 'pg1.jpg'
    },
    {
        name: 'Knee Length Casual Dress',
        tag: 'kneelengthcasualdress',
        price: 24.99,
        inCart: 0,
        image: 'pg2.jpg'
    },
    {
        name: 'Striped Knee Length Party Dress',
        tag: 'stripedkneelengthpartydress',
        price: 14.99,
        inCart: 0,
        image: 'pg3.jpg'
    },
    {
        name: 'Pink Knee Length Party Dress',
        tag: 'pinkkneelengthpartydress',
        price: 14.99,
        inCart: 0,
        image: 'pg8.jpg'
    },
    {
        name: 'Shirt, Waistcoat And Pant Set',
        tag: 'shirtwaistcoatandpantset',
        price: 21.00,
        inCart: 0,
        image: 'pb1.jpg'
    },
    {
        name: 'Casual Shirt And Trouser Set',
        tag: 'casualshirtandtrouserset',
        price: 20.00,
        inCart: 0,
        image: 'pb11.jpg'
    },
    {
        name: 'Boys Casual Shirt And Jeans',
        tag: 'boyscasualshirtandjeans',
        price: 17.99,
        inCart: 0,
        image: 'pb3.jpg'
    },
    {
        name: 'Casual Blazer, Shirt And Trouser Set',
        tag: 'casualblazershirttrouserset',
        price: 18.00,
        inCart: 0,
        image: 'pb7.jpg'
    },
    {
        name: 'Boy\'s Casual Blue T-Shirt',
        tag: 'boyscasualbluetshirt',
        price: 15.00,
        inCart: 0,
        image: 'pb5.jpg'
    },
    {
        name: 'Boy\'s Casual Grey T-Shirt',
        tag: 'boyscasualgreytshirt',
        price: 10.00,
        inCart: 0,
        image: 'pb6.jpg'
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