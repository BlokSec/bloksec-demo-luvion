let carts = document.querySelectorAll('.hub-cart')

let products = [
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
        name: 'Girl\'s Full Length Party Dress',
        tag: 'girlsfulllengthpartydress',
        price: 20.00,
        inCart: 0,
        image: 'pg4.jpg'
    },
    {
        name: 'Black/Green Knee Length Party Dress',
        tag: 'black-greenkneelengthpartydress',
        price: 29.99,
        inCart: 0,
        image: 'pg10.jpg'
    },
    {
        name: 'Red Knee Length Party Dress',
        tag: 'redkneelengthpartydress',
        price: 25.00,
        inCart: 0,
        image: 'pg6.jpg'
    },
    {
        name: 'Pink Knee Length Party Dress',
        tag: 'pinkkneelengthpartydress',
        price: 14.99,
        inCart: 0,
        image: 'pg8.jpg'
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