document.addEventListener("DOMContentLoaded", () => {
  // Mobile sidebar toggle
  const sidebarToggle = document.querySelector(".navbar-toggler")
  const sidebar = document.querySelector(".sidebar")

  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener("click", () => {
      sidebar.classList.toggle("show")
    })
  }

  // Search functionality
  const searchInput = document.querySelector(".search-form input")
  if (searchInput) {
    searchInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        e.preventDefault()
        performSearch(this.value)
      }
    })
  }

  // Smooth animations for cards
  const cards = document.querySelectorAll(".card")
  cards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-5px)"
    })

    card.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0)"
    })
  })

  // Auto-hide alerts
  const alerts = document.querySelectorAll(".alert")
  alerts.forEach((alert) => {
    setTimeout(() => {
      alert.style.opacity = "0"
      setTimeout(() => {
        alert.remove()
      }, 300)
    }, 5000)
  })

  // Initialize tooltips
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
  const bootstrap = window.bootstrap // Declare the bootstrap variable
  tooltipTriggerList.map((tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl))

  // Profile dropdown animation
  const profileDropdown = document.querySelector(".profile-dropdown")
  if (profileDropdown) {
    profileDropdown.addEventListener("show.bs.dropdown", function () {
      this.style.animation = "slideIn 0.3s ease-out"
    })
  }
})

function performSearch(query) {
  if (query.trim() === "") return

  // Add your search logic here
  console.log("Searching for:", query)

  // Example: redirect to search results
  // window.location.href = `/admin/search?q=${encodeURIComponent(query)}`;
}

// Utility functions
function showNotification(message, type = "success") {
  const notification = document.createElement("div")
  notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`
  notification.style.cssText = "top: 90px; right: 20px; z-index: 9999; min-width: 300px;"
  notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `

  document.body.appendChild(notification)

  setTimeout(() => {
    notification.remove()
  }, 5000)
}

function confirmAction(message, callback) {
  if (confirm(message)) {
    callback()
  }
}

// Export functions for use in other scripts
window.adminUtils = {
  showNotification,
  confirmAction,
  performSearch,
}
