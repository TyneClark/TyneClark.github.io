  
  const submitItem = () => {
    //button is clicked
    console.log("Submit button was clicked")
    //get the item the user enters
    const itemName = document.getElementById("new-item").value;
    const itemQuantity = document.getElementById("new-quantity").value;
    const itemBrand = document.getElementById("new-brand").value;
    const itemPrice = document.getElementById("new-price").value;
    const itemStore = document.getElementById("new-store").value;
    console.log("my item", itemName);
    console.log("my quantity", itemQuantity)
    //send item to db using http
    createItemOnServer(itemName, itemQuantity, itemBrand, itemPrice, itemStore);
    document.getElementById("new-item").value = "";
    document.getElementById("new-quantity").value = "";
    document.getElementById("new-brand").value = "";
    document.getElementById("new-price").value = "";
    document.getElementById("new-store").value = "";
  };

  

  //add a listener for the button
  document.getElementById("submit-item").addEventListener("click", submitItem);
  document.getElementById("submit-edit").addEventListener("click", function (){
    submitItemEdit(item_id);
});
  document.getElementById("new-quantity").addEventListener("keypress", function(event) {
    // If the user presses the "Enter" key on the keyboard
    if (event.key === "Enter") {
      // Trigger the button element with a click
      document.getElementById("submit-item").click();
      document.getElementById("new-item").value = "";
      document.getElementById("new-quantity").value = ""
    }
  });


  function loadCartFromServer() {
    fetch("https://s23-deploy-tyneclark-production.up.railway.app/cart", {
      // request details:
      method: "GET",
      credentials: "include",
    }).then(function (response) {
      response.json().then(function (data) {
        
        console.log("data received from server:", data);
        myMovies = data;
  
        var myList = document.querySelector("#shopping-list");
        console.log("my list element:", myList);
        myList.innerHTML = "";
  
        // for movie in myMovies:
        myMovies.forEach(function (movie) {
  
          var nameDiv = document.createElement("li");
          string = JSON.stringify(movie)
          //console.log("string=",string)
          split_string = string.split(":")
          //console.log("splitstring=",split_string)
          brand_part = split_string[4]
          //console.log("brand_part:", brand_part)
          brand_part = brand_part.split('"')
          //console.log("newbrand:", brand_part)
          brand = brand_part[1]
          //console.log("endbrand:", brand_part)
          price_part = split_string[5]
          price_part = price_part.split(",")
          price_part = price_part[0]
          price_part = price_part.split('"')
          price = price_part[0]
          store_part = split_string[6]
          store_part = store_part.split('"')
          store = store_part[1]
          //console.log("BRAND:", brand_part)
          //console.log("PRICE:", price_part)
          //console.log("STORE:", store_part)
          quan_part = split_string[3]
          //console.log("quanpart=",quan_part)
          quan_part = quan_part.split("}")
          //console.log("newquan=",quan_part)
          quan_part = quan_part[0]
          quan_part.split(",")
          quantity = quan_part[0]
          //console.log("QUANTITY=", quantity)
          name_part = split_string[2]
          //console.log("namepart=", name_part)
          name_part = name_part.split('"')
          //console.log ("newnamepart=", name_part)
          myname = name_part[1]
          //console.log("NAME=", myname)
          id_part = split_string[1]
          //console.log("IDpart=", id_part)
          id_part = id_part.split(",")
          //console.log("Newidpart=", id_part)
          item_id = id_part[0]
          //console.log("ID=", item_id)
          TOSCREEN = quantity + " " + myname
          nameDiv.innerHTML = TOSCREEN;
          nameDiv.classList.add("item-name");
          nameDiv.setAttribute("div-id", item_id)
          nameDiv.setAttribute("brand", brand)
          nameDiv.setAttribute("price", price)
          nameDiv.setAttribute("store", store)
          // Create a new delete button
          const deleteButton = document.createElement('button');
          deleteButton.textContent = 'X';
          deleteButton.setAttribute("div-id", item_id)
          deleteButton.classList.add('delete-button');
          // Create a new edit button
          const editButton = document.createElement('button');
          editButton.textContent = 'Edit';
          editButton.setAttribute("div-id", item_id)
          editButton.classList.add('edit-button');

          // Append the delete button to the list item
          nameDiv.appendChild(deleteButton);
          nameDiv.appendChild(editButton);
          myList.appendChild(nameDiv);
        });
      });
    });
  }

  function createItemOnServer(itemName, itemQuantity, itemBrand, itemPrice, itemStore) {
    console.log("attempting to create item", itemName, "on server");
  
    var data = "name=" + encodeURIComponent(itemName) + "&quantity=" + encodeURIComponent(itemQuantity) + "&brand=" + encodeURIComponent(itemBrand) + "&price=" + encodeURIComponent(itemPrice) + "&store=" + encodeURIComponent(itemStore);
    console.log("sending data to server:", data);
  
    fetch("https://s23-deploy-tyneclark-production.up.railway.app/cart", {
      // request details:
      method: "POST",
      body: data,
      credentials: "include",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    }).then(function (response) {
      // when the server responds:
  
      if (response.status == 201) {
        loadCartFromServer();
      } else {
        console.log("server responded with", response.status, "when trying to create a item");
      }
  
    });
  }

  const wrapper = document.getElementById('wrapper');

  wrapper.addEventListener('click', (event) => {
    console.log("something was clicked")
    const isButton = event.target.nodeName === 'BUTTON';
    if (!isButton) {
      console.log("it was not a button")
      return;
    }
    var button = event.target
    console.log(button.getAttribute("class"))
    if (button.getAttribute("class") === 'delete-button'){
      item_id = button.getAttribute("div-id")
      //console.log("itemid:",item_id)
      if (confirm("Are you sure you want to delete this item?")) {
        deleteItemFromServer(item_id)
      }
    }
    if (button.getAttribute("class") === 'edit-button') {
      item_id = button.getAttribute("div-id")
      if (confirm("Are you sure you want to edit this item?")) {
        // query for an item-name with same div-id
        var item_name = document.querySelectorAll('[div-id='+'"'+item_id+'"'+']');
        //console.log('[div-id='+'"'+item_id+'"'+']')
        //console.log(item_name)
        test = item_name[0]
        console.log(test)
        //console.log(test.textContent)
        temp = test.textContent.split("X")
        console.log("after split", temp)
        temp = temp[0]
        temp = temp.split(" ")
        // console.log(temp)
        item_name = temp[1]
        item_quantity = temp[0]
        console.log("brand value:", test.getAttribute("brand"))
        document.getElementById("new-item").value = item_name
        document.getElementById("new-quantity").value = item_quantity
        document.getElementById("new-brand").value = test.getAttribute("brand")
        document.getElementById("new-price").value = test.getAttribute("price")
        document.getElementById("new-store").value = test.getAttribute("store")
        let TOEDIT = item_id
      }
    }
  })

