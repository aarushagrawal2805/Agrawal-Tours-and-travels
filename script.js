// Global variables
let currentSlide = 0;
let currentTestimonial = 0;
let heroSlides, testimonialSlides;

// Initialize the website
document.addEventListener('DOMContentLoaded', function() {
    initializeComponents();
    setupEventListeners();
});

function initializeComponents() {
    // Initialize hero slider
    heroSlides = document.querySelectorAll('.slide');
    if (heroSlides.length > 0) {
        startHeroSlider();
    }
    
    // Initialize testimonial slider
    testimonialSlides = document.querySelectorAll('.testimonial-card');
    if (testimonialSlides.length > 0) {
        initializeTestimonials();
    }
    
    // Initialize search functionality
    initializeSearch();
    
    // Set minimum dates for date inputs
    setMinimumDates();
    
    // Initialize price range display
    updatePriceRange();
}

function setupEventListeners() {
    // Mobile menu toggle
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
    
    // Hero slider navigation
    const heroNext = document.querySelector('.hero-next');
    const heroPrev = document.querySelector('.hero-prev');
    
    if (heroNext) heroNext.addEventListener('click', nextSlide);
    if (heroPrev) heroPrev.addEventListener('click', prevSlide);
    
    // Search tabs
    const searchTabs = document.querySelectorAll('.search-tab');
    searchTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            switchSearchTab(this.dataset.tab);
        });
    });
    
    // Advanced filters toggle
    const filterToggle = document.getElementById('filter-toggle');
    const filtersPanel = document.getElementById('filters-panel');
    
    if (filterToggle && filtersPanel) {
        filterToggle.addEventListener('click', function() {
            filtersPanel.classList.toggle('active');
        });
    }
    
    // Price range sliders
    const minPrice = document.getElementById('min-price');
    const maxPrice = document.getElementById('max-price');
    
    if (minPrice && maxPrice) {
        minPrice.addEventListener('input', updatePriceRange);
        maxPrice.addEventListener('input', updatePriceRange);
    }
    
    // Search functionality
    const searchBtn = document.querySelector('.search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', performSearch);
    }
    
    // Destination input autocomplete
    const destinationInput = document.getElementById('destination-input');
    if (destinationInput) {
        destinationInput.addEventListener('input', handleDestinationInput);
        destinationInput.addEventListener('focus', showDestinationDropdown);
        destinationInput.addEventListener('blur', hideDestinationDropdown);
    }
    
    // Testimonial navigation
    const testimonialNext = document.querySelector('.testimonial-next');
    const testimonialPrev = document.querySelector('.testimonial-prev');
    const testimonialDots = document.querySelectorAll('.dot');
    
    if (testimonialNext) testimonialNext.addEventListener('click', nextTestimonial);
    if (testimonialPrev) testimonialPrev.addEventListener('click', prevTestimonial);
    
    testimonialDots.forEach((dot, index) => {
        dot.addEventListener('click', () => goToTestimonial(index));
    });
    
    // Newsletter form
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterSubmit);
    }
    
    // Chat widget
    const chatToggle = document.getElementById('chat-toggle');
    const chatWidget = document.getElementById('chat-widget');
    const chatClose = document.getElementById('chat-close');
    const chatSend = document.getElementById('chat-send');
    const chatInput = document.getElementById('chat-input');
    
    if (chatToggle && chatWidget) {
        chatToggle.addEventListener('click', toggleChat);
    }
    
    if (chatClose) {
        chatClose.addEventListener('click', closeChat);
    }
    
    if (chatSend && chatInput) {
        chatSend.addEventListener('click', sendChatMessage);
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendChatMessage();
            }
        });
    }
    
    // Quick chat options
    const quickOptions = document.querySelectorAll('.quick-option');
    quickOptions.forEach(option => {
        option.addEventListener('click', function() {
            handleQuickOption(this.textContent);
        });
    });
    
    // Back to top button
    const backToTop = document.getElementById('back-to-top');
    if (backToTop) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });
        
        backToTop.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Language and currency changes
    const languageSelect = document.getElementById('language-select');
    const currencySelect = document.getElementById('currency-select');
    
    if (languageSelect) {
        languageSelect.addEventListener('change', function() {
            handleLanguageChange(this.value);
        });
    }
    
    if (currencySelect) {
        currencySelect.addEventListener('change', function() {
            handleCurrencyChange(this.value);
        });
    }
    
    // Package card interactions
    const packageCards = document.querySelectorAll('.package-card');
    packageCards.forEach(card => {
        const viewDetailsBtn = card.querySelector('.btn-secondary');
        if (viewDetailsBtn) {
            viewDetailsBtn.addEventListener('click', function() {
                const packageTitle = card.querySelector('h3').textContent;
                showPackageDetails(packageTitle);
            });
        }
    });
    
    // Destination card interactions
    const destinationCards = document.querySelectorAll('.destination-card');
    destinationCards.forEach(card => {
        card.addEventListener('click', function() {
            const destination = card.querySelector('h3').textContent;
            searchDestination(destination);
        });
    });
    
    // Add intersection observer for animations
    setupScrollAnimations();
}

