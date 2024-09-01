const apiKey = 'AIzaSyAfiVlitaBI463I8R9plpCaG51Kib0tWPw';

document.getElementById('checkForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    let urlToCheck = document.getElementById('urlInput').value.trim();
    const resultDiv = document.getElementById('result');
    const progressBar = document.querySelector('.progress-bar span');
    
    // Validate URL format and correct if necessary
    try {
        if (!urlToCheck.startsWith('http://') && !urlToCheck.startsWith('https://') && !urlToCheck.startsWith('www.')) {
            urlToCheck = 'http://' + urlToCheck;
        } else if (urlToCheck.startsWith('www.')) {
            urlToCheck = 'http://' + urlToCheck;
        }
        
        new URL(urlToCheck); // This will throw an error if the URL is invalid
        
    } catch (error) {
        resultDiv.innerHTML = '<p>Invalid URL format. Please enter a valid URL.</p>';
        progressBar.style.width = '0%'; // Reset progress bar
        return;
    }
    
    try {
        const response = await axios.post(`https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${apiKey}`, {
            client: {
                clientId: 'your-company-name',
                clientVersion: '1.0'
            },
            threatInfo: {
                threatTypes: ['MALWARE', 'SOCIAL_ENGINEERING'],
                platformTypes: ['ANY_PLATFORM'],
                threatEntryTypes: ['URL'],
                threatEntries: [{ url: urlToCheck }]
            }
        });
        
        if (response.data.matches && response.data.matches.length > 0) {
            resultDiv.innerHTML = '<p><strong>Threat Detected:</strong> This URL is on a threat list!</p>';
            progressBar.style.width = '100%'; // Set progress bar to full
        } else {
            resultDiv.innerHTML = '<p><strong>No Threats Detected:</strong> This URL is safe.</p>';
            progressBar.style.width = '100%'; // Set progress bar to half
        }
    } catch (error) {
        console.error('Error checking URL:', error);
        resultDiv.innerHTML = '<p>Error occurred while checking the URL. Please try again later.</p>';
        progressBar.style.width = '0%'; // Reset progress bar
    }
});

// Add event listener for the reset button
document.getElementById('resetButton').addEventListener('click', function() {
    document.getElementById('urlInput').value = '';
    document.getElementById('result').innerHTML = '';
    document.querySelector('.progress-bar span').style.width = '0%'; // Reset progress bar
});
