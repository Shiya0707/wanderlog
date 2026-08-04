/* =====================================
   WANDERLOG WEEK 3
   PHOTO UPLOAD + PUBLIC PROFILE
===================================== */


/* =====================================
   GET EXISTING TRIPS
===================================== */

let trips =
    JSON.parse(localStorage.getItem("trips")) || [];


/* =====================================
   EDIT MODE
===================================== */

let editingTripId = null;


/* =====================================
   ELEMENTS
===================================== */

const formSection =
    document.getElementById("formSection");

const tripForm =
    document.getElementById("tripForm");

const imageInput =
    document.getElementById("image");

const imagePreview =
    document.getElementById("imagePreview");

const previewMessage =
    document.getElementById("previewMessage");

const loadingState =
    document.getElementById("loadingState");

const emptyState =
    document.getElementById("emptyState");

const tripContainer =
    document.getElementById("tripContainer");


/* =====================================
   OPEN ADD FORM
===================================== */

function openAddForm() {

    editingTripId = null;

    tripForm.reset();

    document.getElementById(
        "formTitle"
    ).textContent = "Add New Trip";

    resetPreview();

    formSection.style.display = "block";

    formSection.scrollIntoView({
        behavior: "smooth"
    });
}


/* =====================================
   CLOSE FORM
===================================== */

function closeForm() {

    formSection.style.display = "none";

    tripForm.reset();

    editingTripId = null;

    resetPreview();

    document.getElementById(
        "formTitle"
    ).textContent = "Add New Trip";
}


/* =====================================
   RESET IMAGE PREVIEW
===================================== */

function resetPreview() {

    imagePreview.src = "";

    imagePreview.style.display = "none";

    previewMessage.style.display = "block";
}


/* =====================================
   FILE READER IMAGE PREVIEW
===================================== */

imageInput.addEventListener(
    "change",
    function () {

        const file = this.files[0];


        if (!file) {
            return;
        }


        /* CHECK IMAGE */

        if (!file.type.startsWith("image/")) {

            alert(
                "Please select a valid image file."
            );

            imageInput.value = "";

            return;
        }


        /* FILE SIZE */

        const maxSize =
            5 * 1024 * 1024;


        if (file.size > maxSize) {

            alert(
                "Please select an image smaller than 5 MB."
            );

            imageInput.value = "";

            return;
        }


        /* FILEREADER */

        const reader =
            new FileReader();


        reader.onload = function (event) {

            /*
                event.target.result
                = Base64 image string
            */

            imagePreview.src =
                event.target.result;

            imagePreview.style.display =
                "block";

            previewMessage.style.display =
                "none";
        };


        reader.onerror = function () {

            alert(
                "Unable to read the image."
            );

            resetPreview();
        };


        reader.readAsDataURL(file);

    }
);


/* =====================================
   SAVE TRIP
===================================== */

tripForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const destination =
            document.getElementById(
                "destination"
            ).value.trim();


        const country =
            document.getElementById(
                "country"
            ).value.trim();


        const date =
            document.getElementById(
                "date"
            ).value;


        const description =
            document.getElementById(
                "description"
            ).value.trim();


        /* VALIDATION */

        if (
            !destination ||
            !country ||
            !date ||
            !description
        ) {

            alert(
                "Please fill all required fields."
            );

            return;
        }


        /* =================================
           EDIT EXISTING TRIP
        ================================= */

        if (editingTripId !== null) {

            const index =
                trips.findIndex(
                    trip =>
                        trip.id === editingTripId
                );


            if (index !== -1) {

                /*
                   Keep old image if
                   user did not select
                   a new image.
                */

                let image =
                    trips[index].image || "";


                if (
                    imagePreview.src &&
                    imagePreview.src.startsWith(
                        "data:image"
                    )
                ) {

                    image =
                        imagePreview.src;
                }


                trips[index] = {

                    ...trips[index],

                    destination,

                    country,

                    date,

                    description,

                    image
                };

            }

        }


        /* =================================
           ADD NEW TRIP
        ================================= */

        else {

            let image = "";


            /*
               If image selected,
               preview already contains
               Base64 string.
            */

            if (
                imagePreview.src &&
                imagePreview.src.startsWith(
                    "data:image"
                )
            ) {

                image =
                    imagePreview.src;
            }


            const newTrip = {

                id: Date.now(),

                destination,

                country,

                date,

                description,

                image
            };


            trips.push(newTrip);
        }


        /* =================================
           SAVE LOCAL STORAGE
        ================================= */

        localStorage.setItem(
            "trips",
            JSON.stringify(trips)
        );


        /* RESET */

        closeForm();


        /* DISPLAY */

        displayTrips();

    }
);


/* =====================================
   DISPLAY TRIPS
===================================== */

