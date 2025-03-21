// Ensure Admin is Logged In
if (!localStorage.getItem('isAdmin')) {
    window.location.href = '/admin';
}

// Fetch User Submissions
async function fetchSubmissions() {
    try {
        console.log('Fetching submissions...');
        
        const response = await fetch('/api/admin/submissions', {
            credentials: 'include' // Ensure cookies (session) are sent
        });

        console.log('Response Status:', response.status);
        
        if (!response.ok) {
            throw new Error('Failed to fetch submissions');
        }

        const data = await response.json();
        console.log('Fetched Data:', data); // Debugging log
        renderSubmissions(data);
    } catch (error) {
        console.error('Error fetching submissions:', error);
    }
}


// Render Submissions in the Table
function renderSubmissions(data) {
    const tableBody = document.querySelector('#submissionsTable tbody');
    tableBody.innerHTML = ''; // Clear previous entries

    data.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.fullName}</td>
            <td>${item.phone}</td>
            <td>${item.email}</td>
            <td>${item.description}</td>
            <td><a href="/uploads/${item.birthCertificate}" target="_blank">View Birth Certificate</a></td>
            <td><a href="/uploads/${item.resultSlip}" target="_blank">View Result Slip</a></td>
            <td>${item.timestamp}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Logout Admin
function logout() {
    localStorage.removeItem('isAdmin');
    window.location.href = '/admin-login.html';
}

// Load Submissions on Page Load
window.onload = fetchSubmissions;
