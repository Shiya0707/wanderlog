/* =====================================
   WANDERLOG PUBLIC PROFILE
===================================== */


/* =====================================
   GET TRIPS FROM LOCAL STORAGE
===================================== */

const trips =
    JSON.parse(
        localStorage.getItem("trips")
    ) || [];


/* =====================================
   GET USER FROM URL
===================================== */

const urlParams =
    new URLSearchParams(
        window.location.search
    );


const username =
    urlParams.get("user") || "Belsiya";


/* =====================================
   PROFILE DATA
===================================== */

const profiles = {

    Belsiya: {

        name: "Belsiya A",

        bio:
            "B.Tech IT student passionate about UI/UX Design, Web Development and travelling."

    }

};


/* =====================================
   GET PROFILE
===================================== */

const profile =
    profiles[username] || {

        name: username,

        bio:
            "Travel enthusiast sharing beautiful memories through Wanderlog."

    };


/* =====================================
   DISPLAY PROFILE INFO
===================================== */

document.getElementById(
    "profileName"
).textContent =
    profile.name;


document.getElementById(
    "profileBio"
).textContent =
    profile.bio;


document.getElementById(
    "profileTripCount"
).textContent =
    `${trips.length} trip${trips.length === 1 ? "" : "s"}`;


/* =====================================
   ELEMENTS
===================================== */

const loading =
    document.getElementById(
        "profileLoading"
    );

const container =
    document.getElementById(
        "profileTrips"
    );

const empty =
    document.getElementById(
        "profileEmpty"
    );


/* =====================================
   DISPLAY PROFILE TRIPS
===================================== */

function displayProfileTrips() {

    loading.style.display =
        "none";


    container.innerHTML = "";


    /* =================================
       EMPTY STATE
    ================================= */

    if (trips.length === 0) {

        empty.style.display =
            "block";

        return;
    }


    empty.style.display =
        "none";


    /* =================================
       CREATE READ-ONLY CARDS
    ================================= */

    trips.forEach(
        trip => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "trip-card";


            let imageHTML = "";


            /* IMAGE */

            if (trip.image) {

                imageHTML = `

                    <img
                        src="${trip.image}"
                        class="trip-image"
                        alt="Trip photo"
                        onerror="profileImageError(this)"
                    >

                `;

            } else {

                imageHTML = `

                    <div class="no-image">
                        📷 No Photo
                    </div>

                `;
            }


            /* =================================
               READ-ONLY CARD

               IMPORTANT:
               No Edit button.
               No Delete button.
            ================================= */

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

                </div>

            `;


            container.appendChild(card);

        }
    );
}


/* =====================================
   IMAGE ERROR
===================================== */

function profileImageError(image) {

    image.style.display =
        "none";


    const fallback =
        document.createElement(
            "div"
        );


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
   START
===================================== */

setTimeout(
    function () {

        displayProfileTrips();

    },
    300
);