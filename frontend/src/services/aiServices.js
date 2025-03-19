import axios from 'axios';
import { inventoryAPI, supplierAPI } from './api';

// Base URL for AI services
const AI_SERVICE_URL = 'http://localhost:8000/ai';

// Create axios instance for AI services
const aiApi = axios.create({
  baseURL: AI_SERVICE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token
aiApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * AI Services for Supply Chain Management
 */
export const aiServices = {
  /**
   * Demand Forecasting - Predicts future inventory needs based on historical data
   * @param {Object} params - Parameters for forecasting
   * @param {string} params.productId - Optional product ID to forecast for specific product
   * @param {number} params.forecastPeriod - Number of days/weeks/months to forecast
   * @param {string} params.periodType - Type of period (day, week, month)
   * @returns {Promise<Object>} Forecast data
   */
  getDemandForecast: async (params) => {
    try {
      // In a real implementation, this would call the backend AI service
      // For now, we'll simulate with a mock implementation
      
      // Get historical inventory data
      const inventoryData = await inventoryAPI.getAll();
      
      // Mock forecast calculation
      const forecast = inventoryData.map(item => ({
        productId: item.id,
        productName: item.product_name,
        currentStock: item.quantity,
        forecastedDemand: Math.round(item.quantity * (0.8 + Math.random() * 0.4)), // Random forecast between 80-120% of current
        recommendedOrder: Math.max(0, Math.round(item.quantity * 0.2 * (1 + Math.random()))),
        confidence: Math.round(70 + Math.random() * 25), // Random confidence between 70-95%
      }));
      
      return {
        timestamp: new Date().toISOString(),
        forecastPeriod: params.forecastPeriod || 30,
        periodType: params.periodType || 'day',
        forecasts: params.productId 
          ? forecast.filter(f => f.productId === params.productId)
          : forecast
      };
    } catch (error) {
      console.error('Error in demand forecasting:', error);
      throw error;
    }
  },
  
  /**
   * Supplier Recommendation - Suggests optimal suppliers based on various metrics
   * @param {Object} params - Parameters for recommendation
   * @param {string} params.productCategory - Product category to find suppliers for
   * @param {Array} params.criteria - Criteria for ranking suppliers (price, quality, delivery)
   * @returns {Promise<Array>} Ranked list of recommended suppliers
   */
  getSupplierRecommendations: async (params) => {
    try {
      // Get all suppliers
      const suppliers = await supplierAPI.getAll();
      
      // Calculate recommendation scores (mock implementation)
      const recommendations = suppliers.map(supplier => {
        // Generate mock scores for different criteria
        const priceScore = Math.round(60 + Math.random() * 40); // 60-100
        const qualityScore = Math.round(supplier.rating * 20); // Based on rating
        const deliveryScore = Math.round(50 + Math.random() * 50); // 50-100
        const reliabilityScore = Math.round(supplier.performance_score); // Use performance score
        
        // Calculate weighted score based on criteria
        const criteria = params.criteria || { price: 0.3, quality: 0.3, delivery: 0.2, reliability: 0.2 };
        const weightedScore = (
          (priceScore * (criteria.price || 0.25)) +
          (qualityScore * (criteria.quality || 0.25)) +
          (deliveryScore * (criteria.delivery || 0.25)) +
          (reliabilityScore * (criteria.reliability || 0.25))
        );
        
        return {
          supplierId: supplier.id,
          supplierName: supplier.name,
          contactPerson: supplier.contact_name,
          email: supplier.email,
          phone: supplier.phone,
          scores: {
            price: priceScore,
            quality: qualityScore,
            delivery: deliveryScore,
            reliability: reliabilityScore,
            overall: Math.round(weightedScore)
          },
          recommendation: weightedScore > 80 ? 'Highly Recommended' : 
                         weightedScore > 60 ? 'Recommended' : 'Consider Alternatives'
        };
      });
      
      // Sort by overall score
      return recommendations.sort((a, b) => b.scores.overall - a.scores.overall);
    } catch (error) {
      console.error('Error in supplier recommendations:', error);
      throw error;
    }
  },
  
  /**
   * Anomaly Detection - Identifies unusual patterns in inventory or orders
   * @returns {Promise<Array>} List of detected anomalies
   */
  detectAnomalies: async () => {
    try {
      // Get inventory and orders data
      const inventory = await inventoryAPI.getAll();
      
      // Mock anomaly detection
      const anomalies = [];
      
      // Check for low stock anomalies
      inventory.forEach(item => {
        if (item.quantity < 10) {
          anomalies.push({
            type: 'low_stock',
            severity: item.quantity < 5 ? 'high' : 'medium',
            item: {
              id: item.id,
              name: item.product_name,
              currentStock: item.quantity
            },
            message: `Low stock alert: ${item.product_name} has only ${item.quantity} units remaining.`,
            timestamp: new Date().toISOString()
          });
        }
        
        // Check for potential pricing anomalies
        if (item.unit_price > 1000) {
          anomalies.push({
            type: 'price_anomaly',
            severity: 'medium',
            item: {
              id: item.id,
              name: item.product_name,
              price: item.unit_price
            },
            message: `Price anomaly detected: ${item.product_name} has an unusually high price of $${item.unit_price}.`,
            timestamp: new Date().toISOString()
          });
        }
      });
      
      return anomalies;
    } catch (error) {
      console.error('Error in anomaly detection:', error);
      throw error;
    }
  },
  
  /**
   * Automated Report Generation - Generates insights from supply chain data
   * @param {Object} params - Report parameters
   * @param {string} params.reportType - Type of report (inventory, supplier, order)
   * @param {string} params.period - Time period for the report
   * @returns {Promise<Object>} Generated report with insights
   */
  generateReport: async (params) => {
    try {
      // Get relevant data based on report type
      let data;
      switch (params.reportType) {
        case 'inventory':
          data = await inventoryAPI.getAll();
          break;
        case 'supplier':
          data = await supplierAPI.getAll();
          break;
        default:
          throw new Error('Invalid report type');
      }
      
      // Generate mock insights
      const insights = [
        'Inventory levels for Category A products have decreased by 15% over the last month.',
        'Supplier performance has improved by 7% on average.',
        'Order fulfillment rate is at 94%, which is 3% higher than the previous period.',
        'Three products are predicted to go out of stock within the next 7 days.',
        'Average delivery time has decreased from 5.2 days to 4.8 days.'
      ];
      
      // Select random insights
      const selectedInsights = [];
      for (let i = 0; i < 3; i++) {
        const randomIndex = Math.floor(Math.random() * insights.length);
        selectedInsights.push(insights[randomIndex]);
        insights.splice(randomIndex, 1);
      }
      
      return {
        reportType: params.reportType,
        period: params.period || 'last 30 days',
        generatedAt: new Date().toISOString(),
        summary: `This AI-generated report provides an analysis of ${params.reportType} data over the ${params.period || 'last 30 days'}.`,
        insights: selectedInsights,
        data: data.slice(0, 5) // Include sample of data
      };
    } catch (error) {
      console.error('Error generating report:', error);
      throw error;
    }
  },
  
  /**
   * Chatbot Assistant - Processes natural language queries about supply chain
   * @param {string} query - User's natural language query
   * @returns {Promise<Object>} Response to the query
   */
  chatbotQuery: async (query) => {
    try {
      // In a real implementation, this would call an NLP service
      // For now, we'll use a simple keyword matching approach
      
      const keywords = {
        inventory: ['inventory', 'stock', 'product', 'item', 'quantity'],
        supplier: ['supplier', 'vendor', 'manufacturer', 'partner'],
        order: ['order', 'purchase', 'delivery', 'shipment'],
        forecast: ['forecast', 'predict', 'future', 'demand', 'trend']
      };
      
      // Determine intent from keywords
      let intent = 'general';
      for (const [key, words] of Object.entries(keywords)) {
        if (words.some(word => query.toLowerCase().includes(word))) {
          intent = key;
          break;
        }
      }
      
      // Generate response based on intent
      let response;
      switch (intent) {
        case 'inventory':
          response = 'Based on our current inventory data, we have 245 products in stock across 12 categories. Would you like to see low stock items or inventory statistics?';
          break;
        case 'supplier':
          response = 'We currently work with 28 active suppliers. Our top-rated supplier is Acme Corporation with a performance score of 92%. Would you like to see supplier recommendations?';
          break;
        case 'order':
          response = 'There are 15 pending orders and 8 orders in transit. The average order fulfillment time is 4.8 days. Would you like to check a specific order status?';
          break;
        case 'forecast':
          response = 'Based on our AI forecasting model, we predict a 12% increase in demand for electronics over the next month. Would you like to see the detailed forecast report?';
          break;
        default:
          response = 'I can help you with information about inventory, suppliers, orders, and demand forecasting. What would you like to know about?';
      }
      
      return {
        query,
        intent,
        response,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error in chatbot query:', error);
      throw error;
    }
  }
};

export default aiServices;