function displayTrips() {

    loadingState.style.display = "none";

    tripContainer.innerHTML = "";


    /* COUNT */

    const count =
        trips.length;


    document.getElementById(
        "tripCount"
    ).textContent =
        `${count} trip${count === 1 ? "" : "s"}`;


    /* EMPTY STATE */

    if (trips.length === 0) {

        emptyState.style.display = "block";

        return;
    }


    emptyState.style.display = "none";


    /* CREATE CARDS */

    trips.forEach(
        trip => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "trip-card";


            /* IMAGE */

            let imageHTML = "";


            if (trip.image) {

                imageHTML = `

                    <img
                        src="${trip.image}"
                        class="trip-image"
                        alt="Trip photo"
                        onerror="imageError(this)"
                    >

                `;

            } else {

                imageHTML = `

                    <div class="no-image">
                        📷 No Photo
                    </div>

                `;
            }


            /* CARD */

            card.innerHTML = `

                ${imageHTML}

                <div class="trip-content">

                    <h3>
                        ${escapeHTML(
                            trip.destination
                        )}
                    </h3>

                    <p>
                        📍
                        ${escapeHTML(
                            trip.country
                        )}
                    </p>

                    <p>
                        📅 ${trip.date}
                    </p>

                    <p>
                        ${escapeHTML(
                            trip.description
                        )}
                    </p>


                    <div class="trip-actions">

                        <button
                            class="view-btn"
                            onclick="viewTrip(${trip.id})"
                        >
                            View
                        </button>


                        <button
                            class="edit-btn"
                            onclick="editTrip(${trip.id})"
                        >
                            Edit
                        </button>


                        <button
                            class="delete-btn"
                            onclick="deleteTrip(${trip.id})"
                        >
                            Delete
                        </button>

                    </div>

                </div>
            `;


            tripContainer.appendChild(card);

        }
    );
}


/* =====================================
   IMAGE ERROR
===================================== */

function imageError(image) {

    image.style.display = "none";

    const fallback =
        document.createElement("div");

    fallback.className =
        "no-image";

    fallback.textContent =
        "📷 Image unavailable";

    image.parentElement.insertBefore(
        fallback,
        image.nextSibling
    );
}


/* =====================================
   VIEW DETAIL
===================================== */

function viewTrip(id) {

    const trip =
        trips.find(
            item =>
                item.id === id
        );


    if (!trip) {
        return;
    }


    const imageContainer =
        document.getElementById(
            "detailImageContainer"
        );


    /* IMAGE */

    if (trip.image) {

        imageContainer.innerHTML = `

            <img
                src="${trip.image}"
                class="detail-image"
                alt="Trip photo"
                onerror="detailImageError(this)"
            >

        `;

    } else {

        imageContainer.innerHTML = `

            <div class="detail-no-image">
                📷 No Photo Available
            </div>

        `;
    }


    /* DETAILS */

    document.getElementById(
        "detailDestination"
    ).textContent =
        trip.destination;


    document.getElementById(
        "detailCountry"
    ).textContent =
        "📍 " + trip.country;


    document.getElementById(
        "detailDate"
    ).textContent =
        "📅 " + trip.date;


    document.getElementById(
        "detailDescription"
    ).textContent =
        trip.description;


    /* OPEN MODAL */

    document.getElementById(
        "detailModal"
    ).style.display =
        "flex";
}


/* =====================================
   DETAIL IMAGE ERROR
===================================== */

function detailImageError(image) {

    image.style.display = "none";

    const fallback =
        document.createElement("div");

    fallback.className =
        "detail-no-image";

    fallback.textContent =
        "📷 Image unavailable";

    image.parentElement.appendChild(
        fallback
    );
}


/* =====================================
   CLOSE DETAIL
===================================== */

function closeDetail() {

    document.getElementById(
        "detailModal"
    ).style.display =
        "none";
}


/* =====================================
   DELETE TRIP
===================================== */

function deleteTrip(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this trip?"
        );


    if (!confirmDelete) {
        return;
    }


    trips =
        trips.filter(
            trip =>
                trip.id !== id
        );


    localStorage.setItem(
        "trips",
        JSON.stringify(trips)
    );


    displayTrips();
}


/* =====================================
   EDIT TRIP
===================================== */

function editTrip(id) {

    const trip =
        trips.find(
            item =>
                item.id === id
        );


    if (!trip) {
        return;
    }


    editingTripId =
        id;


    document.getElementById(
        "destination"
    ).value =
        trip.destination;


    document.getElementById(
        "country"
    ).value =
        trip.country;


    document.getElementById(
        "date"
    ).value =
        trip.date;


    document.getElementById(
        "description"
    ).value =
        trip.description;


    /* OLD IMAGE */

    if (trip.image) {

        imagePreview.src =
            trip.image;

        imagePreview.style.display =
            "block";

        previewMessage.style.display =
            "none";

    } else {

        resetPreview();
    }


    document.getElementById(
        "formTitle"
    ).textContent =
        "Edit Trip";


    formSection.style.display =
        "block";


    formSection.scrollIntoView({
        behavior: "smooth"
    });
}


/* =====================================
   ESCAPE HTML
===================================== */

function escapeHTML(value) {

    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );
}


/* =====================================
   CLOSE MODAL WHEN CLICK OUTSIDE
===================================== */

window.addEventListener(
    "click",
    function (event) {

        const modal =
            document.getElementById(
                "detailModal"
            );


        if (
            event.target === modal
        ) {

            closeDetail();
        }
    }
);


/* =====================================
   INITIAL LOAD
===================================== */

setTimeout(
    function () {

        displayTrips();

    },
    300
);