function deleteItemFromServer(id) {
  console.log("attempting to delete item from server with id:", id)
  var address = "https://s23-deploy-tyneclark-production.up.railway.app/cart/" + id
  console.log("sending request to server with path:", address)
  
  fetch(address, {
      // request details:
      method: "DELETE",
      credentials: "include"
    }).then(function (response) {
      // when the server responds:
  
      if (response.status == 204) {
        loadCartFromServer();
      } else {
        console.log("server responded with", response.status, "when trying to delete an item");
      }
  
    });
}
  
function replaceItemOnServer(id, itemName, itemQuantity, itemBrand, itemPrice, itemStore) {
  console.log("attempting to edit item from server with id:", id)
  var address = "https://s23-deploy-tyneclark-production.up.railway.app/cart/" + id
  console.log("sending request to server with path:", address)
  
  var data = "name=" + encodeURIComponent(itemName) + "&quantity=" + encodeURIComponent(itemQuantity) + "&brand=" + encodeURIComponent(itemBrand) + "&price=" + encodeURIComponent(itemPrice) + "&store=" + encodeURIComponent(itemStore);
  console.log("sending data to server:", data);
  fetch(address, {
      // request details:
      method: "PUT",
      body: data,
      credentials: "include",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    }).then(function (response) {
      // when the server responds:
  
      if (response.status == 204) {
        loadCartFromServer();
      } else {
        console.log("server responded with", response.status, "when trying to delete an item");
      }
  
    });
}

function submitItemEdit(id) {
  // button is clicked
  console.log("submit edit button pressed")
  console.log("id provided:", id)
  const itemName = document.getElementById("new-item").value;
  const itemQuantity = document.getElementById("new-quantity").value;
  const itemBrand = document.getElementById("new-brand").value;
  const itemPrice = document.getElementById("new-price").value;
  const itemStore = document.getElementById("new-store").value;
  console.log("name:",itemName,"quan:",itemQuantity)
  replaceItemOnServer(id, itemName, itemQuantity, itemBrand, itemPrice, itemStore);
  document.getElementById("new-item").value = ""
  document.getElementById("new-quantity").value = ""
  document.getElementById("new-brand").value = ""
  document.getElementById("new-price").value = ""
  document.getElementById("new-store").value = ""

}

