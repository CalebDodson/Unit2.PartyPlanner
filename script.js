const submitBtn = document.getElementById("submit");
const partyInput = document.getElementById("name");
const descriptionInput = document.getElementById("description");
const dateInput = document.getElementById("date");
const locationInput = document.getElementById("location");
const partyContainer = document.getElementById("partyContainer");

const apiURL = "https://fsa-crud-2aa9294fe819.herokuapp.com/api/2410-FTB-ET-WEB-FT/events";

const state = {
    eventsData: [],
};

// Fetch event data from the API
async function fetchData() {
    try {
        const response = await fetch(apiURL);        
        const json = await response.json();
        state.eventsData = json.data;
    } catch (error) {
        console.error(error);
    }
};

// Render the events to the DOM
async function render() {
    await fetchData();
    renderParties();
}

// Render the list of parties
async function renderParties() {
    partyContainer.innerHTML = "";  // Clear the container before re-rendering
    if (!state.eventsData.length) {
        partyContainer.innerHTML = `<p>No parties found.</p>`;
        return;
    }

    state.eventsData.forEach((event) => {
        const sectionElement = document.createElement("section");
        sectionElement.classList.add("partyBox");

        const formattedDate = new Date(event.date).toLocaleDateString();

        sectionElement.innerHTML = `
            <h2>Who?</h2>
            <p>${event.name}</p>
            <h2>What?</h2>
            <p>${event.description}</p>
            <h2>When?</h2>
            <p>${formattedDate}</p>
            <h2>Where?</h2>
            <p>${event.location}</p>
            <button class="delete" data-id="${event.id}">Delete</button>
        `;

        // Add delete button event listener
        const deleteBtn = sectionElement.querySelector(".delete");
        deleteBtn.addEventListener("click", async () => {
            await deleteParty(event.id);  // Delete the party based on its ID
        });

        partyContainer.appendChild(sectionElement);
    });
}

// Create a new party event
async function createParty(party, description, date, location) {
    try {
        const cohortId = 498;
        const formattedDate = new Date(date).toISOString();
        const response = await fetch(apiURL, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                name: party, 
                description: description,
                date: formattedDate, 
                location: location,
                cohortId: cohortId
            }),
        });
        const json = await response.json();
        console.log(json);
        await render();  // Re-render after creating a new party
    } catch (error) {
        console.error(error);
    }
}

// Delete a party event
async function deleteParty(id) {
    try {
        const response = await fetch(`${apiURL}/${id}`, {
            method: "DELETE",
        });
        if (!response.ok) {
            throw new Error("Party could not be deleted");
        }
        await render();  // Re-render after deleting a party
    } catch (error) {
        console.error(error);
    }
}

// Handle form submission
submitBtn.addEventListener("click", async (event) => {
    event.preventDefault();

    const party = partyInput.value.trim();
    const description = descriptionInput.value.trim();
    const date = dateInput.value;
    const location = locationInput.value.trim();

    if (party && description && date && location) {
        await createParty(party, description, date, location);
        
        // Reset the form after submission
        partyInput.value = "";
        descriptionInput.value = "";
        dateInput.value = "";
        locationInput.value = "";
        console.log("Party:", party);
        console.log("Description:", description);
        console.log("Date:", date);
        console.log("Location:", location);
    } else {
        console.error("Please fill in all fields.");
    }
});

render();