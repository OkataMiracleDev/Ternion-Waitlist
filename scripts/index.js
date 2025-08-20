 // A simple module for a clean code structure
        (function() {
            // Countdown Timer Logic
            // The date is a static value and won't change, so we'll use a placeholder image.
            const oneYearFromNow = new Date('August 20, 2026 00:00:00');

            const countdownTimer = setInterval(() => {
                const now = new Date().getTime();
                const distance = oneYearFromNow - now;

                const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);

                // Update the HTML elements with padded numbers
                document.getElementById('days').innerText = String(days).padStart(2, '0');
                document.getElementById('hours').innerText = String(hours).padStart(2, '0');
                document.getElementById('minutes').innerText = String(minutes).padStart(2, '0');
                document.getElementById('seconds').innerText = String(seconds).padStart(2, '0');

                if (distance < 0) {
                    clearInterval(countdownTimer);
                    document.getElementById('countdown').innerHTML = '<span class="text-xl text-green-400">Launch Day!</span>';
                }
            }, 1000);

            // Form Submission Logic
            const form = document.getElementById('waitlistForm');
            const statusMessage = document.getElementById('statusMessage');

            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const formData = new FormData(form);
                const data = Object.fromEntries(formData.entries());
                
                // Show a loading message
                statusMessage.textContent = 'Joining waitlist...';
                statusMessage.className = 'mt-4 text-sm font-bold text-yellow-400';

                try {
                    // This is the updated part: making a real fetch request to your serverless function
                    const response = await fetch('YOUR_SERVERLESS_FUNCTION_ENDPOINT', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(data),
                    });

                    // Check if the request was successful
                    if (response.ok) {
                        const result = await response.json();
                        statusMessage.textContent = result.message || 'Successfully added to waitlist!';
                        statusMessage.className = 'mt-4 text-sm font-bold text-green-400';
                        form.reset();
                    } else {
                        const errorResult = await response.json();
                        throw new Error(errorResult.message || 'An unknown error occurred.');
                    }
                } catch (error) {
                    console.error('Submission error:', error);
                    statusMessage.textContent = `Error: ${error.message}`;
                    statusMessage.className = 'mt-4 text-sm font-bold text-red-400';
                }
            });
        })();