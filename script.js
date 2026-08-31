const DAILY_TARGET = 108;
const TOTAL_DAYS = 16;
const TOTAL_TARGET = DAILY_TARGET * TOTAL_DAYS;

const STORAGE_KEY = "hanuman108Progress";


// ============================================
// HTML ELEMENTS
// ============================================

const countElement =
    document.getElementById("count");

const dayNumberElement =
    document.getElementById("dayNumber");

const progressBar =
    document.getElementById("progressBar");

const percentageElement =
    document.getElementById("percentage");

const chantButton =
    document.getElementById("chantButton");

const chantImage =
    document.getElementById("chantImage");

const resetButton =
    document.getElementById("resetButton");

const completion =
    document.getElementById("completion");

const completionTitle =
    document.getElementById("completionTitle");

const nextDayQuestion =
    document.getElementById("nextDayQuestion");

const nextDayButton =
    document.getElementById("nextDayButton");

const laterButton =
    document.getElementById("laterButton");

const daysGrid =
    document.getElementById("daysGrid");

const totalCountElement =
    document.getElementById("totalCount");

const overallProgress =
    document.getElementById("overallProgress");

const overallPercentage =
    document.getElementById("overallPercentage");

const finalCompletion =
    document.getElementById("finalCompletion");

const newSankalpButton =
    document.getElementById("newSankalpButton");


// ============================================
// AUDIO
// ============================================

const mantraAudio =
    document.getElementById("mantraAudio");

const soundButton =
    document.getElementById("soundButton");

// Audio is OFF when app opens
let soundEnabled = false;


// ============================================
// INITIAL DATA
// ============================================

function createInitialData() {

    return {
        currentDay: 1,
        days: Array(TOTAL_DAYS).fill(0)
    };
}


// ============================================
// LOAD SAVED DATA
// ============================================

function loadData() {

    try {

        const saved =
            localStorage.getItem(STORAGE_KEY);

        if (!saved) {
            return createInitialData();
        }

        const data =
            JSON.parse(saved);

        if (
            !Array.isArray(data.days) ||
            data.days.length !== TOTAL_DAYS
        ) {

            return createInitialData();
        }

        // Make sure currentDay is valid
        if (
            typeof data.currentDay !== "number" ||
            data.currentDay < 1 ||
            data.currentDay > TOTAL_DAYS
        ) {

            data.currentDay = 1;
        }

        return data;

    } catch (error) {

        console.error(
            "Error loading progress:",
            error
        );

        return createInitialData();
    }
}


let appData = loadData();


// ============================================
// SAVE DATA
// ============================================

function saveData() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(appData)
    );
}


// ============================================
// TOTAL COUNT
// ============================================

function getTotalCount() {

    return appData.days.reduce(
        (total, count) =>
            total + count,
        0
    );
}


// ============================================
// MAIN RENDER
// ============================================

function render() {

    const currentDay =
        appData.currentDay;

    const index =
        currentDay - 1;

    const currentCount =
        appData.days[index];


    // ----------------------------------------
    // Current day
    // ----------------------------------------

    dayNumberElement.textContent =
        currentDay;


    // ----------------------------------------
    // Current count
    // ----------------------------------------

    countElement.textContent =
        currentCount;


    // ----------------------------------------
    // Daily percentage
    // ----------------------------------------

    const dailyPercentage =
        Math.round(
            (currentCount / DAILY_TARGET) * 100
        );


    progressBar.style.width =
        dailyPercentage + "%";


    percentageElement.textContent =
        dailyPercentage + "%";


    // ----------------------------------------
    // Day completion
    // ----------------------------------------

    if (
        currentCount >= DAILY_TARGET
    ) {

        chantButton.disabled = true;


        // Days 1-15
        if (
            currentDay < TOTAL_DAYS
        ) {

            completion.classList.remove(
                "hidden"
            );


            completionTitle.textContent =
                `Day ${currentDay} Completed!`;


            nextDayQuestion.textContent =
                `Are you ready to begin Day ${
                    currentDay + 1
                }?`;


            nextDayButton.textContent =
                `Yes, Start Day ${
                    currentDay + 1
                }`;


            nextDayButton.style.display =
                "inline-block";


        } else {

            // Day 16 completed

            completion.classList.add(
                "hidden"
            );

            finalCompletion.classList.remove(
                "hidden"
            );
        }


    } else {

        chantButton.disabled = false;

        completion.classList.add(
            "hidden"
        );

        finalCompletion.classList.add(
            "hidden"
        );
    }


    // ========================================
    // TOTAL PROGRESS
    // ========================================

    const total =
        getTotalCount();


    totalCountElement.textContent =
        total.toLocaleString();


    const totalPercentage =
        Math.round(
            (total / TOTAL_TARGET) * 100
        );


    overallProgress.style.width =
        totalPercentage + "%";


    overallPercentage.textContent =
        totalPercentage + "% completed";


    // ========================================
    // DAY GRID
    // ========================================

    renderDays();
}


// ============================================
// RENDER 16 DAY PROGRESS
// ============================================

