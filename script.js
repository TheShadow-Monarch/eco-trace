// Main Application Controller
class EcoFootprintVisualizer {
    constructor() {
        this.initializeElements();
        this.initializeState();
        this.setupEventListeners();
        this.calculateFootprint();
        this.generateAIInsights();
    }

    initializeElements() {
        // Theme and UI Elements
        this.themeToggle = document.getElementById('themeToggle');
        this.infoBtn = document.getElementById('infoBtn');
        this.shareBtn = document.getElementById('shareBtn');
        this.calculateBtn = document.getElementById('calculateBtn');
        this.quickTipsBtn = document.getElementById('quickTipsBtn');
        this.loadSampleBtn = document.getElementById('loadSampleBtn');
        this.exportBtn = document.getElementById('exportBtn');
        this.printBtn = document.getElementById('printBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.refreshBtn = document.getElementById('refreshBtn');
        this.copyLinkBtn = document.getElementById('copyLinkBtn');
        this.exportPDFBtn = document.getElementById('exportPDFBtn');
        this.exportJSONBtn = document.getElementById('exportJSONBtn');
        this.exportCSVBtn = document.getElementById('exportCSVBtn');
        this.commitPledgeBtn = document.getElementById('commitPledgeBtn');
        this.viewPlanBtn = document.getElementById('viewPlanBtn');
        this.sharePledgeBtn = document.getElementById('sharePledgeBtn');

        // Input Elements
        this.homeInput = document.getElementById('homeInput');
        this.homeUnit = document.getElementById('homeUnit');
        this.carDistance = document.getElementById('carDistance');
        this.publicTransportDistance = document.getElementById('publicTransportDistance');
        this.flightsCount = document.getElementById('flightsCount');
        this.dietOptions = document.querySelectorAll('input[name="diet"]');
        this.foodWasteSlider = document.getElementById('foodWasteSlider');
        this.monthlySpending = document.getElementById('monthlySpending');
        this.wasteOptions = document.querySelectorAll('.waste-option');
        this.recyclingRate = document.getElementById('recyclingRate');
        this.recyclingValue = document.getElementById('recyclingValue');
        this.householdSize = document.getElementById('householdSize');
        this.decreaseSizeBtn = document.getElementById('decreaseSize');
        this.increaseSizeBtn = document.getElementById('increaseSize');
        this.countrySelect = document.getElementById('country');
        this.customCountryField = document.getElementById('customCountryField');
        this.customCountry = document.getElementById('customCountry');

        // Display Elements
        this.homeValue = document.getElementById('homeValue');
        this.transportValue = document.getElementById('transportValue');
        this.foodValue = document.getElementById('foodValue');
        this.shoppingValue = document.getElementById('shoppingValue');
        this.footprintNumber = document.getElementById('footprintNumber');
        this.footprintStatus = document.getElementById('footprintStatus');
        this.comparisonText = document.getElementById('comparisonText');
        this.homeResult = document.getElementById('homeResult');
        this.transportResult = document.getElementById('transportResult');
        this.foodResult = document.getElementById('foodResult');
        this.shoppingResult = document.getElementById('shoppingResult');
        this.homeBar = document.getElementById('homeBar');
        this.transportBar = document.getElementById('transportBar');
        this.foodBar = document.getElementById('foodBar');
        this.shoppingBar = document.getElementById('shoppingBar');
        this.aiLoading = document.getElementById('aiLoading');
        this.aiSuggestion = document.getElementById('aiSuggestion');
        this.recommendationList = document.getElementById('recommendationList');
        this.pledgeSummary = document.getElementById('pledgeSummary');
        this.selectedPledges = document.getElementById('selectedPledges');

        // Modals
        this.infoModal = document.getElementById('infoModal');
        this.successModal = document.getElementById('successModal');
        this.closeInfoModal = document.getElementById('closeInfoModal');
        this.closeSuccessModal = document.getElementById('closeSuccessModal');

        // Global stats
        this.globalAverage = document.getElementById('globalAverage');
        this.usersTracked = document.getElementById('usersTracked');
        this.totalSavings = document.getElementById('totalSavings');

        // Pledge elements
        this.pledgeCards = document.querySelectorAll('.pledge-card');
        this.pledgeSelectBtns = document.querySelectorAll('.pledge-select');
        
        // Share buttons
        this.shareButtons = document.querySelectorAll('.share-btn');
    }

    initializeState() {
        // Initialize conversion factors
        this.conversionFactors = {
            home: {
                kwh: 0.5, // kg CO₂ per kWh
                dollars: 3.33 // kg CO₂ per $ (assuming $0.15 per kWh)
            },
            transport: {
                car: 0.171, // kg CO₂ per km (average car)
                bus: 0.105, // kg CO₂ per km (bus)
                train: 0.041, // kg CO₂ per km (train)
                flight: 90 // kg CO₂ per flight hour
            },
            diet: {
                vegan: 0.5,
                vegetarian: 1.0,
                mixed: 1.8,
                'meat-heavy': 2.5
            },
            shopping: {
                spending: 2, // kg CO₂ per $ spent
                waste: {
                    low: 0.1,
                    medium: 0.3,
                    high: 0.5
                },
                recycling: 0.5 // reduction factor for recycling
            }
        };

        // Initialize user data
        this.userData = {
            footprint: 0,
            categories: {
                home: 0,
                transport: 0,
                food: 0,
                shopping: 0
            },
            pledges: [],
            recommendations: []
        };

        // Set default values
        this.updateRecyclingDisplay();
        this.setActiveDiet('mixed');
        this.setActiveWaste('low');
        this.updateCountryField();
        this.initializeGlobalStats();
    }

    setupEventListeners() {
        // Theme toggle
        this.themeToggle.addEventListener('click', () => this.toggleTheme());

        // Button events
        this.infoBtn.addEventListener('click', () => this.showInfoModal());
        this.shareBtn.addEventListener('click', () => this.shareResults());
        this.calculateBtn.addEventListener('click', () => this.calculateFootprint());
        this.quickTipsBtn.addEventListener('click', () => this.showQuickTips());
        this.loadSampleBtn.addEventListener('click', () => this.loadSampleData());
        this.exportBtn.addEventListener('click', () => this.exportData());
        this.printBtn.addEventListener('click', () => window.print());
        this.resetBtn.addEventListener('click', () => this.resetData());
        this.refreshBtn.addEventListener('click', () => this.refreshRecommendations());
        this.copyLinkBtn.addEventListener('click', () => this.copyLink());
        this.exportPDFBtn.addEventListener('click', () => this.exportPDF());
        this.exportJSONBtn.addEventListener('click', () => this.exportJSON());
        this.exportCSVBtn.addEventListener('click', () => this.exportCSV());
        this.commitPledgeBtn.addEventListener('click', () => this.commitPledge());
        this.viewPlanBtn.addEventListener('click', () => this.viewActionPlan());
        this.sharePledgeBtn.addEventListener('click', () => this.sharePledge());

        // Modal close events
        this.closeInfoModal.addEventListener('click', () => this.hideInfoModal());
        this.closeSuccessModal.addEventListener('click', () => this.hideSuccessModal());

        // Input events
        this.homeInput.addEventListener('input', () => this.updateHomeValue());
        this.homeUnit.addEventListener('change', () => this.updateHomeValue());
        this.carDistance.addEventListener('input', () => this.updateTransportValue());
        this.publicTransportDistance.addEventListener('input', () => this.updateTransportValue());
        this.flightsCount.addEventListener('input', () => this.updateTransportValue());
        
        this.dietOptions.forEach(option => {
            option.addEventListener('change', () => this.updateDietValue());
        });
        
        this.foodWasteSlider.addEventListener('input', () => this.updateFoodWaste());
        this.monthlySpending.addEventListener('input', () => this.updateShoppingValue());
        
        this.wasteOptions.forEach(option => {
            option.addEventListener('click', () => {
                const value = option.getAttribute('data-value');
                this.setActiveWaste(value);
            });
        });
        
        this.recyclingRate.addEventListener('input', () => this.updateRecyclingDisplay());
        
        // Household size stepper
        this.decreaseSizeBtn.addEventListener('click', () => {
            this.householdSize.value = Math.max(1, parseInt(this.householdSize.value) - 1);
            this.updateHousehold();
        });
        
        this.increaseSizeBtn.addEventListener('click', () => {
            this.householdSize.value = Math.min(10, parseInt(this.householdSize.value) + 1);
            this.updateHousehold();
        });
        
        this.householdSize.addEventListener('input', () => this.updateHousehold());
        
        // Country selection
        this.countrySelect.addEventListener('change', () => this.updateCountryField());
        
        // Pledge selection
        this.pledgeSelectBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const card = e.target.closest('.pledge-card');
                const pledgeType = card.getAttribute('data-pledge');
                this.togglePledgeSelection(pledgeType, card);
            });
        });

        // Share buttons
        this.shareButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const platform = btn.getAttribute('data-platform');
                this.shareOnPlatform(platform);
            });
        });

        // Close modals on outside click
        window.addEventListener('click', (e) => {
            if (e.target === this.infoModal) this.hideInfoModal();
            if (e.target === this.successModal) this.hideSuccessModal();
        });

        // Initialize with sample data
        setTimeout(() => this.loadSampleData(), 500);
    }

    // Theme Management
    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('ecotrace-theme', newTheme);
    }

    // Input Value Updates
    updateHomeValue() {
        let value = parseFloat(this.homeInput.value) || 0;
        let unit = this.homeUnit.value;
        
        // Update display value
        const displayValue = unit === 'kwh' ? 
            Math.round(value) + ' kWh' : 
            '$' + this.homeInput.value;
        
        this.homeValue.textContent = displayValue;
    }

    updateTransportValue() {
        const carKm = parseFloat(this.carDistance.value) || 0;
        const publicKm = parseFloat(this.publicTransportDistance.value) || 0;
        
        // Calculate total distance for display
        const totalDistance = carKm + publicKm;
        const displayValue = Math.round(totalDistance) + ' km';
        this.transportValue.textContent = displayValue;
    }

    updateDietValue() {
        const selectedDiet = document.querySelector('input[name="diet"]:checked').value;
        this.setActiveDiet(selectedDiet);
        
        const dietName = selectedDiet.charAt(0).toUpperCase() + selectedDiet.slice(1);
        this.foodValue.textContent = dietName;
    }

    setActiveDiet(dietType) {
        this.dietOptions.forEach(option => {
            const card = option.nextElementSibling;
            if (option.value === dietType) {
                option.checked = true;
                card.classList.add('active');
            } else {
                card.classList.remove('active');
            }
        });
    }

    updateFoodWaste() {
        // Waste value is used in calculation, no display update needed
        return parseFloat(this.foodWasteSlider.value) / 100;
    }

    updateShoppingValue() {
        const spending = parseFloat(this.monthlySpending.value) || 0;
        const displayValue = '$' + spending;
        this.shoppingValue.textContent = displayValue;
    }

    setActiveWaste(value) {
        this.wasteOptions.forEach(option => {
            if (option.getAttribute('data-value') === value) {
                option.classList.add('active');
            } else {
                option.classList.remove('active');
            }
        });
    }

    updateRecyclingDisplay() {
        const value = this.recyclingRate.value;
        this.recyclingValue.textContent = value + '%';
    }

    updateHousehold() {
        return parseInt(this.householdSize.value) || 1;
    }

    updateCountryField() {
        if (this.countrySelect.value === 'custom') {
            this.customCountryField.style.display = 'block';
        } else {
            this.customCountryField.style.display = 'none';
        }
    }

    // Calculation Methods
    calculateFootprint() {
        // Get input values
        const homeFootprint = this.calculateHomeFootprint();
        const transportFootprint = this.calculateTransportFootprint();
        const foodFootprint = this.calculateFoodFootprint();
        const shoppingFootprint = this.calculateShoppingFootprint();
        
        // Adjust for household size
        const householdSize = this.updateHousehold();
        const totalFootprint = (homeFootprint + transportFootprint + foodFootprint + shoppingFootprint) / householdSize;
        
        // Update user data
        this.userData.footprint = totalFootprint;
        this.userData.categories = {
            home: homeFootprint,
            transport: transportFootprint,
            food: foodFootprint,
            shopping: shoppingFootprint
        };
        
        // Update display
        this.updateResults();
        this.generateAIInsights();
        
        // Show notification
        this.showNotification('Footprint calculated! AI insights updated.', 'success');
    }

    calculateHomeFootprint() {
        const value = parseFloat(this.homeInput.value) || 0;
        const unit = this.homeUnit.value;
        
        // Convert to kg CO₂ per month
        let monthlyEmissions;
        if (unit === 'kwh') {
            monthlyEmissions = value * this.conversionFactors.home.kwh;
        } else {
            monthlyEmissions = value * this.conversionFactors.home.dollars;
        }
        
        // Convert to tons per year
        return (monthlyEmissions * 12) / 1000;
    }

    calculateTransportFootprint() {
        const carKm = parseFloat(this.carDistance.value) || 0;
        const publicKm = parseFloat(this.publicTransportDistance.value) || 0;
        const flights = parseFloat(this.flightsCount.value) || 0;
        
        // Calculate weekly emissions
        const weeklyCarEmissions = carKm * this.conversionFactors.transport.car;
        const weeklyPublicEmissions = publicKm * this.conversionFactors.transport.bus;
        
        // Calculate flight emissions (assume 2 hours per flight)
        const flightEmissions = flights * this.conversionFactors.transport.flight * 2;
        
        // Convert to tons per year
        const totalEmissions = (weeklyCarEmissions * 52) + (weeklyPublicEmissions * 52) + flightEmissions;
        return totalEmissions / 1000;
    }

    calculateFoodFootprint() {
        const selectedDiet = document.querySelector('input[name="diet"]:checked').value;
        const dietFactor = this.conversionFactors.diet[selectedDiet];
        const wasteFactor = this.updateFoodWaste();
        
        // Apply waste factor (increases footprint)
        return dietFactor * (1 + wasteFactor);
    }

    calculateShoppingFootprint() {
        const spending = parseFloat(this.monthlySpending.value) || 0;
        const wasteLevel = this.getActiveWasteLevel();
        const recyclingRate = parseFloat(this.recyclingRate.value) / 100;
        
        // Calculate base emissions from spending
        const monthlyEmissions = spending * this.conversionFactors.shopping.spending;
        
        // Apply waste factor
        const wasteFactor = this.conversionFactors.shopping.waste[wasteLevel];
        let totalEmissions = monthlyEmissions * (1 + wasteFactor);
        
        // Apply recycling reduction
        totalEmissions *= (1 - (recyclingRate * this.conversionFactors.shopping.recycling));
        
        // Convert to tons per year
        return (totalEmissions * 12) / 1000;
    }

    getActiveWasteLevel() {
        for (const option of this.wasteOptions) {
            if (option.classList.contains('active')) {
                return option.getAttribute('data-value');
            }
        }
        return 'low';
    }

    // Results Display
    updateResults() {
        const total = this.userData.footprint;
        const categories = this.userData.categories;
        
        // Update main score
        this.footprintNumber.textContent = total.toFixed(1);
        
        // Update circle progress
        this.updateCircleProgress(total);
        
        // Update status
        this.updateStatus(total);
        
        // Update comparison text
        this.updateComparison(total);
        
        // Update category values
        this.homeResult.textContent = categories.home.toFixed(1);
        this.transportResult.textContent = categories.transport.toFixed(1);
        this.foodResult.textContent = categories.food.toFixed(1);
        this.shoppingResult.textContent = categories.shopping.toFixed(1);
        
        // Update bars (scaled to 15 tons max)
        const maxValue = 15;
        this.homeBar.style.width = `${(categories.home / maxValue) * 100}%`;
        this.transportBar.style.width = `${(categories.transport / maxValue) * 100}%`;
        this.foodBar.style.width = `${(categories.food / maxValue) * 100}%`;
        this.shoppingBar.style.width = `${(categories.shopping / maxValue) * 100}%`;
    }

    updateCircleProgress(total) {
        // Calculate percentage (max 20 tons for visualization)
        const percentage = Math.min((total / 20) * 100, 100);
        const circle = document.querySelector('.circle-fill');
        const circumference = 439.8;
        const offset = circumference - (percentage / 100) * circumference;
        circle.style.strokeDashoffset = offset;
    }

    updateStatus(total) {
        let status, dotColor;
        if (total < 10) {
            status = "Below Average";
            dotColor = "#10B981"; // Green
        } else if (total <= 15) {
            status = "Average";
            dotColor = "#F59E0B"; // Yellow
        } else {
            status = "Above Average";
            dotColor = "#EF4444"; // Red
        }
        
        this.footprintStatus.querySelector('.status-text').textContent = status;
        this.footprintStatus.querySelector('.status-dot').style.backgroundColor = dotColor;
    }

    updateComparison(total) {
        const globalAvg = 15.2;
        const difference = ((globalAvg - total) / globalAvg) * 100;
        
        if (difference > 0) {
            this.comparisonText.textContent = `${Math.abs(difference).toFixed(0)}% lower`;
            this.comparisonText.style.color = "#10B981";
        } else if (difference < 0) {
            this.comparisonText.textContent = `${Math.abs(difference).toFixed(0)}% higher`;
            this.comparisonText.style.color = "#EF4444";
        } else {
            this.comparisonText.textContent = "equal to";
            this.comparisonText.style.color = "#6B7280";
        }
    }

    // AI Integration
    generateAIInsights() {
        // Show loading state
        this.aiLoading.style.display = 'flex';
        this.aiSuggestion.style.display = 'none';
        
        // Simulate AI processing
        setTimeout(() => {
            const categories = this.userData.categories;
            const total = this.userData.footprint;
            
            // Find highest impact category
            let highestCategory = '';
            let highestValue = 0;
            for (const [category, value] of Object.entries(categories)) {
                if (value > highestValue) {
                    highestValue = value;
                    highestCategory = category;
                }
            }
            
            // Generate insight
            const insights = {
                home: "Consider reducing your home energy consumption. Switching to LED bulbs could save up to 0.5 tons CO₂/year.",
                transport: "Your transportation footprint is significant. Carpooling 2 days/week could reduce it by 20%.",
                food: "Food contributes heavily to your footprint. Meatless Mondays could save 0.3 tons CO₂/year.",
                shopping: "Shopping habits impact your footprint. Buying second-hand could reduce it by 15%."
            };
            
            const insight = insights[highestCategory] || "All your consumption categories are well-balanced.";
            this.aiSuggestion.innerHTML = `<strong>AI Insight:</strong> ${insight}`;
            
            // Hide loading, show suggestion
            this.aiLoading.style.display = 'none';
            this.aiSuggestion.style.display = 'block';
            
            // Generate recommendations
            this.generateRecommendations();
        }, 1500);
    }

    generateRecommendations() {
        const categories = this.userData.categories;
        const total = this.userData.footprint;
        
        // Clear existing recommendations
        this.recommendationList.innerHTML = '';
        
        // Generate recommendations based on user data
        const recommendations = [
            {
                text: "Switch to LED bulbs and unplug devices when not in use",
                category: "home",
                impact: "medium",
                aiGenerated: true
            },
            {
                text: "Try carpooling or using public transport 2 days per week",
                category: "transport",
                impact: "high",
                aiGenerated: true
            },
            {
                text: "Reduce food waste by planning meals and storing properly",
                category: "food",
                impact: "medium",
                aiGenerated: false
            },
            {
                text: "Buy second-hand items for non-essential purchases",
                category: "shopping",
                impact: "low",
                aiGenerated: false
            }
        ];
        
        // Filter and prioritize recommendations
        const filteredRecs = recommendations.filter(rec => {
            // Show high-impact recommendations for high-footprint categories
            if (categories[rec.category] > 3 && rec.impact === "high") return true;
            if (total > 12 && rec.impact !== "low") return true;
            return rec.impact === "medium" || rec.impact === "high";
        });
        
        // Display recommendations
        filteredRecs.forEach(rec => {
            const item = document.createElement('div');
            item.className = `recommendation-item ${rec.aiGenerated ? 'ai-enhanced' : ''}`;
            
            // Determine impact badge
            let impactClass = 'impact-low';
            if (rec.impact === 'medium') impactClass = 'impact-medium';
            if (rec.impact === 'high') impactClass = 'impact-high';
            
            item.innerHTML = `
                <i class="fas ${rec.aiGenerated ? 'fa-brain' : 'fa-lightbulb'}"></i>
                <p>${rec.text} <span class="impact-badge ${impactClass}">${rec.impact.charAt(0).toUpperCase() + rec.impact.slice(1)} Impact</span></p>
            `;
            
            this.recommendationList.appendChild(item);
        });
        
        // Store for export
        this.userData.recommendations = filteredRecs.map(rec => rec.text);
    }

    refreshRecommendations() {
        this.generateRecommendations();
        this.showNotification('Recommendations refreshed with latest AI analysis', 'info');
    }

    // Pledge Management
    togglePledgeSelection(pledgeType, card) {
        const index = this.userData.pledges.indexOf(pledgeType);
        const btn = card.querySelector('.pledge-select');
        
        if (index === -1) {
            // Add pledge
            this.userData.pledges.push(pledgeType);
            card.classList.add('selected');
            btn.textContent = 'Selected';
            btn.classList.add('btn-primary');
            btn.classList.remove('btn-outline');
        } else {
            // Remove pledge
            this.userData.pledges.splice(index, 1);
            card.classList.remove('selected');
            btn.textContent = 'Select Pledge';
            btn.classList.remove('btn-primary');
            btn.classList.add('btn-outline');
        }
        
        // Update pledge summary
        this.updatePledgeSummary();
    }

    updatePledgeSummary() {
        if (this.userData.pledges.length > 0) {
            this.pledgeSummary.style.display = 'block';
            this.selectedPledges.innerHTML = '';
            
            this.userData.pledges.forEach(pledge => {
                const pledgeItem = document.createElement('div');
                pledgeItem.className = 'selected-pledge';
                pledgeItem.textContent = this.getPledgeName(pledge);
                this.selectedPledges.appendChild(pledgeItem);
            });
        } else {
            this.pledgeSummary.style.display = 'none';
        }
    }

    getPledgeName(pledgeType) {
        const names = {
            energy: 'Energy Saver Pledge',
            transport: 'Green Commuter Pledge',
            food: 'Sustainable Foodie Pledge'
        };
        return names[pledgeType] || pledgeType;
    }

    commitPledge() {
        if (this.userData.pledges.length === 0) {
            this.showNotification('Please select at least one pledge', 'warning');
            return;
        }
        
        // Show success modal
        this.successModal.style.display = 'flex';
        this.showNotification('Pledges committed successfully! AI will track your progress.', 'success');
    }

    // Export and Share Functions
    exportData() {
        const data = {
            timestamp: new Date().toISOString(),
            footprint: this.userData.footprint,
            categories: this.userData.categories,
            pledges: this.userData.pledges,
            recommendations: this.userData.recommendations,
            inputs: {
                home: {
                    value: this.homeInput.value,
                    unit: this.homeUnit.value
                },
                transport: {
                    carDistance: this.carDistance.value,
                    publicTransportDistance: this.publicTransportDistance.value,
                    flights: this.flightsCount.value
                },
                food: {
                    diet: document.querySelector('input[name="diet"]:checked').value,
                    foodWaste: this.foodWasteSlider.value
                },
                shopping: {
                    monthlySpending: this.monthlySpending.value,
                    recyclingRate: this.recyclingRate.value
                },
                household: {
                    size: this.householdSize.value,
                    country: this.countrySelect.value
                }
            }
        };
        
        return data;
    }

    exportPDF() {
        this.showNotification('Generating PDF report...', 'info');
        // In a real implementation, this would generate a PDF
        setTimeout(() => {
            this.showNotification('PDF report downloaded!', 'success');
        }, 1500);
    }

    exportJSON() {
        const data = this.exportData();
        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `ecotrace-footprint-${new Date().toISOString().slice(0,10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showNotification('JSON data exported successfully!', 'success');
    }

    exportCSV() {
        const data = this.exportData();
        let csvContent = "Category,Value (tons CO₂/year)\n";
        csvContent += `Total Footprint,${data.footprint.toFixed(1)}\n`;
        csvContent += `Home Energy,${data.categories.home.toFixed(1)}\n`;
        csvContent += `Transportation,${data.categories.transport.toFixed(1)}\n`;
        csvContent += `Food,${data.categories.food.toFixed(1)}\n`;
        csvContent += `Shopping,${data.categories.shopping.toFixed(1)}\n`;
        
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `ecotrace-footprint-${new Date().toISOString().slice(0,10)}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showNotification('CSV data exported successfully!', 'success');
    }

    shareResults() {
        const total = this.userData.footprint.toFixed(1);
        const status = this.footprintStatus.querySelector('.status-text').textContent;
        const comparison = this.comparisonText.textContent;
        
        const shareText = `My ecological footprint is ${total} tons CO₂/year (${status}, ${comparison} than global average). Calculate yours at ${window.location.origin}`;
        
        if (navigator.share) {
            navigator.share({
                title: 'My EcoTrace Footprint Results',
                text: shareText,
                url: window.location.origin
            });
        } else {
            navigator.clipboard.writeText(shareText).then(() => {
                this.showNotification('Results copied to clipboard!', 'success');
            });
        }
    }

    shareOnPlatform(platform) {
        const total = this.userData.footprint.toFixed(1);
        const status = this.footprintStatus.querySelector('.status-text').textContent;
        const url = window.location.origin;
        const text = `I calculated my ecological footprint with EcoTrace AI: ${total} tons CO₂/year (${status}). Calculate yours!`;
        
        let shareUrl;
        switch(platform) {
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
                break;
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
                break;
            case 'linkedin':
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
                break;
            default:
                return;
        }
        
        window.open(shareUrl, '_blank', 'width=600,height=400');
    }

    copyLink() {
        navigator.clipboard.writeText(window.location.origin).then(() => {
            this.showNotification('Link copied to clipboard!', 'success');
        });
    }

    sharePledge() {
        const pledgeNames = this.userData.pledges.map(p => this.getPledgeName(p));
        const shareText = `I just committed to reducing my ecological footprint by: ${pledgeNames.join(', ')}. Join me! ${window.location.origin}`;
        
        if (navigator.share) {
            navigator.share({
                title: 'My Sustainability Pledge',
                text: shareText,
                url: window.location.origin
            });
        } else {
            navigator.clipboard.writeText(shareText).then(() => {
                this.showNotification('Pledge copied to clipboard!', 'success');
            });
        }
        
        this.hideSuccessModal();
    }

    // Utility Functions
    loadSampleData() {
        // Home Energy
        this.homeInput.value = 450;
        this.homeUnit.value = 'kwh';
        this.updateHomeValue();
        
        // Transportation
        this.carDistance.value = 150;
        this.publicTransportDistance.value = 50;
        this.flightsCount.value = 1;
        this.updateTransportValue();
        
        // Food
        this.setActiveDiet('mixed');
        this.foodWasteSlider.value = 15;
        
        // Shopping
        this.monthlySpending.value = 400;
        this.updateShoppingValue();
        this.setActiveWaste('medium');
        this.recyclingRate.value = 75;
        this.updateRecyclingDisplay();
        
        // Household
        this.householdSize.value = 3;
        this.countrySelect.value = 'custom';
        this.updateCountryField();
        
        // Calculate
        this.calculateFootprint();
        
        this.showNotification('Sample data loaded! Adjust values for your actual consumption.', 'info');
    }

    resetData() {
        // Reset all inputs to default
        this.homeInput.value = 0;
        this.homeUnit.value = 'kwh';
        this.carDistance.value = 0;
        this.publicTransportDistance.value = 0;
        this.flightsCount.value = 0;
        this.setActiveDiet('mixed');
        this.foodWasteSlider.value = 0;
        this.monthlySpending.value = 0;
        this.setActiveWaste('low');
        this.recyclingRate.value = 0;
        this.householdSize.value = 1;
        this.countrySelect.value = 'global';
        
        // Update displays
        this.updateHomeValue();
        this.updateTransportValue();
        this.updateRecyclingDisplay();
        this.updateCountryField();
        
        // Clear pledges
        this.userData.pledges = [];
        this.pledgeCards.forEach(card => {
            card.classList.remove('selected');
            const btn = card.querySelector('.pledge-select');
            btn.textContent = 'Select Pledge';
            btn.classList.remove('btn-primary');
            btn.classList.add('btn-outline');
        });
        this.updatePledgeSummary();
        
        // Calculate
        this.calculateFootprint();
        
        this.showNotification('All data has been reset to default values.', 'info');
    }

    initializeGlobalStats() {
        // Simulate live updates
        setInterval(() => {
            const users = parseInt(this.usersTracked.textContent.replace(',', ''));
            const newUsers = users + Math.floor(Math.random() * 10);
            this.usersTracked.textContent = newUsers.toLocaleString();
            
            const savings = parseFloat(this.totalSavings.textContent.replace('K', '')) * 1000;
            const newSavings = savings + Math.floor(Math.random() * 100);
            this.totalSavings.textContent = (newSavings / 1000).toFixed(1) + 'K';
        }, 5000);
    }

    showQuickTips() {
        const tips = [
            "💡 Tip: Unplug electronics when not in use to reduce phantom loads",
            "🚲 Tip: Try biking for short trips under 3km",
            "🥦 Tip: Plan meals to reduce food waste by up to 25%",
            "🛒 Tip: Bring reusable bags when shopping",
            "💧 Tip: Fix leaky faucets to save water and energy"
        ];
        
        const randomTip = tips[Math.floor(Math.random() * tips.length)];
        this.showNotification(randomTip, 'info');
    }

    viewActionPlan() {
        this.hideSuccessModal();
        // In a real implementation, this would show an action plan
        this.showNotification('Generating your personalized action plan...', 'info');
        setTimeout(() => {
            this.showNotification('Action plan generated! Check your email.', 'success');
        }, 2000);
    }

    showInfoModal() {
        this.infoModal.style.display = 'flex';
    }

    hideInfoModal() {
        this.infoModal.style.display = 'none';
    }

    hideSuccessModal() {
        this.successModal.style.display = 'none';
    }

    showNotification(message, type) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `
            <div class="notification-content ${type}">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        
        // Add to document
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Add notification styles
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .notification-content {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 16px 24px;
        border-radius: 8px;
        background: white;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        color: #111827;
        font-weight: 500;
    }
    
    .notification-content.success {
        background: #10B981;
        color: white;
    }
    
    .notification-content.info {
        background: #3B82F6;
        color: white;
    }
    
    .notification-content.warning {
        background: #F59E0B;
        color: white;
    }
    
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(notificationStyles);

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check for saved theme
    const savedTheme = localStorage.getItem('ecotrace-theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Initialize app
    window.ecoApp = new EcoFootprintVisualizer();
});