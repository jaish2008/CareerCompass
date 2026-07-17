"use strict";

const $ = (id) => document.getElementById(id);


/* =====================================================
   BASIC RESUME FIELDS
   ===================================================== */

const simpleFields = [

    {
        input: "name",
        preview: "previewName",
        fallback: "Your Name"
    },

    {
        input: "email",
        preview: "previewEmail",
        fallback: "Email"
    },

    {
        input: "phone",
        preview: "previewPhone",
        fallback: "Phone"
    },

    {
        input: "objective",
        preview: "previewObjective",
        fallback: ""
    },

    {
        input: "skills",
        preview: "previewSkills",
        fallback: ""
    },

    {
        input: "degree",
        preview: "previewDegree",
        fallback: ""
    },

    {
        input: "college",
        preview: "previewCollege",
        fallback: ""
    },

    {
        input: "year",
        preview: "previewYear",
        fallback: ""
    },

    {
        input: "cgpa",
        preview: "previewCGPA",
        fallback: ""
    }

];


simpleFields.forEach(function (field) {

    const inputElement = $(field.input);
    const previewElement = $(field.preview);

    if (!inputElement || !previewElement) {
        return;
    }

    function updatePreview() {

        previewElement.textContent =
            inputElement.value.trim() ||
            field.fallback;
    }

    inputElement.addEventListener(
        "input",
        updatePreview
    );

    updatePreview();
});


/* =====================================================
   REPEATABLE SECTIONS
   ===================================================== */

const repeatSections = {

    project: {

        container: $("projectsContainer"),
        addButton: $("addProjectBtn"),

        previewSection:
            $("projectsPreviewSection"),

        previewList:
            $("previewProjectsList"),

        fields: [

            {
                key: "title",
                label: "Project Title",
                placeholder: "CareerCompass"
            },

            {
                key: "technology",
                label: "Technology Used",
                placeholder:
                    "HTML, CSS, JavaScript"
            },

            {
                key: "description",
                label: "Project Description",
                placeholder:
                    "Describe your project",
                textarea: true
            }
        ]
    },


    experience: {

        container: $("experiencesContainer"),
        addButton: $("addExperienceBtn"),

        previewSection:
            $("experiencesPreviewSection"),

        previewList:
            $("previewExperiencesList"),

        fields: [

            {
                key: "company",
                label: "Company Name",
                placeholder: "Company name"
            },

            {
                key: "role",
                label: "Job Role",
                placeholder:
                    "Frontend Developer Intern"
            },

            {
                key: "duration",
                label: "Duration",
                placeholder:
                    "January 2026 - March 2026"
            },

            {
                key: "description",
                label: "Experience Description",
                placeholder:
                    "Describe your responsibilities",
                textarea: true
            }
        ]
    },


    certificate: {

        container: $("certificatesContainer"),
        addButton: $("addCertificateBtn"),

        previewSection:
            $("certificatesPreviewSection"),

        previewList:
            $("previewCertificatesList"),

        fields: [

            {
                key: "name",
                label: "Certificate Name",
                placeholder:
                    "Python for Everybody"
            },

            {
                key: "issuer",
                label: "Issued By",
                placeholder: "Coursera"
            },

            {
                key: "year",
                label: "Year",
                placeholder: "2026"
            }
        ]
    }
};


/* =====================================================
   CREATE REPEATABLE FORM ITEM
   ===================================================== */

function createRepeatItem(
    sectionType,
    savedValues = {}
) {

    const config =
        repeatSections[sectionType];

    const item =
        document.createElement("div");

    item.className =
        `repeat-item ${sectionType}-item`;


    config.fields.forEach(function (field) {

        const label =
            document.createElement("label");

        label.textContent = field.label;


        const control =
            document.createElement(
                field.textarea
                    ? "textarea"
                    : "input"
            );

        if (!field.textarea) {
            control.type = "text";
        }

        control.dataset.key = field.key;

        control.placeholder =
            field.placeholder;

        control.value =
            savedValues[field.key] || "";

        control.addEventListener(
            "input",
            function () {

                renderRepeatPreview(
                    sectionType
                );
            }
        );


        item.appendChild(label);
        item.appendChild(control);
    });


    const removeButton =
        document.createElement("button");

    removeButton.type = "button";

    removeButton.className =
        "remove-item-btn";

    removeButton.textContent =
        "Remove";


    removeButton.addEventListener(
        "click",
        function () {

            item.remove();

            if (
                config.container.children
                    .length === 0
            ) {
                createRepeatItem(sectionType);
            }

            renderRepeatPreview(
                sectionType
            );
        }
    );


    item.appendChild(removeButton);

    config.container.appendChild(item);
}


/* =====================================================
   GET REPEATABLE DATA
   ===================================================== */

function getRepeatData(sectionType) {

    const config =
        repeatSections[sectionType];

    return Array.from(
        config.container.children
    )
        .map(function (item) {

            const result = {};

            item
                .querySelectorAll(
                    "[data-key]"
                )
                .forEach(
                    function (control) {

                        result[
                            control.dataset.key
                        ] =
                            control.value.trim();
                    }
                );

            return result;
        })
        .filter(function (item) {

            return Object.values(item)
                .some(Boolean);
        });
}


/* =====================================================
   PREVIEW HELPERS
   ===================================================== */

function appendPreviewElement(
    parent,
    tagName,
    text
) {

    if (!text) {
        return;
    }

    const element =
        document.createElement(tagName);

    element.textContent = text;

    parent.appendChild(element);
}


/* =====================================================
   RENDER REPEATABLE PREVIEW
   ===================================================== */