function renderDays() {

    daysGrid.innerHTML = "";


    for (
        let i = 0;
        i < TOTAL_DAYS;
        i++
    ) {

        const day =
            i + 1;

        const count =
            appData.days[i];


        const card =
            document.createElement("div");


        card.className =
            "day-card";


        const title =
            document.createElement("strong");


        title.textContent =
            `Day ${day}`;


        const progress =
            document.createElement("span");


        // ====================================
        // COMPLETED DAY
        // ====================================

        if (
            count >= DAILY_TARGET
        ) {

            card.classList.add(
                "completed"
            );


            progress.textContent =
                "✓ 108 / 108";


            card.appendChild(title);

            card.appendChild(progress);


            // --------------------------------
            // Start next day
            // --------------------------------

            if (
                day === appData.currentDay &&
                day < TOTAL_DAYS
            ) {

                const startButton =
                    document.createElement("button");


                startButton.type =
                    "button";


                startButton.className =
                    "day-start-button";


                startButton.textContent =
                    `Start Day ${day + 1} →`;


                startButton.addEventListener(
                    "click",
                    startNextDay
                );


                card.appendChild(
                    startButton
                );
            }


        }


        // ====================================
        // CURRENT DAY
        // ====================================

        else if (
            day === appData.currentDay
        ) {

            card.classList.add(
                "current"
            );


            progress.textContent =
                `${count} / 108`;


            card.appendChild(title);

            card.appendChild(progress);


        }


        // ====================================
        // LOCKED DAY
        // ====================================

        else {

            card.classList.add(
                "locked"
            );


            progress.textContent =
                "🔒 Locked";


            card.appendChild(title);

            card.appendChild(progress);
        }


        daysGrid.appendChild(card);
    }
}


// ============================================
// CHANT
// ============================================
// IMPORTANT:
// JAP does NOT play audio.
// JAP ONLY increases the count.
// ============================================

function chant() {

    const index =
        appData.currentDay - 1;


    // Stop after 108

    if (
        appData.days[index] >=
        DAILY_TARGET
    ) {

        return;
    }


    // Increase count

    appData.days[index]++;


    // Save progress

    saveData();


    // Update screen

    render();


    // ----------------------------------------
    // Hanuman image animation
    // ----------------------------------------

    const image =
        document.querySelector(
            ".hanuman-image"
        );


    if (image) {

        image.animate(
            [
                {
                    transform: "scale(1)"
                },

                {
                    transform: "scale(0.94)"
                },

                {
                    transform: "scale(1.04)"
                },

                {
                    transform: "scale(1)"
                }
            ],

            {
                duration: 280,

                easing: "ease-out"
            }
        );
    }
}


// ============================================
// RESET TODAY
// ============================================

function resetToday() {

    const currentDay =
        appData.currentDay;

    const index =
        currentDay - 1;


    if (
        !confirm(
            `Reset Day ${currentDay} count to 0?`
        )
    ) {

        return;
    }


    appData.days[index] = 0;


    saveData();


    render();
}


// ============================================
// START NEXT DAY
// ============================================

function startNextDay() {

    const currentDay =
        appData.currentDay;


    // Don't go beyond Day 16

    if (
        currentDay >= TOTAL_DAYS
    ) {

        return;
    }


    // Current day must be completed

    if (
        appData.days[currentDay - 1] <
        DAILY_TARGET
    ) {

        return;
    }


    // Move to next day

    appData.currentDay =
        currentDay + 1;


    saveData();


    render();


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// ============================================
// NOT NOW
// ============================================

function closeCompletion() {

    completion.classList.add(
        "hidden"
    );
}


// ============================================
// START NEW 16-DAY SANKALP
// ============================================

function startNewSankalp() {

    const confirmed =
        confirm(
            "Start a new 16-day Sankalp?\n\n" +
            "This will reset all 16 days " +
            "and start again from Day 1."
        );


    if (!confirmed) {

        return;
    }


    // Reset all days

    appData = {

        currentDay: 1,

        days:
            Array(TOTAL_DAYS).fill(0)
    };


    // Save new Sankalp

    saveData();


    // Turn audio OFF

    soundEnabled = false;


    if (mantraAudio) {

        mantraAudio.pause();

        mantraAudio.currentTime = 0;
    }


    if (soundButton) {

        soundButton.textContent =
            "🔇";

        soundButton.setAttribute(
            "aria-label",
            "Turn mantra sound on"
        );
    }


    // Update screen

    render();


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// ============================================
// SPEAKER BUTTON
// ============================================
// Speaker ONLY controls audio.
// It does NOT count a mantra.
// ============================================

function toggleSound() {

    if (!mantraAudio) {

        return;
    }


    // ----------------------------------------
    // TURN AUDIO ON
    // ----------------------------------------

    if (!soundEnabled) {

        soundEnabled = true;


        if (soundButton) {

            soundButton.textContent =
                "🔊";

            soundButton.setAttribute(
                "aria-label",
                "Turn mantra sound off"
            );
        }


        // Start mantra audio

        mantraAudio.currentTime = 0;

        mantraAudio.play().catch(
            error => {

                console.log(
                    "Audio playback error:",
                    error
                );
            }
        );


    }


    // ----------------------------------------
    // TURN AUDIO OFF
    // ----------------------------------------

    else {

        soundEnabled = false;


        mantraAudio.pause();

        mantraAudio.currentTime = 0;


        if (soundButton) {

            soundButton.textContent =
                "🔇";

            soundButton.setAttribute(
                "aria-label",
                "Turn mantra sound on"
            );
        }
    }
}


// ============================================
// BUTTON EVENTS
// ============================================

chantButton.addEventListener(
    "click",
    chant
);


chantImage.addEventListener(
    "click",
    chant
);


resetButton.addEventListener(
    "click",
    resetToday
);


nextDayButton.addEventListener(
    "click",
    startNextDay
);


laterButton.addEventListener(
    "click",
    closeCompletion
);


newSankalpButton.addEventListener(
    "click",
    startNewSankalp
);


if (soundButton) {

    soundButton.addEventListener(
        "click",
        toggleSound
    );
}


// ============================================
// KEYBOARD SUPPORT
// ============================================

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.code === "Space" &&
            event.target.tagName !== "INPUT" &&
            event.target.tagName !== "TEXTAREA" &&
            event.target.tagName !== "BUTTON"
        ) {

            event.preventDefault();

            chant();
        }
    }
);


// ============================================
// START APP
// ============================================

render();