document.getElementById('report-filter-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission
    
    const reportType = document.getElementById('report-type').value;
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;

    // Fetch report data from the server (replace with your API endpoint)
    fetch(`/api/reports?reportType=${reportType}&startDate=${startDate}&endDate=${endDate}`)
        .then(response => response.json())
        .then(data => {
            // Render the report in the report-content div
            const reportContent = document.getElementById('report-content');
            reportContent.innerHTML = generateReportHTML(data);
        })
        .catch(error => {
            console.error('Error fetching report:', error);
        });
});

function generateReportHTML(data) {
    if (!data || data.length === 0) {
        return '<p>No data available for the selected criteria.</p>';
    }

    let html = '<table>';
    html += '<thead><tr>';
    // Assuming data is an array of objects, use the keys as table headers
    for (const key in data[0]) {
        html += `<th>${key}</th>`;
    }
    html += '</tr></thead><tbody>';

    // Populate rows
    data.forEach(row => {
        html += '<tr>';
        for (const key in row) {
            html += `<td>${row[key]}</td>`;
        }
        html += '</tr>';
    });

    html += '</tbody></table>';
    return html;
}

// Handle the report download button
document.getElementById('download-report').addEventListener('click', function() {
    // Implement report download logic
    alert('Download functionality not implemented yet.');
});
