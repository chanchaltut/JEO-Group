// Web3Forms Integration and SweetAlert Notifications
// This file handles all contact form submissions across the JEO Group website

class ContactFormHandler {
    constructor() {
        this.initializeForms();
        this.showWelcomeMessage();
    }

    initializeForms() {
        // Find all contact forms on the page
        const contactForms = document.querySelectorAll('form[id*="contact"], form[action*="web3forms"]');
        
        contactForms.forEach(form => {
            this.setupForm(form);
        });
    }

    setupForm(form) {
        const submitBtn = form.querySelector('button[type="submit"], .submit-btn');
        
        if (!submitBtn) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleFormSubmission(form, submitBtn);
        });
    }

    async handleFormSubmission(form, submitBtn) {
        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        // Validation
        if (!this.validateForm(data)) {
            return;
        }

        // Show loading state
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        try {
            // Submit form to Web3Forms
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                this.showSuccessMessage();
                form.reset();
            } else {
                throw new Error('Form submission failed');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            this.showErrorMessage();
        } finally {
            // Reset button state
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    validateForm(data) {
        // Check required fields
        if (!data.name || !data.email || !data.message) {
            this.showValidationError('Please fill in all required fields.');
            return false;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            this.showValidationError('Please enter a valid email address.');
            return false;
        }

        // Phone validation (if provided)
        if (data.phone) {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            if (!phoneRegex.test(data.phone.replace(/\s/g, ''))) {
                this.showValidationError('Please enter a valid phone number.');
                return false;
            }
        }

        return true;
    }

    showValidationError(message) {
        Swal.fire({
            icon: 'error',
            title: 'Validation Error',
            text: message,
            confirmButtonColor: '#4f9cf9',
            confirmButtonText: 'OK'
        });
    }

    showSuccessMessage() {
        Swal.fire({
            icon: 'success',
            title: 'Message Sent Successfully!',
            text: 'Thank you for contacting us. We will get back to you within 24 hours.',
            confirmButtonColor: '#4f9cf9',
            confirmButtonText: 'Great!',
            timer: 5000,
            timerProgressBar: true
        });
    }

    showErrorMessage() {
        Swal.fire({
            icon: 'error',
            title: 'Submission Failed',
            text: 'Sorry, there was an error sending your message. Please try again or contact us directly.',
            confirmButtonColor: '#4f9cf9',
            confirmButtonText: 'Try Again'
        });
    }

    showWelcomeMessage() {
        // Check if this is the first visit to the current page
        const currentPage = window.location.pathname;
        const visitedKey = `visited_${currentPage.replace(/\//g, '_')}`;
        
        if (!localStorage.getItem(visitedKey)) {
            let title, text, buttonText;
            
            if (currentPage.includes('contact')) {
                title = 'Welcome to JEO Group!';
                text = 'We\'re here to help with all your electrical and infrastructure needs. Feel free to reach out!';
                buttonText = 'Get Started';
            } else if (currentPage.includes('about')) {
                title = 'About JEO Group';
                text = 'Discover our journey of engineering excellence and innovation since 1987.';
                buttonText = 'Learn More';
            } else if (currentPage.includes('services')) {
                title = 'Our Services';
                text = 'Explore our comprehensive range of electrical and infrastructure solutions.';
                buttonText = 'Explore Services';
            } else if (currentPage.includes('portfolio')) {
                title = 'Our Portfolio';
                text = 'Take a look at our successful projects and achievements across India.';
                buttonText = 'View Projects';
            } else {
                title = 'Welcome to JEO Group!';
                text = 'Engineering Excellence. Empowering India with innovative infrastructure and sustainable energy solutions since 1987.';
                buttonText = 'Explore Our Services';
            }

            Swal.fire({
                icon: 'info',
                title: title,
                text: text,
                confirmButtonColor: '#4f9cf9',
                confirmButtonText: buttonText,
                timer: 6000,
                timerProgressBar: true
            });
            
            localStorage.setItem(visitedKey, 'true');
        }
    }
}

// Utility functions for SweetAlert
class AlertUtils {
    static showInfo(title, text, timer = 4000) {
        return Swal.fire({
            icon: 'info',
            title: title,
            text: text,
            confirmButtonColor: '#4f9cf9',
            timer: timer,
            timerProgressBar: true
        });
    }

    static showSuccess(title, text, timer = 4000) {
        return Swal.fire({
            icon: 'success',
            title: title,
            text: text,
            confirmButtonColor: '#4f9cf9',
            timer: timer,
            timerProgressBar: true
        });
    }

    static showError(title, text) {
        return Swal.fire({
            icon: 'error',
            title: title,
            text: text,
            confirmButtonColor: '#4f9cf9'
        });
    }

    static showWarning(title, text) {
        return Swal.fire({
            icon: 'warning',
            title: title,
            text: text,
            confirmButtonColor: '#4f9cf9'
        });
    }

    static showConfirmation(title, text, confirmText = 'Yes', cancelText = 'No') {
        return Swal.fire({
            icon: 'question',
            title: title,
            text: text,
            showCancelButton: true,
            confirmButtonColor: '#4f9cf9',
            cancelButtonColor: '#6c757d',
            confirmButtonText: confirmText,
            cancelButtonText: cancelText
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize contact form handler
    new ContactFormHandler();
    
    // Add global alert utilities to window for easy access
    window.AlertUtils = AlertUtils;
});

// Export for module usage (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ContactFormHandler, AlertUtils };
} 