window.addEventListener("load", e => {
    console.log("Hello from searchForm.js!");
    
    [...document.getElementsByClassName("search-form-expander-button")].forEach(expander => {
        expander.onclick = function(e) {
            e.preventDefault();
            [...this.parentElement.getElementsByClassName("search-form-expanded")].forEach(expandable => {
                if (expandable.style.display !== "") {
                    expandable.style.display = "";
                    this.textContent = "Show Less";
                    return;
                }
                expandable.style.display = "none";
                this.textContent = "Show More";
            });
        };
        expander.click();
    });
    
});
