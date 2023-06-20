//box-modal
function toggleModal() {
    const boxModal = document.querySelector('.form-modal');
    const formModal = document.querySelector('.form');
    boxModal.classList.toggle('hidden');
    formModal.classList.toggle('hidden');
}
document.querySelector('.open-modal').onclick = toggleModal;
document.querySelector('.close-modal').onclick = () => {
    toggleModal();
    clearForm();
}
document.querySelector('.over-lay').onclick = (event) => {
    event.stopPropagation();
    toggleModal();
    clearForm();
};


function clearForm() {
    document.querySelector('input[name = "product-id"]').disabled = false;
    document.querySelector('input[name = "product-id"]').value = '';
    document.querySelector('input[name = "product-name"]').value = '';
    document.querySelector('input[name = "import-price"]').value = '';
    document.querySelector('input[name = "export-price"]').value = '';
    document.querySelector('input[name = "import-date"]').value = '';
    document.querySelector('input[name = "size-x"]').checked = false;
    document.querySelector('input[name = "size-xl"]').checked = false;
    document.querySelector('input[name = "size-l"]').checked = false;
    document.querySelector('input[value = "Male"]').checked = true;
    document.querySelector('input[value = "Female"]').checked = false;
    document.querySelector('textarea[name = "desc"]').value = '';
    document.querySelector('#create-product').hidden = false;
    document.querySelector('#update-product').hidden = true;
}

function validateForm(bodyRequest, id) {
    if (!id) {
        if (bodyRequest.id == "" || !bodyRequest.id.startsWith("P") || bodyRequest.id.length != 4) {
            alert("ProductId: Không được trùng lặp, gồm 4 ký tự, bắt đầu là ký tự “P”");
            return 0;
        }
    }
    if (bodyRequest.productName.length < 6 || bodyRequest.productName.length > 50) {
        alert("ProductName: Không được trùng lặp, phải bao gồm từ 6-50 ký tự");
        return 0;
    }
    if (bodyRequest.importPrice <= 0) {
        alert("importPrice: là số có giá trị lớn hơn 0");
        return 0;
    }
    if (bodyRequest.importPrice >= bodyRequest.exportPrice) {
        alert("exportPrice: là số có giá trị lớn hơn importPrice");
        return 0;
    }
    if (bodyRequest.size.length == 0) {
        alert("Chọn size");
        return 0;
    }
    return 1;

}
//call api

const productApi = 'https://my-json-server.typicode.com/proxuthanh99yd/json_server/products';
// const productApi = 'http://localhost:3000/products';

function getProduct(callback) {
    fetch(productApi)
        .then(response => response.json())
        .then(callback)
}
function renderProduct(products) {
    const htmlElement = products.map((value, index, array) => {
        return `
            <tr table-id = "${value.id}">
            <td>${1.0 * index + 1}</td>
            <td>${value.id}</td>
            <td>${value.productName}</td>
            <td>${value.importPrice}</td>
            <td>${value.exportPrice}</td>
            <td>${value.importDate}</td>
            <td>${value.size}</td>
            <td>${value.gender}</td>
            <td>${value.desc}</td>
            <td><button onclick="editProduct('${value.id}')" class="btn-edit"><i class="fa-solid fa-pen-to-square"></i></button>
            <button onclick="deleteProduct('${value.id}')" class="btn-delete"><i class="fa-solid fa-trash-can"></i></button></td>
            </tr>`;
    }).join("");
    document.querySelector('tbody').innerHTML = htmlElement;

}

