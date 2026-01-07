// AI Model for Ecological Footprint Analysis
class EcoFootprintAI {
    constructor() {
        this.initializeModels();
        this.trainingData = [];
        this.loadTrainingData();
    }

    initializeModels() {
        // This simulates different AI/ML models for footprint analysis
        this.models = {
            // Regression model for predicting footprint
            footprintPredictor: {
                coefficients: {
                    home: 0.25,
                    transport: 0.30,
                    food: 0.25,
                    shopping: 0.20
                },
                intercept: 2.5,
                predict: function(inputs) {
                    let prediction = this.intercept;
                    for (const [key, value] of Object.entries(inputs)) {
                        prediction += value * this.coefficients[key];
                    }
                    return Math.max(0, prediction);
                }
            },

            // Classification model for impact level
            impactClassifier: {
                thresholds: {
                    low: 8,
                    medium: 15,
                    high: 20
                },
                classify: function(footprint) {
                    if (footprint <= this.thresholds.low) return 'low';
                    if (footprint <= this.thresholds.medium) return 'medium';
                    return 'high';
                }
            },

            // Recommendation engine
            recommendationEngine: {
                patterns: {
                    home: {
                        high: ['LED lighting', 'Smart thermostat', 'Solar panels', 'Better insulation'],
                        medium: ['Unplug devices', 'Lower thermostat', 'Energy audit', 'Window sealing'],
                        low: ['Turn off lights', 'Use natural light', 'Air dry clothes']
                    },
                    transport: {
                        high: ['Electric vehicle', 'Public transport', 'Carpooling', 'Biking'],
                        medium: ['Trip planning', 'Regular maintenance', 'Eco-driving', 'Remote work'],
                        low: ['Walk short trips', 'Combine errands', 'Proper tire pressure']
                    },
                    food: {
                        high: ['Plant-based diet', 'Local produce', 'Seasonal eating', 'Reduce waste'],
                        medium: ['Meatless days', 'Composting', 'Batch cooking', 'Proper storage'],
                        low: ['Leftover recipes', 'Grow herbs', 'Reusable containers']
                    },
                    shopping: {
                        high: ['Second-hand', 'Repair not replace', 'Minimal packaging', 'Sustainable brands'],
                        medium: ['Quality over quantity', 'Reusable bags', 'Digital receipts', 'Eco-friendly products'],
                        low: ['Recycle properly', 'Donate unused items', 'Avoid impulse buys']
                    }
                },
                generate: function(category, impact, count = 3) {
                    const recommendations = this.patterns[category]?.[impact] || [];
                    return recommendations.slice(0, count);
                }
            },

            // Optimization model for reduction strategies
            optimizationModel: {
                reductionPotentials: {
                    home: {
                        led_lights: { reduction: 0.3, cost: 'low', time: 'immediate' },
                        smart_thermostat: { reduction: 0.5, cost: 'medium', time: '1 week' },
                        solar_panels: { reduction: 2.0, cost: 'high', time: '1 month' }
                    },
                    transport: {
                        carpooling: { reduction: 0.8, cost: 'low', time: 'immediate' },
                        public_transport: { reduction: 1.2, cost: 'medium', time: '1 week' },
                        electric_vehicle: { reduction: 2.5, cost: 'high', time: '3 months' }
                    },
                    food: {
                        plant_based: { reduction: 0.6, cost: 'low', time: 'immediate' },
                        local_produce: { reduction: 0.3, cost: 'medium', time: '1 week' },
                        zero_waste: { reduction: 0.9, cost: 'high', time: '1 month' }
                    }
                },
                optimize: function(budget, timeframe, currentFootprint) {
                    const strategies = [];
                    let totalReduction = 0;
                    let totalCost = 0;

                    // Simple optimization algorithm
                    for (const category in this.reductionPotentials) {
                        for (const strategy in this.reductionPotentials[category]) {
                            const strategyData = this.reductionPotentials[category][strategy];
                            if (strategyData.cost === 'low' && totalCost < budget) {
                                strategies.push({
                                    category,
                                    strategy,
                                    reduction: strategyData.reduction,
                                    cost: strategyData.cost,
                                    time: strategyData.time
                                });
                                totalReduction += strategyData.reduction;
                                totalCost++;
                            }
                        }
                    }

                    return {
                        strategies,
                        totalReduction,
                        newFootprint: Math.max(0, currentFootprint - totalReduction),
                        roi: (totalReduction / totalCost).toFixed(2)
                    };
                }
            },

            // Trend analysis model
            trendAnalyzer: {
                analyze: function(historicalData) {
                    if (historicalData.length < 2) return null;

                    const latest = historicalData[historicalData.length - 1];
                    const previous = historicalData[historicalData.length - 2];

                    const change = latest - previous;
                    const percentageChange = (change / previous) * 100;

                    let trend = 'stable';
                    if (percentageChange > 5) trend = 'increasing';
                    if (percentageChange < -5) trend = 'decreasing';

                    return {
                        change,
                        percentageChange: percentageChange.toFixed(1),
                        trend,
                        prediction: this.predictNext(latest, percentageChange)
                    };
                },
                predictNext: function(current, trend) {
                    const predictedChange = current * (trend / 100);
                    return Math.max(0, current + predictedChange);
                }
            },

            // Comparative analysis model
            comparator: {
                benchmarks: {
                    global_average: 15.2,
                    sustainable_target: 8.0,
                    us_average: 16.5,
                    eu_average: 13.8,
                    china_average: 14.1,
                    india_average: 7.4
                },
                compare: function(footprint, region = 'global_average') {
                    const benchmark = this.benchmarks[region];
                    const difference = footprint - benchmark;
                    const percentage = (difference / benchmark) * 100;

                    let comparison = 'average';
                    if (percentage < -20) comparison = 'much lower';
                    else if (percentage < -5) comparison = 'lower';
                    else if (percentage > 20) comparison = 'much higher';
                    else if (percentage > 5) comparison = 'higher';

                    return {
                        benchmark,
                        difference: difference.toFixed(1),
                        percentage: percentage.toFixed(1),
                        comparison,
                        rating: this.calculateRating(percentage)
                    };
                },
                calculateRating: function(percentage) {
                    // Convert to 5-star rating
                    if (percentage < -30) return 5;
                    if (percentage < -15) return 4;
                    if (percentage < 0) return 3;
                    if (percentage < 15) return 2;
                    return 1;
                }
            }
        };
    }

