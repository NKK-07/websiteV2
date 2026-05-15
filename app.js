document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('start-demo');
    const placeholder = document.getElementById('demo-placeholder');
    const result = document.getElementById('demo-result');
    const steps = [
        document.getElementById('step-ocr'),
        document.getElementById('step-gst'),
        document.getElementById('step-ledger'),
        document.getElementById('step-risk')
    ];

    let isRunning = false;

    startBtn.addEventListener('click', async () => {
        if (isRunning) return;
        isRunning = true;

        // Reset
        placeholder.style.display = 'block';
        result.style.display = 'none';
        steps.forEach(s => {
            s.classList.remove('active', 'complete');
        });

        startBtn.style.opacity = '0.5';
        startBtn.querySelector('span:last-child').textContent = 'Processing...';

        // Pipeline Logic
        for (let i = 0; i < steps.length; i++) {
            const step = steps[i];
            
            // Activate current step
            step.classList.add('active');
            
            // Wait for simulated work
            await new Promise(r => setTimeout(r, 600 + Math.random() * 400));
            
            // Complete step
            step.classList.remove('active');
            step.classList.add('complete');
        }

        // Show Result
        setTimeout(() => {
            placeholder.style.display = 'none';
            result.style.display = 'block';
            result.style.animation = 'fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards';
            
            startBtn.style.opacity = '1';
            startBtn.querySelector('span:last-child').textContent = 'Simulate Another Upload';
            isRunning = false;
        }, 300);
    });

    // Waitlist Form Submission
    const waitlistForm = document.getElementById('waitlist-form');
    const waitlistEmail = document.getElementById('waitlist-email');
    const waitlistSuccess = document.getElementById('waitlist-success');

    waitlistForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = waitlistEmail.value;
        const btn = waitlistForm.querySelector('button');
        
        console.log('[WAITLIST] Attempting signup for:', email);
        btn.disabled = true;
        btn.textContent = 'Joining...';

        try {
            const resp = await fetch('/api/waitlist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            console.log('[WAITLIST] Server response status:', resp.status);
            const data = await resp.json();
            console.log('[WAITLIST] Server response data:', data);

            if (resp.ok) {
                waitlistForm.style.display = 'none';
                waitlistSuccess.style.display = 'block';
            } else {
                const errMsg = data.details ? `Error: ${data.details}` : (data.error || 'Unknown error');
                alert(`Submission failed: ${errMsg}`);
                btn.disabled = false;
                btn.textContent = 'Join Pilot';
            }
        } catch (err) {
            console.error('[WAITLIST] Network error:', err);
            alert('Network error. If you are testing locally, the production backend might not have the waitlist endpoint yet.');
            btn.disabled = false;
            btn.textContent = 'Join Pilot';
        }
    });

    // Simple fade-in animation for scroll
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Initial styles for scroll animation
    const animateElements = document.querySelectorAll('.problem-card, .insight-card-v2, .security-card, .roadmap-item, .traj-node');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        observer.observe(el);
    });
});

// Animation Keyframes defined in CSS but triggered by JS for Demo
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);
