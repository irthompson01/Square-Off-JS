document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM Fully Loaded");
  const registerBtn = document.getElementById("registerBtn");
  const loginBtn = document.getElementById("loginBtn");
  const registerModal = document.getElementById("registerModal");
  const loginModal = document.getElementById("loginModal");
  const registerForm = document.getElementById("registerForm");
  const loginForm = document.getElementById("loginForm");

  // Open modals
  registerBtn.onclick = () => registerModal.classList.add("show");
  loginBtn.onclick = () => loginModal.classList.add("show");

  // Close modals
  document.querySelectorAll(".close").forEach((closeBtn) => {
    closeBtn.onclick = () => {
      registerModal.classList.remove("show");
      loginModal.classList.remove("show");
    };
  });

  // Close modal if clicking outside of it
  window.onclick = (event) => {
    if (event.target == registerModal) {
      registerModal.classList.remove("show");
    }
    if (event.target == loginModal) {
      loginModal.classList.remove("show");
    }
  };

  // Handle register form submission
  registerForm.onsubmit = async (e) => {
    e.preventDefault();
    const username = document.getElementById("regUsername").value;
    const email = document.getElementById("regEmail").value;
    const password = document.getElementById("regPassword").value;

    try {
      const response = await fetch("/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      if (response.ok) {
        let emailOrUsername = email;
        // If registration is successful, automatically log in
        const loginResponse = await fetch("/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ emailOrUsername, password }),
        });

        if (loginResponse.ok) {
          const { token } = await loginResponse.json();
          localStorage.setItem("token", token);
          alert("Registered and logged in successfully!");
          registerModal.classList.remove("show");
          // Redirect or update UI as needed
        } else {
          alert(
            "Registration successful, but login failed. Please try logging in manually.",
          );
        }
      } else {
        alert("Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  // Handle login form submission
  loginForm.onsubmit = async (e) => {
    e.preventDefault();
    const emailOrUsername = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    try {
      const response = await fetch("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailOrUsername, password }),
      });

      if (response.ok) {
        const { token } = await response.json();
        localStorage.setItem("token", token);
        alert("Logged in successfully!");
        loginModal.classList.remove("show");
        // Redirect or update UI as needed
      } else {
        alert("Login failed. Please check your credentials and try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  };
});

function authFetch(url, options = {}) {
  const token = localStorage.getItem("token");
  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });
}