    loadTrainingData() {
        // Simulate loading training data
        this.trainingData = [
            { home: 2.5, transport: 3.0, food: 1.8, shopping: 1.5, total: 8.8 },
            { home: 3.2, transport: 4.1, food: 2.1, shopping: 1.8, total: 11.2 },
            { home: 4.5, transport: 5.2, food: 2.8, shopping: 2.2, total: 14.7 },
            { home: 5.8, transport: 6.3, food: 3.5, shopping: 2.8, total: 18.4 }
        ];
    }

    // Public API methods
    predictFootprint(inputs) {
        return this.models.footprintPredictor.predict(inputs);
    }

    classifyImpact(footprint) {
        return this.models.impactClassifier.classify(footprint);
    }

    generateRecommendations(categories, impactLevels) {
        const recommendations = [];
        
        for (const category in categories) {
            if (categories[category] > 2) { // If category footprint is significant
                const impact = impactLevels[category] || 'medium';
                const recs = this.models.recommendationEngine.generate(category, impact);
                recommendations.push({
                    category,
                    impact,
                    recommendations: recs
                });
            }
        }
        
        return recommendations;
    }

    optimizeReduction(currentFootprint, categories, constraints = {}) {
        const budget = constraints.budget || 'medium';
        const timeframe = constraints.timeframe || '3 months';
        
        return this.models.optimizationModel.optimize(
            budget === 'low' ? 2 : budget === 'medium' ? 4 : 6,
            timeframe,
            currentFootprint
        );
    }

    analyzeTrends(historicalData) {
        return this.models.trendAnalyzer.analyze(historicalData);
    }

    compareWithBenchmarks(footprint, region = 'global_average') {
        return this.models.comparator.compare(footprint, region);
    }

    // Advanced ML Simulation
    trainModel(newData) {
        // Simulate model training
        this.trainingData.push(newData);
        
        // Update model coefficients based on new data
        if (this.trainingData.length > 10) {
            this.retrainModels();
        }
        
        return {
            success: true,
            trainingSamples: this.trainingData.length,
            accuracy: this.calculateAccuracy()
        };
    }

    retrainModels() {
        // Simulate retraining with more data
        const avgHome = this.trainingData.reduce((sum, d) => sum + d.home, 0) / this.trainingData.length;
        const avgTransport = this.trainingData.reduce((sum, d) => sum + d.transport, 0) / this.trainingData.length;
        const avgFood = this.trainingData.reduce((sum, d) => sum + d.food, 0) / this.trainingData.length;
        const avgShopping = this.trainingData.reduce((sum, d) => sum + d.shopping, 0) / this.trainingData.length;
        const avgTotal = this.trainingData.reduce((sum, d) => sum + d.total, 0) / this.trainingData.length;

        // Update coefficients based on averages
        this.models.footprintPredictor.coefficients = {
            home: avgHome / avgTotal,
            transport: avgTransport / avgTotal,
            food: avgFood / avgTotal,
            shopping: avgShopping / avgTotal
        };
    }

