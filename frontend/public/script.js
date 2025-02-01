const imageUrl = document.querySelector("[name=image]");
const images = document.querySelectorAll("[data-img]");
images.forEach(image => {
    image.addEventListener("click", (e) => {
        e.target.classList.add("border-primary");
        images.forEach(img => {
            if (img !== e.target) {
                img.classList.remove("border-primary");
            }
        });
        imageUrl.value = image.src;
    });
});

// ----------------------------------------------------
const userDm = document.querySelector("#user_dm");
const users = document.querySelectorAll("[data-user]");
users.forEach(user => {
    user.addEventListener("click", (e) => {
        e.target.classList.add("border-primary");
        users.forEach(u => {
            if (u !== e.target) {
                u.classList.remove("border-primary");
            }
        }
        );
        userDm.value = user.getAttribute("data-user");
    });
});

// ----------------------------------------------------
const rodzaj = document.querySelectorAll("[name=rodzaj]");
const responses = document.getElementById("responses");

rodzaj.forEach((rodzaj) => {
    rodzaj.addEventListener("change", (e) => {
        const rodzajValue = e.target.value;
        const rodzajMsg = document.querySelectorAll("[data-rodzaj_form]");
        responses.value = "";

        rodzajMsg.forEach((rm) => {
            if (rm.getAttribute("data-rodzaj_form") === rodzajValue) {
                rm.classList.remove("d-none");
            } else {
                rm.classList.add("d-none");
                const msg = rm.querySelector("textarea");
                if (msg) {
                    msg.value = "";
                }
            }
        });

        if (rodzajValue === "kanal" || rodzajValue === "priv") {
            document.getElementById("responses_div").classList.remove("d-none");
        } else {
            document.getElementById("responses_div").classList.add("d-none");
        }
    });
});


// ----------------------------------------------------

responses.addEventListener("change", (e) => {
    const responseValue = e.target.options[e.target.selectedIndex].text === "wybierz" ? "" : e.target.options[e.target.selectedIndex].text;

    rodzaj.forEach((rodzaj) => {
        const rodzajValue = rodzaj.value;
        const msg = document.querySelector(`[data-msg=${rodzajValue}]`);
        if (rodzaj.checked) {      
            msg.value = responseValue;
        } else {
            msg.value = "";
        }
    });
});

// ----------------------------------------------------

const editBtn = document.querySelectorAll("[data-edit]");
const editModal = document.getElementById("editModal");

editBtn.forEach((btn) => {
    btn.addEventListener("click", async (e) => {
        const edit = e.target.getAttribute("data-edit");
        const title = `Edytuj ${edit}`;

        const res = await fetch(`/items/${edit}`);
        const data = await res.json();

        let content = "";

        data.forEach((d) => {
            content += `
                <div class="d-flex justify-content-between gap-1" id="${d._id}">
                    ${edit === "images" ? `<img src="${d.value}" class="img-thumbnail" style="width: 100px;">` : ""}
                    <input type="text" name="${edit}" class="form-control" value="${d.value}">
                    <button type="button" class="btn btn-sm btn-danger" data-delete="${d._id}">Usuń</button>
                </div>
            `;
        });

        const editForm = editModal.querySelector("#editForm");
        const modalTitle = editModal.querySelector(".modal-title");

        editForm.innerHTML = content;


        const deleteBtns = editModal.querySelectorAll("[data-delete]");
        deleteBtns.forEach((btn) => {
            btn.addEventListener("click", async (e) => {
                const id = `${e.target.getAttribute("data-delete")}`;

                const res = await fetch(`/items/${edit}/${id}`, {
                    method: "DELETE",
                });

                if (!res.ok) {
                    alert("Coś poszło nie tak");
                    return;
                }

                const elToDelete = document.getElementById(id);
                elToDelete.remove();
            });
        });

        const addBtn = document.querySelector("[data-add]");
        addBtn.addEventListener("click", (e) => {
            const newInput = document.createElement("div");
            newInput.innerHTML = `
                <div class="d-flex justify-content-between gap-1">
                    <input type="text" name="${edit}" class="form-control">
                    <button type="button" class="btn btn-sm btn-success" data-save="${edit}">Zapisz</button>
                </div>
            `;
            editForm.appendChild(newInput);

            const saveBtn = newInput.querySelector("[data-save]");
            saveBtn.addEventListener("click", async (e) => {
                const value = e.target.parentElement.querySelector("input").value;

                const res = await fetch(`/items/${edit}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ value }),
                });

                if (!res.ok) {
                    alert("Coś poszło nie tak");
                    return;
                }

                const data = await res.json();

                const option = `<option value="${data._id}">${data.value}</option>`
                responses.innerHTML += option;

                const parentElement = e.target.parentElement
                e.target.remove();

                parentElement.innerHTML = `
                    <input type="text" name="${edit}" class="form-control" value="${data.value}">
                    <button type="button" class="btn btn-sm btn-danger" data-delete="${data._id}">Usuń</button>
                `;
                parentElement.parentElement.id = data._id;

                const deleteBtn = parentElement.querySelector("[data-delete]");
                deleteBtn.addEventListener("click", async (e) => {
                    const id = `${e.target.getAttribute("data-delete")}`;
                    const res = await fetch(`/items/${edit}/${id}`, {
                        method: "DELETE",
                    });

                    if (!res.ok) {
                        alert("Coś poszło nie tak");
                        return;
                    }

                    const elToDelete = document.getElementById(id);
                    elToDelete.remove();
                });

            });
        });

        modalTitle.value = title;

    });
});


