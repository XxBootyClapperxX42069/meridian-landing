(() => {
    const navToggle = document.querySelector('[data-nav-toggle]');
    const navMenu = document.querySelector('[data-nav-menu]');
    const form = document.querySelector('[data-contact-form]');
    const toast = document.querySelector('[data-toast]');

    const setMenuState = (isOpen) => {
        if (!navToggle || !navMenu) return;
        navMenu.classList.toggle('is-open', isOpen);
        navToggle.setAttribute('aria-expanded', String(isOpen));
        navToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
        navToggle.querySelector('i').className = isOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
        document.body.classList.toggle('menu-open', isOpen);
    };

    navToggle?.addEventListener('click', () => {
        setMenuState(!navMenu.classList.contains('is-open'));
    });

    navMenu?.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => setMenuState(false));
    });

    const showToast = (message) => {
        if (!toast) return;
        toast.textContent = message;
        toast.classList.add('is-visible');
        window.clearTimeout(showToast.timer);
        showToast.timer = window.setTimeout(() => toast.classList.remove('is-visible'), 5200);
    };

    if (!form) return;

    const fields = [...form.querySelectorAll('[data-required]')];
    const submitButton = form.querySelector('button[type="submit"]');
    const originalSubmitHTML = submitButton.innerHTML;

    const validators = {
        name: (value) => value.trim().length >= 2 ? '' : 'Enter your name.',
        company: (value) => value.trim().length >= 2 ? '' : 'Enter your company name.',
        email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) ? '' : 'Enter a valid email address.',
        category: (value) => value.trim().length >= 2 ? '' : 'Enter the product category.',
        quantity: (value) => value.trim().length >= 1 ? '' : 'Enter a target quantity.',
        destination: (value) => value.trim().length >= 2 ? '' : 'Enter the destination country.',
        message: (value) => value.trim().length >= 10 ? '' : 'Enter sourcing details with at least 10 characters.'
    };

    const setError = (input, message) => {
        const error = document.getElementById(`${input.id}-error`);
        input.setAttribute('aria-invalid', String(Boolean(message)));
        if (error) error.textContent = message;
    };

    const validateField = (input) => {
        const validator = validators[input.name];
        const message = validator ? validator(input.value) : '';
        setError(input, message);
        return !message;
    };

    fields.forEach((input) => {
        input.addEventListener('input', () => validateField(input));
        input.addEventListener('blur', () => validateField(input));
    });

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const isValid = fields.map(validateField).every(Boolean);
        if (!isValid) {
            const firstInvalid = form.querySelector('[aria-invalid="true"]');
            firstInvalid?.focus();
            return;
        }

        const name = form.querySelector('#name').value.trim();
        const formData = new FormData(form);

        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin" aria-hidden="true"></i> Sending...';

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                headers: { Accept: 'application/json' },
                body: formData
            });

            if (!response.ok) throw new Error('Form endpoint rejected the submission.');
            showToast(`Thank you ${name}. Liam will contact you with next steps.`);
            form.reset();
            fields.forEach((input) => setError(input, ''));
        } catch (error) {
            showToast('Unable to send right now. Please email Liam directly at ldunzl@meridiangrouptrade.com.');
        } finally {
            submitButton.disabled = false;
            submitButton.innerHTML = originalSubmitHTML;
        }
    });
})();
