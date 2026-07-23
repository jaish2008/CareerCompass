"use strict";

(function initializeResumePdfDownload() {

    function bindDownloadButton() {

        const downloadButton =
            document.getElementById("downloadBtn");

        if (!downloadButton) {
            console.error(
                "Resume download button was not found."
            );
            return;
        }

        downloadButton.addEventListener(
            "click",
            function () {

                const resumePreview =
                    document.querySelector(
                        ".resume-preview"
                    );

                if (!resumePreview) {
                    alert(
                        "Resume preview could not be found."
                    );
                    return;
                }

                const nameInput =
                    document.getElementById("name");

                const candidateName =
                    (
                        nameInput?.value ||
                        "CareerCompass"
                    ).trim();

                const previousTitle =
                    document.title;

                document.title =
                    candidateName
                        .replace(/[^\w-]+/g, "_")
                        .replace(/^_+|_+$/g, "") +
                    "_Resume";

                window.requestAnimationFrame(
                    function () {

                        window.print();

                        window.setTimeout(
                            function () {
                                document.title =
                                    previousTitle;
                            },
                            1000
                        );
                    }
                );
            }
        );
    }

    if (document.readyState === "loading") {

        document.addEventListener(
            "DOMContentLoaded",
            bindDownloadButton
        );

    } else {

        bindDownloadButton();

    }

})();