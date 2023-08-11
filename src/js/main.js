let burger = document.querySelector(".header_menu-burger");
let menu = document.querySelector(".burger__nav");
if (burger) {
    burger.addEventListener( "click", function(e) {
        burger.classList.toggle('active')
        menu.classList.toggle('active')
        document.body.classList.toggle('lock'); 
       
         
});
};


let menuLinks = document.querySelectorAll(".main__menu-item");
if ( menuLinks.length > 0) {
    menuLinks.forEach(menuLink => {
        menuLink.addEventListener("click", function (e) {
            if (burger.classList.contains('active')) {
                burger.classList.remove('active');
                menu.classList.remove('active'); 
                document.body.classList.toggle('lock'); 
            }
        
            
        } );
    });
    
};