function createProduct() {
    const size = document.querySelectorAll('input[type = "checkbox"]:checked');
    const sizeItem = [];

    for (let key in size) {
        if (Object.hasOwnProperty.call(size, key)) {
            sizeItem.push(size[key].value);
        }
    }
    const bodyRequest = {
        id: document.querySelector('input[name = "product-id"]').value,
        productName: document.querySelector('input[name = "product-name"]').value,
        importPrice: document.querySelector('input[name = "import-price"]').value * 1.0,
        exportPrice: document.querySelector('input[name = "export-price"]').value * 1.0,
        importDate: document.querySelector('input[name = "import-date"]').value,
        size: sizeItem,
        gender: document.querySelector('input[name = "gender"]:checked').value,
        desc: document.querySelector('textarea[name = "desc"]').value
    }
    if (validateForm(bodyRequest)) {
        storeProduct(bodyRequest, (response) => {
            const index = document.querySelector("tbody tr:last-child td:first-child").innerHTML * 1.0;
            const createRow = document.createElement("tr");
            createRow.setAttribute("table-id", response.id)
            createRow.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${response.id}</td>
                    <td>${response.productName}</td>
                    <td>${response.importPrice}</td>
                    <td>${response.exportPrice}</td>
                    <td>${response.importDate}</td>
                    <td>${response.size}</td>
                    <td>${response.gender}</td>
                    <td>${response.desc}</td>
                    <td><button onclick="editProduct('${response.id}')" class="btn-edit"><i class="fa-solid fa-pen-to-square"></i></button>
                    <button onclick="deleteProduct('${response.id}')" class="btn-delete"><i class="fa-solid fa-trash-can"></i></button></td>`;
            document.querySelector('tbody').appendChild(createRow);
            toggleModal();
            clearForm();
        });
    }
}

function storeProduct(bodyRequest, callback) {

    fetch(productApi, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        headers: {
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify(bodyRequest), // body data type must match "Content-Type" header
    })
        .then(res => res.json())
        .then(callback)
        .catch((err) => {
            alert("ProductId: Không được trùng lặp");
        })
}

function editProduct(id) {
    clearForm();
    document.querySelector('#create-product').hidden = true;
    document.querySelector('#update-product').hidden = false;
    toggleModal();
    const tableRow = document.querySelectorAll(`tr[table-id="${id}"] td`);
    document.querySelector('input[name = "product-id"]').disabled = true;
    document.querySelector('input[name = "product-id"]').value = tableRow[1].innerHTML;
    document.querySelector('input[name = "product-name"]').value = tableRow[2].innerHTML;
    document.querySelector('input[name = "import-price"]').value = tableRow[3].innerHTML * 1.0;
    document.querySelector('input[name = "export-price"]').value = tableRow[4].innerHTML * 1.0;
    document.querySelector('input[name = "import-date"]').value = tableRow[5].innerHTML;
    document.querySelector('textarea[name = "desc"]').value = tableRow[8].innerHTML;
    const size = tableRow[6].innerHTML.split(",");
    for (const key in size) {
        if (size[key] == 'X') {
            document.querySelector('input[name = "size-x"]').checked = true;
        }
        if (size[key] == 'XL') {
            document.querySelector('input[name = "size-xl"]').checked = true;
        }
        if (size[key] == 'L') {
            document.querySelector('input[name = "size-l"]').checked = true;
        }
    }
    if (tableRow[7].innerHTML == 'Male') {
        document.querySelector('input[value = "Male"]').checked = true;
    } else {
        document.querySelector('input[value = "Female"]').checked = true;
    }
}

function updateProduct() {
    const id = document.querySelector('input[name = "product-id"]').value;

    const size = document.querySelectorAll('input[type = "checkbox"]:checked');
    const sizeItem = [];
    for (let key in size) {
        if (Object.hasOwnProperty.call(size, key)) {
            sizeItem.push(size[key].value);
        }
    }

    const bodyRequest = {
        productName: document.querySelector('input[name = "product-name"]').value,
        importPrice: document.querySelector('input[name = "import-price"]').value * 1.0,
        exportPrice: document.querySelector('input[name = "export-price"]').value * 1.0,
        importDate: document.querySelector('input[name = "import-date"]').value,
        size: sizeItem,
        gender: document.querySelector('input[name = "gender"]:checked').value,
        desc: document.querySelector('textarea[name = "desc"]').value
    }

    if (validateForm(bodyRequest, id)) {
        fetch(productApi + '/' + id, {
            method: "PUT", // *GET, POST, PUT, DELETE, etc.
            headers: {
                "Content-Type": "application/json",
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify(bodyRequest), // body data type must match "Content-Type" header
        })
            .then(res => res.json())
            .then((json) => {
                document.querySelector(`tbody tr[table-id="${id}"] td:nth-child(3)`).innerHTML = json.productName;
                document.querySelector(`tbody tr[table-id="${id}"] td:nth-child(4)`).innerHTML = json.importPrice;
                document.querySelector(`tbody tr[table-id="${id}"] td:nth-child(5)`).innerHTML = json.exportPrice;
                document.querySelector(`tbody tr[table-id="${id}"] td:nth-child(6)`).innerHTML = json.importDate;
                document.querySelector(`tbody tr[table-id="${id}"] td:nth-child(7)`).innerHTML = json.size;
                document.querySelector(`tbody tr[table-id="${id}"] td:nth-child(8)`).innerHTML = json.gender;
                document.querySelector(`tbody tr[table-id="${id}"] td:nth-child(9)`).innerHTML = json.desc;
            })
        clearForm();
        toggleModal();
    }
}

function deleteProduct(id) {
    document.querySelector('.modal-delete').classList.toggle('hidden');
    document.querySelector('.modal-content__close').onclick = () => {
        document.querySelector('.modal-delete').classList.toggle('hidden');
    }
    document.querySelector('.btn-no').onclick = () => {
        document.querySelector('.modal-delete').classList.toggle('hidden');
    }
    document.querySelector('.modal-content__delete').innerHTML =
        "ID: " + id + " (" +
        document.querySelector(`tbody tr[table-id="${id}"] td:nth-child(3)`).innerHTML + ")";
    document.querySelector('.btn-yes').onclick = () => {
        destroyProduct(id);
        document.querySelector('.modal-delete').classList.toggle('hidden');
    };
}
function destroyProduct(id) {
    fetch(productApi + "/" + id, {
        method: "DELETE", // *GET, POST, PUT, DELETE, etc.
    })
        .then(res => res.json())
        .then(json => console.log(json))

    document.querySelector(`tbody tr[table-id="${id}"]`).remove();
}

function start() {
    getProduct(renderProduct);
    clearForm();
}

document.querySelector('#search-btn').onclick = (e) => {
    e.preventDefault();
    fetch(productApi + "?productName_like=" + document.querySelector('#search').value)
        .then(response => response.json())
        .then(json => {
            renderProduct(json);
        })
}

document.querySelector('#search').oninput = (e) => {
    if (document.querySelector('#search').value == '') {
        start();
    }
}

window.onload = start;
document.querySelector('#create-product').addEventListener('click', createProduct)
document.querySelector('#update-product').addEventListener('click', updateProduct)