// Hero Slider Functions
function startHeroSlider() {
    if (heroSlides.length <= 1) return;
    
    setInterval(() => {
        nextSlide();
    }, 5000);
}

function nextSlide() {
    if (!heroSlides || heroSlides.length === 0) return;
    
    heroSlides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % heroSlides.length;
    heroSlides[currentSlide].classList.add('active');
}

function prevSlide() {
    if (!heroSlides || heroSlides.length === 0) return;
    
    heroSlides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide - 1 + heroSlides.length) % heroSlides.length;
    heroSlides[currentSlide].classList.add('active');
}

// Search Functions
function switchSearchTab(tab) {
    // Remove active class from all tabs
    document.querySelectorAll('.search-tab').forEach(t => t.classList.remove('active'));
    
    // Add active class to clicked tab
    document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
    
    // Update search form based on tab
    updateSearchForm(tab);
}

function updateSearchForm(tab) {
    // This would update the search form fields based on the selected tab
    // For now, we'll just console log the tab change
    console.log(`Search tab changed to: ${tab}`);
}

function initializeSearch() {
    // Initialize destination autocomplete data
    window.destinations = [
        'Bali, Indonesia', 'Paris, France', 'Tokyo, Japan', 'New York, USA',
        'Dubai, UAE', 'London, UK', 'Bangkok, Thailand', 'Rome, Italy',
        'Sydney, Australia', 'Maldives', 'Switzerland', 'Greece',
        'Egypt', 'Turkey', 'Spain', 'Germany', 'Netherlands'
    ];
}

function handleDestinationInput(e) {
    const query = e.target.value.toLowerCase();
    const dropdown = document.getElementById('destination-dropdown');
    
    if (query.length === 0) {
        dropdown.style.display = 'none';
        return;
    }
    
    const matches = window.destinations.filter(dest => 
        dest.toLowerCase().includes(query)
    );
    
    if (matches.length > 0) {
        dropdown.innerHTML = matches.map(dest => 
            `<div class="destination-option" onclick="selectDestination('${dest}')">${dest}</div>`
        ).join('');
        dropdown.style.display = 'block';
    } else {
        dropdown.style.display = 'none';
    }
}

function selectDestination(destination) {
    document.getElementById('destination-input').value = destination;
    document.getElementById('destination-dropdown').style.display = 'none';
}

function showDestinationDropdown() {
    const dropdown = document.getElementById('destination-dropdown');
    const input = document.getElementById('destination-input');
    
    if (input.value.length === 0) {
        dropdown.innerHTML = window.destinations.map(dest => 
            `<div class="destination-option" onclick="selectDestination('${dest}')">${dest}</div>`
        ).join('');
        dropdown.style.display = 'block';
    }
}

function hideDestinationDropdown() {
    setTimeout(() => {
        document.getElementById('destination-dropdown').style.display = 'none';
    }, 200);
}

