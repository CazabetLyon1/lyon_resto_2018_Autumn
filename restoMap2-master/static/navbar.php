<!-- when the window is larger than SM, the navbar expands -->
<nav class="navbar navbar-expand-sm">
    <!-- toggler button for responsive navbar -->
    <button type="button" class="navbar-toggler" data-toggle="collapse" data-target="#navbarContent"><i class="fa fa-navicon"></i></button>

    <div class="collapse navbar-collapse" id="navbarContent">
        <ul class="navbar-nav mr-auto">
            <li class="nav-item dropdown">
                <button class="nav-link dropdown-toggle btn" id="navFilterButton" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    Filters
                </button>
                <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                    <div class="dropdown-item">
                        <label for="typeContainer">Type</label>
                        <div class="containerButtons" id="typeContainer"><button id="restaurantButton" type="button" class="btnType btn">Restaurant</button><button id="barButton" type="button" class="btnType btn">Bar</button><button id="barRestaurantButton" type="button" class="btnType btn">Bar-Restaurant</button><button id="resetButton" type="button" class="btnRemove btn" data-toggle="tooltip" data-placement="bottom" title="Reset type filter"><i class="fa fa-remove"></i></button></div>
                    </div>
                    <div class="dropdown-item">
                        <label for="currencyContainer">Price</label>
                        <div class="containerButtons" id="currencyContainer"><button id="priceButton1" type="button" class="btnPrice btn"><i class="fa fa-euro"></i></button><button id="priceButton2" type="button" class="btnPrice btn"><i class="fa fa-euro"></i><i class="fa fa-euro"></i></button><button id="priceButton3" type="button" class="btnPrice btn"><i class="fa fa-euro"></i><i class="fa fa-euro"></i><i class="fa fa-euro"></i></button><button id="priceButton4" type="button" class="btnPrice btn"><i class="fa fa-euro"></i><i class="fa fa-euro"></i><i class="fa fa-euro"></i><i class="fa fa-euro"></i></button><button id="resetButton" type="button" class="btnRemove btn" data-toggle="tooltip" data-placement="bottom" title="Reset currency filter"><i class="fa fa-remove"></i></button></div>
                    </div>
                    <div class="dropdown-item">
                        <label for="starContainer">Rating</label>
                        <div class="containerButtons" id="starContainer"><button type="button" id="starButton1" class="btnStar btn"><span class="fa fa-star"></span></button><button type="button" id="starButton2" class="btnStar btn"><span class="fa fa-star"></span></button><button type="button" id="starButton3" class="btnStar btn"><span class="fa fa-star"></span></button><button type="button" id="starButton4" class="btnStar btn"><span class="fa fa-star"></span></button><button type="button" id="starButton5" class="btnStar btn"><span class="fa fa-star"></span></button><button id="resetButton" type="button" class="btnRemove btn" data-toggle="tooltip" data-placement="bottom" title="Reset stars filter"><i class="fa fa-remove"></i></button></div>
                    </div>
                    <div class="dropdown-item">
                        <div class="form-check checkbox-slider--b">
                            <label for="aroundMe">
                                <input type="checkbox" id="aroundMe"><span>Around me</span>
                            </label>
                        </div>
                    </div>
                    <div class="dropdown-item">
                        <div class="form-check checkbox-slider--b">
                            <label for="openedNow">
                                <input type="checkbox" id="openedNow"><span>Opened now</span>
                            </label>
                        </div>
                    </div>
                    <div class="dropdown-item">
                        <label for="inputDay"> Opened on : </label>
                        <select id="inputDay">
                            <option value="-1" selected>Choose a day...</option>
                            <option value="1">Monday</option>
                            <option value="2">Tuesday</option>
                            <option value="3">Wednesday</option>
                            <option value="4">Thursday</option>
                            <option value="5">Friday</option>
                            <option value="6">Saturday</option>
                            <option value="0">Sunday</option>
                        </select>
                        <label id="labelDay" for="inputTime">or/and at : </label>
                        <input type="time" id="inputTime">

                    </div>
                    <div class="dropdown-item">
                        <button type="button" class="btn btn-success" id="go" data-toggle="tooltip" data-placement="bottom" title="Display results">Go</button>
                        <button type="button" class="btn btn-danger" id="resetFilters"><i class="fa fa-trash" data-toggle="tooltip" data-placement="bottom" title="Reset all filters"></i></button>
                    </div>
                </div>
            </li>
            <li class="nav-item divGear">
                <button type="button" class="btn" id="settings" data-toggle="modal" data-target="#modalSettings"><i class="fa fa-gear"></i></button>
            </li>
        </ul>
        <div class="form-inline my-2 my-lg-0">
            <input class="form-control mr-sm-2" type="search" placeholder="type, address, review, ..." aria-label="Search" id="textSearch">
            <button class="btn btn-success my-2 my-sm-0" type="button" id="searchButton">Go</button>
        </div>
    </div>
</nav>

<?php include('settings.php'); ?>

<?php include('legend.php'); ?>


<!-- our JS -->
<script src="js/animations.js"></script>