document.getElementById("submit-login").addEventListener("click", submitLogin);

function submitLogin() {
    // button is clicked
    console.log("Login button pressed")
    const userEmail = document.getElementById("user-email").value;
    console.log("id provided:", userEmail)
    const userPassword = document.getElementById("user-password").value;
    console.log("password provided:", userPassword)
    userLogin(userEmail, userPassword);
    document.getElementById("user-email").value = ""
    document.getElementById("user-password").value = ""
  
  }
  
  function userLogin(email, password) {
    console.log("attempting to login with email", email, "on server");
    
      var data = "email=" + encodeURIComponent(email) + "&password=" + encodeURIComponent(password);
      console.log("sending data to server:", data);
    
      fetch("https://s23-deploy-tyneclark-production.up.railway.app/login", {
        // request details:
        method: "POST",
        body: data,
        credentials: "include",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }).then(function (response) {
        // when the server responds:
    
        if (response.status == 201) {
          console.log("Creation Successful")
          var home = document.getElementById("home");
          var login = document.getElementById("login");
          var register = document.getElementById("register");
          register.style.display = "none";
          login.style.display = "none";
          home.style.display = "block";
          loadCartFromServer();
          //location.href = 'index.html';

        } else {
          console.log("server responded with", response.status, "when trying to create an account");
          var message = document.createElement('p')
          message.textContent = "Incorrect Username or Password."
          message.style.backgroundColor = "red"
          document.getElementById("submit-login").appendChild(message)
        }
    
      });
  }

  document.getElementById("submit-account").addEventListener("click", submitAccountRegistration);

  function submitAccountRegistration() {
      // button is clicked
      console.log("Login button pressed")
      const userEmail = document.getElementById("new-user-email").value;
      console.log("id provided:", userEmail)
      const userPassword = document.getElementById("new-user-password").value;
      const userFname = document.getElementById("user-fname").value;
      const userLname = document.getElementById("user-lname").value;
      console.log("password provided:", userPassword)
      createUserAccount(userEmail, userPassword, userFname, userLname);
      document.getElementById("user-email").value = ""
      document.getElementById("user-password").value = ""
    
    }
    
    function createUserAccount(email, password, fname, lname) {
      console.log("attempting to create account with email", email, "on server");
      
        var data = "email=" + encodeURIComponent(email) + "&password=" + encodeURIComponent(password) + "&fname=" + encodeURIComponent(fname) + "&lname=" + encodeURIComponent(lname);
        console.log("sending data to server:", data);
      
        fetch("https://s23-deploy-tyneclark-production.up.railway.app/register", {
          // request details:
          method: "POST",
          body: data,
          credentials: "include",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          }
        }).then(function (response) {
          // when the server responds:
      
          if (response.status == 201) {
            console.log("Creation Successful")
            var home = document.getElementById("home");
            var register = document.getElementById("register");
            var login = document.getElementById("login");
            login.style.display = "none";
            register.style.display = "none";
            home.style.display = "block";
            userLogin(email, password);
            //location.href = 'index.html';
  
          } else {
            console.log("server responded with", response.status, "when trying to create an account");
            var message = document.createElement('p')
            message.textContent = "Account with this email already exists"
            document.getElementById("submit-account").appendChild(message)
          }
      
        });
    }

document.getElementById("create-account").addEventListener("click", showRegister);

function showRegister() {
var home = document.getElementById("home");
var register = document.getElementById("register");
var login = document.getElementById("login");
login.style.display = "none";
register.style.display = "block";
home.style.display = "none";
}
    
var home = document.getElementById("home");
var register = document.getElementById("register");
var login = document.getElementById("login");
login.style.display = "block";
register.style.display = "none";
home.style.display = "none";

function checkAuth() {
  fetch("https://s23-deploy-tyneclark-production.up.railway.app/cart", {
      // request details:
      method: "GET",
      credentials: "include",
    }).then(function (response) {
      if (response.status == 200) {
        var home = document.getElementById("home");
        var register = document.getElementById("register");
        var login = document.getElementById("login");
        login.style.display = "none";
        register.style.display = "none";
        home.style.display = "block";
        loadCartFromServer()
      }
    });
}

checkAuth()