function performSearch() {
    const destination = document.getElementById('destination-input').value;
    const checkin = document.getElementById('checkin-date').value;
    const checkout = document.getElementById('checkout-date').value;
    const guests = document.getElementById('guests-select').value;
    
    // Get active search tab
    const activeTab = document.querySelector('.search-tab.active').dataset.tab;
    
    // Get advanced filter values
    const minPrice = document.getElementById('min-price').value;
    const maxPrice = document.getElementById('max-price').value;
    const duration = document.getElementById('duration-select').value;
    const themes = Array.from(document.querySelectorAll('.theme-options input:checked'))
        .map(checkbox => checkbox.value);
    
    const searchParams = {
        type: activeTab,
        destination,
        checkin,
        checkout,
        guests,
        minPrice,
        maxPrice,
        duration,
        themes
    };
    
    console.log('Search performed with params:', searchParams);
    
    // Show search results (in a real application, this would redirect or update the page)
    showSearchResults(searchParams);
}

function showSearchResults(params) {
    // Simulate search results display
    alert(`Searching for ${params.type} in ${params.destination || 'any destination'}...`);
}

function searchDestination(destination) {
    document.getElementById('destination-input').value = destination;
    performSearch();
}

// Date Functions
function setMinimumDates() {
    const today = new Date().toISOString().split('T')[0];
    const checkinDate = document.getElementById('checkin-date');
    const checkoutDate = document.getElementById('checkout-date');
    
    if (checkinDate) {
        checkinDate.min = today;
        checkinDate.addEventListener('change', function() {
            if (checkoutDate) {
                checkoutDate.min = this.value;
            }
        });
    }
    
    if (checkoutDate) {
        checkoutDate.min = today;
    }
}

// Price Range Functions
function updatePriceRange() {
    const minPrice = document.getElementById('min-price');
    const maxPrice = document.getElementById('max-price');
    const priceDisplay = document.querySelector('.price-display');
    
    if (minPrice && maxPrice && priceDisplay) {
        let min = parseInt(minPrice.value);
        let max = parseInt(maxPrice.value);
        
        // Ensure min is not greater than max
        if (min > max) {
            minPrice.value = max;
            min = max;
        }
        
        priceDisplay.textContent = `$${min} - $${max}`;
    }
}

// Testimonial Functions
function initializeTestimonials() {
    if (testimonialSlides.length > 0) {
        showTestimonial(0);
        
        // Auto-rotate testimonials
        setInterval(() => {
            nextTestimonial();
        }, 6000);
    }
}

function showTestimonial(index) {
    testimonialSlides.forEach(slide => slide.classList.remove('active'));
    document.querySelectorAll('.dot').forEach(dot => dot.classList.remove('active'));
    
    if (testimonialSlides[index]) {
        testimonialSlides[index].classList.add('active');
        document.querySelectorAll('.dot')[index]?.classList.add('active');
    }
}

function nextTestimonial() {
    currentTestimonial = (currentTestimonial + 1) % testimonialSlides.length;
    showTestimonial(currentTestimonial);
}

function prevTestimonial() {
    currentTestimonial = (currentTestimonial - 1 + testimonialSlides.length) % testimonialSlides.length;
    showTestimonial(currentTestimonial);
}

function goToTestimonial(index) {
    currentTestimonial = index;
    showTestimonial(currentTestimonial);
}

// Newsletter Functions
function handleNewsletterSubmit(e) {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;
    
    if (email) {
        // Simulate newsletter subscription
        console.log('Newsletter subscription:', email);
        alert('Thank you for subscribing to our newsletter!');
        e.target.reset();
    }
}

// Chat Functions
function toggleChat() {
    const chatWidget = document.getElementById('chat-widget');
    const chatToggle = document.getElementById('chat-toggle');
    
    if (chatWidget.classList.contains('active')) {
        closeChat();
    } else {
        openChat();
    }
}

function openChat() {
    const chatWidget = document.getElementById('chat-widget');
    const chatToggle = document.getElementById('chat-toggle');
    
    chatWidget.classList.add('active');
    chatToggle.style.display = 'none';
}

function closeChat() {
    const chatWidget = document.getElementById('chat-widget');
    const chatToggle = document.getElementById('chat-toggle');
    
    chatWidget.classList.remove('active');
    chatToggle.style.display = 'flex';
}

