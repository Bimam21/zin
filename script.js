document.addEventListener("DOMContentLoaded", () => {
    const reservationForm = document.getElementById("reservationForm");
    const feedbackForm = document.getElementById("feedbackForm");
    const surveyForm = document.getElementById("surveyForm");
    const loginForm = document.getElementById("loginForm");

    let feedbackCount = 0;
    let surveyCount = 0;

    reservationForm.addEventListener("submit", async(e) => {
        e.preventDefault();

        const nom = document.getElementById("nom").value;
        const prenom = document.getElementById("prenom").value;
        const telephone = document.getElementById("telephone").value;
        const date = document.getElementById("date").value;
        const time = document.getElementById("time").value;
        const doctor = document.getElementById("doctor").value;

        try {
            const response = await fetch("http://localhost:3000/reserve", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nom, prenom, telephone, date, time, doctor })
            });

            const data = await response.json();
            alert(data.message);
            reservationForm.reset();
        } catch (error) {
            alert("❌ Erreur lors de la réservation. Veuillez réessayer.");
        }
    });

    feedbackForm.addEventListener("submit", (e) => {
        e.preventDefault();
        alert("Merci pour votre avis !");
        feedbackCount++;
        document.getElementById("totalFeedback").innerText = `Nombre d'avis : ${feedbackCount}`;
        feedbackForm.reset();
    });

    surveyForm.addEventListener("submit", (e) => {
        e.preventDefault();
        alert("Merci pour votre participation au sondage !");
        surveyCount++;
        document.getElementById("totalSurvey").innerText = `Nombre de participations : ${surveyCount}`;
        surveyForm.reset();
    });

    // Fonction pour gérer les requêtes fetch
    async function makeFetchRequest(url, method, body) {
        try {
            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });
            return response.json();
        } catch (error) {
            console.error("Erreur serveur:", error);
            throw new Error("❌ Erreur serveur. Vérifiez que le backend fonctionne.");
        }
    }

    // Gestion de la connexion
    loginForm.addEventListener("submit", async(e) => {
        e.preventDefault();
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        try {
            const data = await makeFetchRequest("http://localhost:3000/login", "POST", { email, password });
            if (data.token) {
                localStorage.setItem("token", data.token);
                alert("Connexion réussie");
                // Rediriger vers la page de réservation après une connexion réussie
                window.location.href = "connexion.html";
            } else {
                alert(data.message);
            }
        } catch (error) {
            alert(error.message);
        }
    });
});