    calculateAccuracy() {
        // Calculate model accuracy based on training data
        let totalError = 0;
        for (const data of this.trainingData) {
            const prediction = this.predictFootprint({
                home: data.home,
                transport: data.transport,
                food: data.food,
                shopping: data.shopping
            });
            totalError += Math.abs(prediction - data.total);
        }
        
        const avgError = totalError / this.trainingData.length;
        const accuracy = Math.max(0, 100 - (avgError / 20) * 100); // Normalize to percentage
        
        return accuracy.toFixed(1);
    }

    // Personalized insights generation
    generatePersonalizedInsights(userData) {
        const footprint = userData.footprint;
        const categories = userData.categories;
        
        const impactLevel = this.classifyImpact(footprint);
        const comparison = this.compareWithBenchmarks(footprint);
        
        // Find areas of improvement
        const improvementAreas = [];
        for (const [category, value] of Object.entries(categories)) {
            if (value > 3) { // High impact area
                improvementAreas.push(category);
            }
        }
        
        // Generate insights
        const insights = {
            overall: `Your footprint of ${footprint.toFixed(1)} tons CO₂/year is ${comparison.comparison} than the global average.`,
            impactLevel: `This places you in the ${impactLevel} impact category.`,
            topCategory: improvementAreas.length > 0 
                ? `Your ${improvementAreas[0]} consumption contributes most to your footprint.`
                : 'Your consumption is well-balanced across all categories.',
            quickWins: this.generateQuickWins(categories),
            reductionPotential: this.calculateReductionPotential(categories),
            timeline: this.estimateAchievementTimeline(footprint)
        };
        
        return insights;
    }

    generateQuickWins(categories) {
        const quickWins = [];
        
        if (categories.home > 2.5) {
            quickWins.push('Switch 5 lights to LED bulbs');
        }
        if (categories.transport > 3) {
            quickWins.push('Carpool once a week');
        }
        if (categories.food > 2) {
            quickWins.push('Have one meat-free day per week');
        }
        if (categories.shopping > 1.5) {
            quickWins.push('Bring reusable bags when shopping');
        }
        
        return quickWins;
    }

    calculateReductionPotential(categories) {
        let potential = 0;
        
        if (categories.home > 3) potential += 0.8;
        if (categories.transport > 4) potential += 1.2;
        if (categories.food > 2.5) potential += 0.6;
        if (categories.shopping > 2) potential += 0.4;
        
        return potential;
    }

    estimateAchievementTimeline(footprint) {
        if (footprint > 15) return '6-12 months with consistent effort';
        if (footprint > 10) return '3-6 months with moderate changes';
        return '1-3 months with minor adjustments';
    }

    // Export model data
    exportModel() {
        return {
            version: '1.0.0',
            trainingSamples: this.trainingData.length,
            coefficients: this.models.footprintPredictor.coefficients,
            accuracy: this.calculateAccuracy(),
            lastUpdated: new Date().toISOString()
        };
    }
}

// Initialize AI model for global use
window.EcoAI = new EcoFootprintAI();

// Helper functions for the main application
function generateAISuggestions(userData) {
    const ai = window.EcoAI;
    
    // Predict footprint based on inputs
    const predictedFootprint = ai.predictFootprint(userData.categories);
    
    // Classify impact
    const impactLevel = ai.classifyImpact(userData.footprint);
    
    // Generate recommendations
    const recommendations = ai.generateRecommendations(
        userData.categories,
        Object.fromEntries(
            Object.entries(userData.categories).map(([key, value]) => [
                key,
                value > 3 ? 'high' : value > 2 ? 'medium' : 'low'
            ])
        )
    );
    
    // Compare with benchmarks
    const comparison = ai.compareWithBenchmarks(userData.footprint);
    
    // Generate personalized insights
    const insights = ai.generatePersonalizedInsights(userData);
    
    return {
        predictedFootprint: predictedFootprint.toFixed(1),
        actualFootprint: userData.footprint.toFixed(1),
        predictionAccuracy: Math.abs(predictedFootprint - userData.footprint).toFixed(1),
        impactLevel,
        comparison,
        recommendations,
        insights,
        quickWins: ai.generateQuickWins(userData.categories),
        reductionPotential: ai.calculateReductionPotential(userData.categories)
    };
}

function simulateMLTraining() {
    const ai = window.EcoAI;
    
    // Simulate collecting more training data
    const simulatedData = {
        home: 3.8,
        transport: 4.2,
        food: 2.4,
        shopping: 1.9,
        total: 12.3
    };
    
    const trainingResult = ai.trainModel(simulatedData);
    
    return {
        message: 'AI model training simulated',
        result: trainingResult,
        modelInfo: ai.exportModel()
    };
}

// Make functions available globally
window.generateAISuggestions = generateAISuggestions;
window.simulateMLTraining = simulateMLTraining;