function sendChatMessage() {
    const chatInput = document.getElementById('chat-input');
    const message = chatInput.value.trim();
    
    if (message) {
        addChatMessage(message, 'user');
        chatInput.value = '';
        
        // Simulate bot response
        setTimeout(() => {
            const response = getChatResponse(message);
            addChatMessage(response, 'bot');
        }, 1000);
    }
}

function addChatMessage(message, sender) {
    const chatContent = document.getElementById('chat-content');
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}`;
    messageDiv.innerHTML = `<p>${message}</p>`;
    
    // Remove quick options if they exist
    const quickOptions = chatContent.querySelector('.quick-options');
    if (quickOptions && sender === 'user') {
        quickOptions.remove();
    }
    
    chatContent.appendChild(messageDiv);
    chatContent.scrollTop = chatContent.scrollHeight;
}

function getChatResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('book') || lowerMessage.includes('reservation')) {
        return "I'd be happy to help you with booking! What type of package are you interested in?";
    } else if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
        return "Our packages start from $699. Would you like to see our current offers?";
    } else if (lowerMessage.includes('destination')) {
        return "We offer packages to over 50 destinations worldwide! Where would you like to travel?";
    } else if (lowerMessage.includes('cancel') || lowerMessage.includes('refund')) {
        return "Our cancellation policy varies by package. Free cancellation is available up to 48 hours before departure for most packages.";
    } else {
        return "Thank you for your message! A travel specialist will contact you shortly to assist with your inquiry.";
    }
}

function handleQuickOption(option) {
    addChatMessage(option, 'user');
    
    setTimeout(() => {
        let response;
        switch (option) {
            case 'Book a Package':
                response = "Great! I can help you find the perfect package. What destination interests you?";
                break;
            case 'Check Availability':
                response = "I can check availability for you. Please provide your preferred destination and travel dates.";
                break;
            case 'Customer Support':
                response = "I'm here to help! What do you need assistance with?";
                break;
            default:
                response = "How can I assist you today?";
        }
        addChatMessage(response, 'bot');
    }, 1000);
}

// Localization Functions
function handleLanguageChange(language) {
    console.log('Language changed to:', language);
    // In a real application, this would update all text content
    // For now, we'll just store the preference
    localStorage.setItem('preferredLanguage', language);
}

function handleCurrencyChange(currency) {
    console.log('Currency changed to:', currency);
    // In a real application, this would update all prices
    // For now, we'll just store the preference
    localStorage.setItem('preferredCurrency', currency);
    
    // Update currency symbol in prices (basic example)
    updateCurrencyDisplay(currency);
}

function updateCurrencyDisplay(currency) {
    const symbols = {
        'usd': '$',
        'eur': '€',
        'gbp': '£'
    };
    
    const symbol = symbols[currency] || '$';
    
    // Update all price displays
    document.querySelectorAll('.current-price, .old-price, .destination-price').forEach(priceElement => {
        const price = priceElement.textContent.replace(/[^\d,]/g, '');
        if (price) {
            priceElement.textContent = `${symbol}${price}`;
        }
    });
}

// Package Details Functions
function showPackageDetails(packageTitle) {
    // In a real application, this would open a modal or navigate to a details page
    console.log('Show details for package:', packageTitle);
    alert(`Package Details for: ${packageTitle}\n\nThis would open a detailed view with more information, photos, itinerary, and booking options.`);
}

// Animation Functions
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.package-card, .destination-card, .testimonial-card, .resource-card, .blog-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Utility Functions
function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function formatCurrency(amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency
    }).format(amount);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add debounced version of destination input handler
const debouncedDestinationInput = debounce(handleDestinationInput, 300);

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
});

// Loading state management
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
});

// Get elements
const form = document.getElementById("inquiryForm");
const modal = document.getElementById("successModal");
const closeBtn = document.querySelector(".close-btn");

// Prevent form from refreshing the page and show modal
form.addEventListener("submit", function (e) {
  e.preventDefault(); // Prevent actual submission
  modal.style.display = "block";

  // Optional: Reset form after submission
  form.reset();
});

// Close modal on click
closeBtn.addEventListener("click", function () {
  modal.style.display = "none";
});

// Close modal if clicked outside content
window.addEventListener("click", function (e) {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});
