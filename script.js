const DAILY_TARGET = 108;
const TOTAL_DAYS = 16;
const TOTAL_TARGET = DAILY_TARGET * TOTAL_DAYS;
const STORAGE_KEY = "hanuman108Progress";

const countElement = document.getElementById("count");
const dayNumberElement = document.getElementById("dayNumber");
const progressBar = document.getElementById("progressBar");
const percentageElement = document.getElementById("percentage");
const chantButton = document.getElementById("chantButton");
const chantImage = document.getElementById("chantImage");
const resetButton = document.getElementById("resetButton");
const completion = document.getElementById("completion");
const completionTitle = document.getElementById("completionTitle");
const nextDayQuestion = document.getElementById("nextDayQuestion");
const nextDayButton = document.getElementById("nextDayButton");
const laterButton = document.getElementById("laterButton");
const daysGrid = document.getElementById("daysGrid");
const totalCountElement = document.getElementById("totalCount");
const overallProgress = document.getElementById("overallProgress");
const overallPercentage = document.getElementById("overallPercentage");
const finalCompletion = document.getElementById("finalCompletion");

function createInitialData() {
    return {
        currentDay: 1,
        days: Array(TOTAL_DAYS).fill(0)
    };
}

function loadData() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (!saved) return createInitialData();

        const data = JSON.parse(saved);

        if (!Array.isArray(data.days) || data.days.length !== TOTAL_DAYS) {
            return createInitialData();
        }

        return data;
    } catch {
        return createInitialData();
    }
}

let appData = loadData();

function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appData));
}

function getTotalCount() {
    return appData.days.reduce((sum, value) => sum + value, 0);
}

function render() {
    const currentDay = appData.currentDay;
    const index = currentDay - 1;
    const currentCount = appData.days[index];

    dayNumberElement.textContent = currentDay;
    countElement.textContent = currentCount;

    const dailyPercentage = Math.round((currentCount / DAILY_TARGET) * 100);

    progressBar.style.width = dailyPercentage + "%";
    percentageElement.textContent = dailyPercentage + "%";

    if (currentCount >= DAILY_TARGET) {
        chantButton.disabled = true;

        if (currentDay < TOTAL_DAYS) {
            completion.classList.remove("hidden");

            completionTitle.textContent = `Day ${currentDay} Completed!`;
            nextDayQuestion.textContent =
                `Are you ready to begin Day ${currentDay + 1}?`;

            nextDayButton.textContent =
                `Yes, Start Day ${currentDay + 1}`;

            nextDayButton.style.display = "inline-block";
        } else {
            completion.classList.add("hidden");
            finalCompletion.classList.remove("hidden");
        }
    } else {
        chantButton.disabled = false;
        completion.classList.add("hidden");
        finalCompletion.classList.add("hidden");
    }

    const total = getTotalCount();

    totalCountElement.textContent = total.toLocaleString();

    const totalPercentage = Math.round((total / TOTAL_TARGET) * 100);

    overallProgress.style.width = totalPercentage + "%";
    overallPercentage.textContent = totalPercentage + "% completed";

    renderDays();
}

function renderDays() {
    daysGrid.innerHTML = "";

    for (let i = 0; i < TOTAL_DAYS; i++) {
        const day = i + 1;
        const count = appData.days[i];

        const card = document.createElement("div");
        card.className = "day-card";

        const title = document.createElement("strong");
        title.textContent = `Day ${day}`;

        const progress = document.createElement("span");

        if (count >= DAILY_TARGET) {
            card.classList.add("completed");
            progress.textContent = "✓ 108 / 108";

            card.appendChild(title);
            card.appendChild(progress);

            if (day === appData.currentDay && day < TOTAL_DAYS) {
                const startButton = document.createElement("button");

                startButton.type = "button";
                startButton.className = "day-start-button";
                startButton.textContent = `Start Day ${day + 1} →`;

                startButton.addEventListener("click", startNextDay);

                card.appendChild(startButton);
            }
        } else if (day === appData.currentDay) {
            card.classList.add("current");
            progress.textContent = `${count} / 108`;

            card.appendChild(title);
            card.appendChild(progress);
        } else {
            card.classList.add("locked");
            progress.textContent = "🔒 Locked";

            card.appendChild(title);
            card.appendChild(progress);
        }

        daysGrid.appendChild(card);
    }
}

function chant() {
    const index = appData.currentDay - 1;

    if (appData.days[index] >= DAILY_TARGET) return;

    appData.days[index]++;

    saveData();
    render();

    const image = document.querySelector(".hanuman-image");

    if (image) {
        image.animate(
            [
                { transform: "scale(1)" },
                { transform: "scale(0.94)" },
                { transform: "scale(1.04)" },
                { transform: "scale(1)" }
            ],
            {
                duration: 280,
                easing: "ease-out"
            }
        );
    }
}

function resetToday() {
    const index = appData.currentDay - 1;

    if (!confirm(`Reset Day ${appData.currentDay} count to 0?`)) return;

    appData.days[index] = 0;

    saveData();
    render();
}

function startNextDay() {
    const currentDay = appData.currentDay;

    if (currentDay >= TOTAL_DAYS) return;

    if (appData.days[currentDay - 1] < DAILY_TARGET) return;

    appData.currentDay++;

    saveData();
    render();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

chantButton.addEventListener("click", chant);
chantImage.addEventListener("click", chant);
resetButton.addEventListener("click", resetToday);
nextDayButton.addEventListener("click", startNextDay);

laterButton.addEventListener("click", () => {
    completion.classList.add("hidden");
});

render();

const mantraAudio =
    document.getElementById("mantraAudio");

const soundButton =
    document.getElementById("soundButton");

soundButton.addEventListener("click", function () {

    if (mantraAudio.paused) {

        mantraAudio.play();

        soundButton.textContent = "🔊";

    } else {

        mantraAudio.pause();

        soundButton.textContent = "🔇";
    }

});