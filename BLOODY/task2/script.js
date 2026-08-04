const faqItems = document.querySelectorAll(".accordion li");

faqItems.forEach(item => {

    const label = item.querySelector("label");
    const content = item.querySelector(".content");

    label.addEventListener("click", () => {

        document.querySelectorAll(".content").forEach(c => {
            if(c !== content){
                c.classList.remove("show");
            }
        });

        content.classList.toggle("show");
    });
});