async function checkLogin() {
    const res = await fetch("/.netlify/functions/me", {
        credentials: "include"
    });

    const user = await res.json();
    if (!user) return;

    document.getElementById("loginBtn").style.display = "none";
    document.getElementById("userInfo").style.display = "block";
    document.getElementById("username").textContent = user.username;
}

checkLogin();
