window.addEventListener("load", e => {
    console.log("Hello from searchForm.js!");
    let searchForm = document.getElementsByClassName("search-form")[0];
    
    [...document.getElementsByClassName("search-form-expander-button")].forEach(expander => {
        expander.onclick = function(e) {
            e.preventDefault();
            if (searchForm.classList.contains("unexpanded")) {
                searchForm.classList.remove("unexpanded");
                this.textContent = "Show Less";
                this.title = "Show less fields";
                window.localStorage.setItem("searchForm-expanded", 1);
                return;
            }
            searchForm.classList.add("unexpanded");
            this.textContent = "Show More";
            this.title = "Show more fields";
            window.localStorage.setItem("searchForm-expanded", 0);
        };
        if (window.localStorage.getItem("searchForm-expanded") == 0) {
            expander.click();
        }
    });
    
});