function renderRepeatPreview(sectionType) {

    const config =
        repeatSections[sectionType];

    const records =
        getRepeatData(sectionType);

    config.previewList.innerHTML = "";

    config.previewSection.style.display =
        records.length ? "" : "none";


    records.forEach(function (record) {

        const entry =
            document.createElement("div");

        entry.className =
            "preview-entry";


        if (sectionType === "project") {

            appendPreviewElement(
                entry,
                "h4",
                record.title
            );

            appendPreviewElement(
                entry,
                "p",
                record.technology
                    ? "Technology: " +
                      record.technology
                    : ""
            );

            appendPreviewElement(
                entry,
                "p",
                record.description
            );
        }


        if (sectionType === "experience") {

            appendPreviewElement(
                entry,
                "h4",
                record.company
            );

            appendPreviewElement(
                entry,
                "p",
                record.role
                    ? "Role: " +
                      record.role
                    : ""
            );

            appendPreviewElement(
                entry,
                "p",
                record.duration
                    ? "Duration: " +
                      record.duration
                    : ""
            );

            appendPreviewElement(
                entry,
                "p",
                record.description
            );
        }


        if (sectionType === "certificate") {

            appendPreviewElement(
                entry,
                "h4",
                record.name
            );

            const details = [];

            if (record.issuer) {

                details.push(
                    "Issued By: " +
                    record.issuer
                );
            }

            if (record.year) {
                details.push(record.year);
            }

            appendPreviewElement(
                entry,
                "p",
                details.join(" | ")
            );
        }


        config.previewList.appendChild(
            entry
        );
    });
}


/* =====================================================
   ADD BUTTONS
   ===================================================== */

Object.entries(
    repeatSections
).forEach(function (
    [sectionType, config]
) {

    config.addButton.addEventListener(
        "click",
        function () {

            createRepeatItem(sectionType);

            renderRepeatPreview(
                sectionType
            );
        }
    );
});


/* =====================================================
   LOAD REPEATABLE ITEMS
   ===================================================== */

function loadRepeatItems(
    sectionType,
    records
) {

    const config =
        repeatSections[sectionType];

    config.container.innerHTML = "";

    if (
        Array.isArray(records) &&
        records.length
    ) {

        records.forEach(function (record) {

            createRepeatItem(
                sectionType,
                record
            );
        });

    } else {

        createRepeatItem(sectionType);
    }

    renderRepeatPreview(sectionType);
}


/* =====================================================
   SAVE RESUME
   ===================================================== */

$("saveBtn").addEventListener(
    "click",
    function () {

        const resumeData = {};

        simpleFields.forEach(
            function (field) {

                resumeData[field.input] =
                    $(field.input).value;
            }
        );

        resumeData.projects =
            getRepeatData("project");

        resumeData.experiences =
            getRepeatData("experience");

        resumeData.certificates =
            getRepeatData("certificate");


        localStorage.setItem(
            "careerCompassResume",
            JSON.stringify(resumeData)
        );

        alert(
            "Resume saved successfully!"
        );
    }
);


/* =====================================================
   RESET RESUME
   ===================================================== */

$("resetBtn").addEventListener(
    "click",
    function () {

        const confirmed = confirm(
            "Do you want to clear the resume?"
        );

        if (!confirmed) {
            return;
        }

        localStorage.removeItem(
            "careerCompassResume"
        );

        location.reload();
    }
);


/* =====================================================
   PROFILE PHOTO
   ===================================================== */

const profilePhoto =
    $("profilePhoto");

const previewPhoto =
    $("previewPhoto");


profilePhoto.addEventListener(
    "change",
    function () {

        const file =
            this.files[0];

        if (!file) {

            previewPhoto.style.display =
                "none";

            return;
        }

        const reader =
            new FileReader();

        reader.onload =
            function (event) {

                previewPhoto.src =
                    event.target.result;

                previewPhoto.style.display =
                    "block";
            };

        reader.readAsDataURL(file);
    }
);


/* =====================================================
   DOWNLOAD PDF
   ===================================================== */

$("downloadBtn").addEventListener(
    "click",
    function () {

        const candidateName =
            $("name").value.trim() ||
            "CareerCompass";

        const oldTitle =
            document.title;

        document.title =
            candidateName
                .replace(/\s+/g, "_") +
            "_Resume";

        window.print();

        setTimeout(function () {

            document.title = oldTitle;

        }, 1000);
    }
);


/* =====================================================
   LOAD SAVED RESUME
   ===================================================== */

window.addEventListener(
    "DOMContentLoaded",
    function () {

        let data = {};

        const savedResume =
            localStorage.getItem(
                "careerCompassResume"
            );

        if (savedResume) {

            try {

                data =
                    JSON.parse(savedResume);

            } catch (error) {

                console.error(
                    "Could not load saved resume:",
                    error
                );
            }
        }


        simpleFields.forEach(
            function (field) {

                const inputElement =
                    $(field.input);

                if (
                    data[field.input] !==
                    undefined
                ) {

                    inputElement.value =
                        data[field.input];

                    inputElement.dispatchEvent(
                        new Event("input")
                    );
                }
            }
        );


        const projects =
            Array.isArray(data.projects)
                ? data.projects
                : [];


        const experiences =
            Array.isArray(
                data.experiences
            )
                ? data.experiences
                : [];


        const certificates =
            Array.isArray(
                data.certificates
            )
                ? data.certificates
                : [];


        loadRepeatItems(
            "project",
            projects
        );

        loadRepeatItems(
            "experience",
            experiences
        );

        loadRepeatItems(
            "certificate",
            certificates
        );
    }
);