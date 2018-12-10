<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">

    <title>LYON MAP</title>
    <!-- Latest compiled and minified CSS (Bootstrap) -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">

    <!-- CSS for Bootstrap toggle -->
    <link href="https://gitcdn.github.io/bootstrap-toggle/2.2.2/css/bootstrap-toggle.min.css" rel="stylesheet">

    

    <!-- font-awsome for icons (search...) -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    
    <link href='https://fonts.googleapis.com/css?family=Pangolin' rel='stylesheet'>
    <link href='https://fonts.googleapis.com/css?family=Pacifico' rel='stylesheet'>
    <link href='https://fonts.googleapis.com/css?family=Patua One' rel='stylesheet'>
    <link href='https://fonts.googleapis.com/css?family=Righteous' rel='stylesheet'>

    <style>	
    * {
        box-sizing: border-box;
    }

    body, html {
        height: 100%;
        margin: 0;
        background:white;
    }

	.main{
        /*size*/
        height:100%;

		/* The image used */
		background-image: url("Img/Lyon.jpg");	
		opacity: 1;

		/* Center and scale the image nicely */
		background-position: center;
        background-repeat: no-repeat;
        background-size: cover;		
    }    

    .decoration{
        /*size*/
        
        background:white;
    }
    ul{
        float:right;
    }
    a {
        display: block;
        float:left;
        color: gray;
        text-align: center;
        padding: 14px 16px;
        font-size: 20px;
        font-weight: bold;
        font-family: 'Pangolin';
        text-decoration: none;
    }
    a:hover {
        color:floralwhite;
    }

    /* Search bar */
	.search-bar{
        position:center;
        width: 800px;
		height: 60px;
        margin-top:150px;
        margin-left:25%;
        margin-right:25%;
        background:white;   
        border-top-left-radius:5px;
        border-bottom-left-radius:5px;  
        border-top-right-radius:5px;
        border-bottom-right-radius:5px;  
        border: 0px solid white;     
	}
    /* Advanced button */
    #advanced{
        margin-top:-52px;
        height:60px;
        width:60px;
        font-size:22px;
        background:white;        
    }
	/* Search Box */
    .search-bar input#search{
		width: 360px;
		height: 60px;
		background: white;
        border-top-left-radius:5px;
        border-bottom-left-radius:5px;  
		border: 0px solid  white;    	
		font-size: 15pt;
		float: left;
        color:   gray;
        font-weight:bold;
		padding-left: 30px;	
	}
	.search-bar input#search::-webkit-input-placeholder {
		color:   gray;
		font-weight:bold;
		font-family: 'Pangolin';
	}	 
	.search-bar input#search:-moz-placeholder { /* Firefox 18- */
        color:   gray;
        font-weight:bold;
		font-family: 'Pangolin';
	}	 
	.search-bar input#search::-moz-placeholder {  /* Firefox 19+ */
        color:   gray;
        font-weight:bold;
		font-family: 'Pangolin';
	}	 
	.search-bar input#search:-ms-input-placeholder {  
        color:   gray;
        font-weight:bold;
		font-family: 'Pangolin';
	}

    /* Search departements */
    .search-bar input#location{
		width: 320px;
		height: 60px;
		background: white;
		border: 0px solid  white; 
        font-size: 15pt;
		float: left;
        color:   gray;
        font-weight:bold;
		padding-left: 30px;	
	}
	.search-bar input#location::-webkit-input-placeholder {
		color:   gray;
		font-weight:bold;
		font-family: 'Pangolin';
	}	 
	.search-bar input#location:-moz-placeholder { /* Firefox 18- */
        color:   gray;
        font-weight:bold;
		font-family: 'Pangolin';
	}	 
	.search-bar input#location::-moz-placeholder {  /* Firefox 19+ */
        color:   gray;
        font-weight:bold;
		font-family: 'Pangolin';
	}	 
	.search-bar input#location:-ms-input-placeholder {  
        color:   gray;
        font-weight:bold;
		font-family: 'Pangolin';
	}

    /* Button search */
	.search-bar .btn-search{
		position: absolute;
		float:left;
		width:60px;
		height:60px;
        font-size:30px;
        color:white;
		z-index: 1;
		background:blue;
		border:white;
		border-top-right-radius:5px;
        border-bottom-right-radius:5px;
	}	

    /* Auto-complete */
    .autocomplete2 {  
        position: relative;
        display: inline-block;
    }
    
    .autocomplete-items {
        position: absolute;
        padding-top:1px;
        border-radius:5px;
        z-index: 99;
        /*position the autocomplete items to be the same width as the container:*/
        top: 100%;
        left: 0;
        right: 0;
    }

    .autocomplete-items div {
        padding: 8px;
        padding-left:30px;
        cursor: pointer;
        background-color: #fff; 
        border-bottom: 1px solid #d4d4d4; 
    }

    .autocomplete-items div:hover {
        /*while hovering an item:*/
        background-color: #e9e9e9; 
    }

    
    </style>
</head>

<body>
    <!-- Main Part -->
    <div class="main">
        <nav class="navbar">			         
                    <img id="brand-logo" alt="Brand" class="brand" src="Img/logo-lyon1.png" style="height:80px;width:30%">
                    <ul>
                        <a>Inscription</a>
                        <a>Connexion</a>
                    </ul>			
        </nav>
        <div class="search-bar">                   
            <input type="search" id="search" placeholder="Search..." />                
            <div class="btn-group" role="group">
                <div class="dropdown dropdown-lg">
                    <button type="button" class="btn btn-default dropdown-toggle" id="advanced"  data-toggle="dropdown" aria-expanded="false"></button>
                    <div class="dropdown-menu dropdown-menu-right" role="menu">
                        <form class="form-horizontal" role="form">
                            <div class="form-group">
                                <label for="filter">Filter by</label>
                                <select class="form-control">
                                    <option value="0" selected>All Snippets</option>
                                    <option value="1">Featured</option>
                                    <option value="2">Most popular</option>
                                    <option value="3">Top rated</option>
                                    <option value="4">Most commented</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="contain">Author</label>
                                <input class="form-control" type="text" />
                                </div>
                                <div class="form-group">
                                <label for="contain">Contains the words</label>
                                <input class="form-control" type="text" />
                            </div>
                            <button type="submit" class="btn btn-primary"><span class="glyphicon glyphicon-search" aria-hidden="true"></span></button>
                        </form>
                    </div>
                </div>                          
                <button class="btn-search" id="btn-search"><i class="fa fa-search"></i></button> 
            </div>
        </div>
        
    </div>

    <!-- Decoration Part -->
    <div class="decoration">
    </div>

    
	
</body>
</html>