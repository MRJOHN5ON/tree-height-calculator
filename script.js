document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const angleMethodBtn = document.getElementById('angleMethod');
    const hypotenuseMethodBtn = document.getElementById('hypotenuseMethod');
    const angleInput = document.getElementById('angleInput');
    const hypotenuseInput = document.getElementById('hypotenuseInput');
    const calculateBtn = document.getElementById('calculate');
    const resultArea = document.getElementById('result');
    const errorDiv = document.getElementById('error');
    const unitToggle = document.getElementById('unitToggle');
    const unitLabel = document.getElementById('unitLabel');
    const unitTexts = document.getElementsByClassName('unit-text');

    // Initialize variables
    let isMetric = true;
    const METERS_TO_FEET = 3.28084;

    // Unit toggle handler
    unitToggle.addEventListener('change', function() {
        isMetric = !unitToggle.checked;
        unitLabel.textContent = isMetric ? 'Metric (meters)' : 'Imperial (feet)';
        Array.from(unitTexts).forEach(span => {
            span.textContent = isMetric ? 'meters' : 'feet';
        });
        
        // Convert existing values
        const baseDistance = document.getElementById('baseDistance');
        const hypotenuse = document.getElementById('hypotenuse');
        
        if (baseDistance.value) {
            baseDistance.value = convertValue(baseDistance.value, !isMetric);
        }
        if (hypotenuse.value) {
            hypotenuse.value = convertValue(hypotenuse.value, !isMetric);
        }
        
        // Update result if it exists
        if (resultArea.textContent !== 'Tree height will appear here') {
            calculateHeight();
        }
    });

    // Convert between metric and imperial
    function convertValue(value, toMetric) {
        const num = parseFloat(value);
        return toMetric ? 
            (num / METERS_TO_FEET).toFixed(2) : 
            (num * METERS_TO_FEET).toFixed(2);
    }

    // Method selection handlers
    angleMethodBtn.addEventListener('click', function() {
        angleMethodBtn.classList.add('active');
        hypotenuseMethodBtn.classList.remove('active');
        angleInput.classList.remove('hidden');
        hypotenuseInput.classList.add('hidden');
        clearError();
    });

    hypotenuseMethodBtn.addEventListener('click', function() {
        hypotenuseMethodBtn.classList.add('active');
        angleMethodBtn.classList.remove('active');
        hypotenuseInput.classList.remove('hidden');
        angleInput.classList.add('hidden');
        clearError();
    });

    // Calculate button handler
    calculateBtn.addEventListener('click', calculateHeight);

    function calculateHeight() {
        clearError();
        const baseDistance = parseFloat(document.getElementById('baseDistance').value);
        
        if (!baseDistance || baseDistance <= 0) {
            showError('Please enter a valid base distance');
            return;
        }

        let height;
        const isAngleMethod = angleMethodBtn.classList.contains('active');

        if (isAngleMethod) {
            const angle = parseFloat(document.getElementById('angle').value);
            if (!angle || angle <= 0 || angle >= 90) {
                showError('Please enter a valid angle (between 0 and 90 degrees)');
                return;
            }
            height = baseDistance * Math.tan(angle * Math.PI / 180);
        } else {
            const hypotenuse = parseFloat(document.getElementById('hypotenuse').value);
            if (!hypotenuse || hypotenuse <= baseDistance) {
                showError('Line-of-sight distance must be greater than base distance');
                return;
            }
            height = Math.sqrt(Math.pow(hypotenuse, 2) - Math.pow(baseDistance, 2));
        }

        const unit = isMetric ? 'meters' : 'feet';
        resultArea.innerHTML = `<p>Tree Height: <strong>${height.toFixed(2)} ${unit}</strong></p>`;
    }

    function showError(message) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        resultArea.innerHTML = '<p>Tree height will appear here</p>';
    }

    function clearError() {
        errorDiv.textContent = '';
        errorDiv.style.display = 'none';
    }
});