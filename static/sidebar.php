<div class="wrapper">
    <!-- First sidebar which can be opened/closed by a button  -->
    <nav id="sidebar" aria-expanded="false">
        <div class="sidebar-header">
            <a class="fas fa-user-circle" id="user"></a>
        </div>
        <ul class="list-unstyled components">
            <li id="info">
                <a class="fas fa-info-circle"  aria-hidden="true"></a>
                <p>INFO</p>
            </li>
            <li id="filter" >
                <a class="fas fa-filter" aria-hidden="true"></a>
                <p>FILTER</p>
            </li>
            <li id="setting">
                <a class="fa fa-cog"  aria-hidden="true"></a>
                <p>SETTINGS</p>
            </li>
            <li id="contact">
                <a class="fas fa-address-book" aria-hidden="true"></a>
                <p>CONTACT</p>
            </li>
        </ul>
        <div class="sidebar-footer">
            <h3 onclick="window.location.href='../index.html'">Lyon Map</h3>
        </div>
    </nav>

    <!-- Second sidebar which can be accessed from the first one -->
    <nav id="second-sidebar" aria-expanded="false">
        <i class="fa fa-times" id="close-secondSidebar" aria-expanded="true"></i>


        <!---------- Info content ------------->
        <div id="info-content">
        </div>

        <!---------- Filter content ------------->
        <div id="filter-content">
            <!---
            <label for="currencyContainer">Price</label>
            <div class="containerButtons" id="currencyContainer">
                <button id="priceButton1" type="button" class="btnPrice btn"><i class="fas fa-euro-sign"></i></button>
                <button id="priceButton2" type="button" class="btnPrice btn"><i class="fas fa-euro-sign"></i><i class="fas fa-euro-sign"></i></button>
                <button id="priceButton3" type="button" class="btnPrice btn"><i class="fas fa-euro-sign"></i><i class="fas fa-euro-sign"></i><i class="fas fa-euro-sign"></i></button>
                <button id="priceButton4" type="button" class="btnPrice btn"><i class="fas fa-euro-sign"></i><i class="fas fa-euro-sign"></i><i class="fas fa-euro-sign"></i><i class="fas fa-euro-sign"></i></button>
                <button id="resetButton" type="button" class="btnRemove btn" data-toggle="tooltip" data-placement="bottom" title="Reset currency filter"><i class="fa fa-times"></i></button>
            </div>

            <label for="starContainer">Rating</label>
            <div class="containerButtons" id="starContainer">
                <button type="button" id="starButton1" class="btnStar btn"><span class="fa fa-star"></span></button>
                <button type="button" id="starButton2" class="btnStar btn"><span class="fa fa-star"></span></button>
                <button type="button" id="starButton3" class="btnStar btn"><span class="fa fa-star"></span></button>
                <button type="button" id="starButton4" class="btnStar btn"><span class="fa fa-star"></span></button>
                <button type="button" id="starButton5" class="btnStar btn"><span class="fa fa-star"></span></button>
                <button id="resetButton" type="button" class="btnRemove btn" data-toggle="tooltip" data-placement="bottom" title="Reset stars filter"><i class="fa fa-times"></i></button>
            </div>-->
            <!------Location---->
            <div class="filter-item">
                <div class="search-input">
                    <input type="search" id="search" placeholder="Search..." />
                    <span class="fa fa-search" id="searchIcon"></span>
                </div>
            </div>
            <!------Location---->
            <div class="filter-item">
                <select class="selectpicker show-tick" id="location" multiple title="Location" multiple data-selected-text-format="count > 2" data-hide-disabled="true">
                    <optgroup label="Department">
                        <option style="color:white;" value="69001">Lyon 1</option>
                        <option style="color:white;" value="69002">Lyon 2</option>
                        <option style="color:white;" value="69003">Lyon 3</option>
                        <option style="color:white;" value="69004">Lyon 4</option>
                        <option style="color:white;" value="69005">Lyon 5</option>
                        <option style="color:white;" value="69006">Lyon 6</option>
                        <option style="color:white;" value="69007">Lyon 7</option>
                        <option style="color:white;" value="69008">Lyon 8</option>
                        <option style="color:white;" value="69009">Lyon 9</option>
                        <option style="color:white;" value="69100">Villeurbanne</option>
                        <option style="color:white;" value="69500">Bron</option>
                        <option style="color:white;" value="69120">Vaulx-en-velin</option>
                        <option style="color:white;" value="69300">Caluire et Cuire</option>
                    </optgroup>
                    <optgroup label="Other">
                        <option style="color:white;">Around me</option>
                    </optgroup>
                </select>
            </div>
            <!-- by main type -->
            <div class="filter-item">
                <select class="selectpicker show-tick" id="mainType" multiple title="By maintype" multiple data-selected-text-format="count > 3">
                    <option style="color:white;" value="Bar">Bar</option>
                    <option style="color:white;" value="Restaurant">Restaurant</option>
                    <option style="color:white;" value="Bar-restaurant">Bar - Restaurant</option>
                </select>
            </div>

            <!-- by type cuisine -->
            <div class="filter-item">
                <select class="selectpicker show-tick" id="subType" multiple title="By subtype" multiple data-selected-text-format="count > 2">
                    <option style="color:white;" value="Italian">Italian</option>
                    <option style="color:white;" value="Japanese">Japanese</option>
                    <option style="color:white;" value="Chinese">Chinese</option>
                    <option style="color:white;" value="French">French</option>
                    <option style="color:white;" value="Latino">Latino</option>
                    <option style="color:white;" value="Fast food">Fast food</option>
                    <option style="color:white;" value="Bar">Bar</option>
                </select>
            </div>

            <!-----Price----->
            <div class="filter-item" id="priceContent">
                <h2>Price</h2>
                <div class="form-check" >
                    <label>
                        <input type="checkbox" id="price1" name="check">   <i class="fas fa-euro-sign"></i>
                    </label>
                </div>
                <div class="form-check" >
                    <label>
                        <input type="checkbox" id="price2" name="check">   <i class="fas fa-euro-sign"></i><i class="fas fa-euro-sign"></i>
                    </label>
                </div>
                <div class="form-check" >
                    <label>
                        <input type="checkbox" id="price3" name="check">   <i class="fas fa-euro-sign"></i><i class="fas fa-euro-sign"></i><i class="fas fa-euro-sign"></i>
                    </label>
                </div>
                <div class="form-check">
                    <label>
                        <input type="checkbox"  id="price4" name="check">   <i class="fas fa-euro-sign"></i><i class="fas fa-euro-sign"></i><i class="fas fa-euro-sign"></i><i class="fas fa-euro-sign"></i>
                    </label>
                </div>
            </div>
            <!-----Rating----->
            <div class="filter-item" id="ratingContent">
                <h2>Rating</h2>
                <div class="form-check">
                    <label>
                        <input type="checkbox" id="star1" name="check">   <span class="fa fa-star"></span>
                    </label>
                </div>
                <div class="form-check">
                    <label>
                        <input type="checkbox" id="star2" name="check">   <span class="fa fa-star"></span><span class="fa fa-star"></span>
                    </label>
                </div>
                <div class="form-check">
                    <label>
                        <input type="checkbox" id="star3" name="check">   <span class="fa fa-star"></span><span class="fa fa-star"></span><span class="fa fa-star"></span>
                    </label>
                </div>
                <div class="form-check">
                    <label>
                        <input type="checkbox" id="star4" name="check">   <span class="fa fa-star"></span><span class="fa fa-star"></span><span class="fa fa-star"></span><span class="fa fa-star"></span>
                    </label>
                </div>
                <div class="form-check">
                    <label>
                        <input type="checkbox" id="star5" name="check">   <span class="fa fa-star"></span><span class="fa fa-star"></span><span class="fa fa-star"></span><span class="fa fa-star"></span></span><span class="fa fa-star"></span>
                    </label>
                </div>
            </div>
            <!-- Date and time -->
            <div class="filter-item">
                <input class="datetimepicker" id="datetimepicker-secondSidebar" placeholder="Date and Time" type="text" readonly/>
                <script type="text/javascript">
                    $('#datetimepicker-secondSidebar').datetimepicker({
                        format: "yyyy-mm-dd  HH:MM",
                        footer: true,
                        modal: true,
                        altField: "#datetimepicker-secondSidebar",
                    });
                </script>
            </div>
            <!-- Button filter -->
            <div class="btn-filter-group">
                <button class="btn-reset" id="resetFilters">Reset</button>
                <button class="btn-filter" id="btn-filter">Filter</button>
            </div>
        </div>

        <!---------- Settings content ------------->
        <div id="setting-content">
            <!-----Map style----->
            <div class="setting-item" id="styleContent">
                <h2>Map Style</h2>
                <div class="form-check">
                    <label>
                        <input type="radio" name="toggle" checked id="basic" class="btn btnStyle"> <span class="label-text" >Basic</span>
                    </label>
                </div>
                <div class="form-check">
                    <label>
                        <input type="radio" name="toggle" id="streets" class="btn btnStyle"> <span class="label-text" >Streets</span>
                </div>
                <div class="form-check">
                    <label>
                        <input type="radio" name="toggle" id="light" class="btn btnStyle"> <span class="label-text" >Light</span>
                    </label>
                </div>
                <div class="form-check">
                    <label>
                        <input type="radio" name="toggle" id="dark" class="btn btnStyle"> <span class="label-text" >Dark</span>
                    </label>
                </div>
                <div class="form-check">
                    <label>
                        <input type="radio" name="toggle" id="satellite" class="btn btnStyle"> <span class="label-text" >Satellite</span>
                    </label>
                </div>
            </div>
            <!-----Display----->
            <div class="setting-item" id="displayContent">
                <h2>Display</h2>
                <div class="form-check">
                    <label>
                        <input type="radio" name="radio" checked id="viewClusters"> <span class="label-text">Clusters</span>
                    </label>
                </div>
                <div class="form-check">
                    <label>
                        <input type="radio" name="radio" id="viewPoints"> <span class="label-text">Points</span>
                </div>
                <div class="form-check">
                    <label>
                        <input type="radio" name="radio" id="viewHeat"> <span class="label-text">Heat</span>
                </div>
            </div>
            <!-----Heat----->
            <div class="setting-item" id="heatMap">
                <h2>Heatmap</h2>
                <div class="form-check">
                    <label>
                        <input type="checkbox" name="toggle" id="heat"> <span class="label-text" >Heat</span>
                    </label>
                </div>
            </div>
        </div>
    </nav>

    <!-- BUTTON TO OPEN/CLOSE SIDEBAR -->
    <button type="button" id="sidebarCollapse" role="button" aria-label="Toggle Navigation" class="lines-button x">
        <span class="lines"></span>
    </button>

</div>








