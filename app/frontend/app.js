const form = document.getElementById('expiry-form');
const csvFile = document.getElementById('csv-file');
const productionDate = document.getElementById('production-date');
const results = document.getElementById('results');

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('csv_file', csvFile.files[0]);
    formData.append('production_date', productionDate.value);

    try {
        const response = await fetch('http://localhost:5000/run_expiry_tracker', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Error running expiry tracker');
        }

        const data = await response.json();
        results.textContent = data.message;

        if (data.expiry_report_cleared) {
            results.textContent += ' Expiry report cleared.';
        }
    } catch (error) {
        console.error(error);
        results.textContent = 'Error running expiry tracker';
    }
});
