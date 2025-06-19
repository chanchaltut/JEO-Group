// Web3Forms Integration and SweetAlert Notifications
// This file handles all contact form submissions across the JEO Group website

class ContactFormHandler {
    constructor() {
        this.initializeForms();
        this.initializeCTAButtons();
    }

    initializeForms() {
        // Find all contact forms on the page
        const contactForms = document.querySelectorAll('form[id*="contact"], form[action*="web3forms"]');
        
        contactForms.forEach(form => {
            this.setupForm(form);
        });
    }

    initializeCTAButtons() {
        // Handle CTA buttons with SweetAlert feedback
        const ctaButtons = document.querySelectorAll('.hero-btn, .cta-btn, .nav-cta');
        
        ctaButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const href = button.getAttribute('href');
                
                // If it's a contact link, show contact info
                if (href && href.includes('contact')) {
                    e.preventDefault();
                    this.showContactInfo();
                }
                // If it's a quote request, show quote info
                else if (button.textContent.toLowerCase().includes('quote')) {
                    e.preventDefault();
                    this.showQuoteInfo();
                }
                // If it's a project start, show project info
                else if (button.textContent.toLowerCase().includes('project')) {
                    e.preventDefault();
                    this.showProjectInfo();
                }
            });
        });
    }

    showContactInfo() {
        Swal.fire({
            icon: 'info',
            title: 'Get in Touch',
            html: `
                <p>We're here to help with all your electrical and infrastructure needs!</p>
                <div style="text-align: left; margin: 20px 0;">
                    <p><strong>📞 Phone:</strong> +91 1234567890</p>
                    <p><strong>📧 Email:</strong> info@jeogroup.com</p>
                    <p><strong>📍 Address:</strong> JEO Group Headquarters, India</p>
                </div>
                <p>You can also fill out our contact form for detailed inquiries.</p>
            `,
            confirmButtonColor: '#4f9cf9',
            confirmButtonText: 'Fill Contact Form',
            showCancelButton: true,
            cancelButtonText: 'Close'
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = 'pages/contact.html';
            }
        });
    }

    showQuoteInfo() {
        Swal.fire({
            icon: 'success',
            title: 'Request a Quote',
            html: `
                <p>Ready to get started with your project?</p>
                <div style="text-align: left; margin: 20px 0;">
                    <p><strong>What we need:</strong></p>
                    <ul style="text-align: left;">
                        <li>Project requirements</li>
                        <li>Timeline</li>
                        <li>Budget considerations</li>
                        <li>Technical specifications</li>
                    </ul>
                </div>
                <p>Our team will provide you with a detailed quote within 24 hours.</p>
            `,
            confirmButtonColor: '#4f9cf9',
            confirmButtonText: 'Contact Us',
            showCancelButton: true,
            cancelButtonText: 'Close'
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = 'pages/contact.html';
            }
        });
    }

    showProjectInfo() {
        Swal.fire({
            icon: 'info',
            title: 'Start Your Project',
            html: `
                <p>Let's bring your vision to life!</p>
                <div style="text-align: left; margin: 20px 0;">
                    <p><strong>Our process:</strong></p>
                    <ol style="text-align: left;">
                        <li>Initial consultation</li>
                        <li>Project planning</li>
                        <li>Detailed proposal</li>
                        <li>Execution & delivery</li>
                    </ol>
                </div>
                <p>We handle projects of all sizes with the same dedication to quality.</p>
            `,
            confirmButtonColor: '#4f9cf9',
            confirmButtonText: 'Get Started',
            showCancelButton: true,
            cancelButtonText: 'Close'
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = 'pages/contact.html';
            }
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
            title: title,
            text: text,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#4f9cf9',
            cancelButtonColor: '#6c757d',
            confirmButtonText: confirmText,
            cancelButtonText: cancelText
        });
    }
}

// Initialize form handler when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ContactFormHandler();
});

// Export for use in other scripts
window.ContactFormHandler = ContactFormHandler;
window.AlertUtils = AlertUtils; 