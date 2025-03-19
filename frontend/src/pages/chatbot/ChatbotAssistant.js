import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  Divider,
  CircularProgress,
  Chip,
  Card,
  CardContent,
  Button
} from '@mui/material';
import {
  Send as SendIcon,
  SmartToy as BotIcon,
  Person as PersonIcon,
  QuestionAnswer as QuestionIcon,
  Refresh as RefreshIcon,
  Inventory as InventoryIcon,
  Business as BusinessIcon,
  LocalShipping as OrderIcon,
  Timeline as ForecastIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { aiServices } from '../../services/aiServices';

const ChatbotAssistant = () => {
  const { logActivity } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Sample quick questions
  const quickQuestions = [
    { text: 'Show low stock items', icon: <InventoryIcon />, intent: 'inventory' },
    { text: 'Who are our top suppliers?', icon: <BusinessIcon />, intent: 'supplier' },
    { text: 'Check pending orders', icon: <OrderIcon />, intent: 'order' },
    { text: 'Forecast demand for next month', icon: <ForecastIcon />, intent: 'forecast' }
  ];

  useEffect(() => {
    // Log activity
    logActivity('view', { page: 'chatbot-assistant' });
    
    // Add welcome message
    setMessages([
      {
        text: 'Hello! I\'m your Supply Chain Assistant. How can I help you today?',
        sender: 'bot',
        timestamp: new Date().toISOString()
      }
    ]);
  }, [logActivity]);

  useEffect(() => {
    // Scroll to bottom whenever messages change
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSendMessage = async (text = input) => {
    if (!text.trim()) return;

    // Add user message to chat
    const userMessage = {
      text,
      sender: 'user',
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    
    try {
      // Log user query
      logActivity('chatbot_query', { query: text });
      
      // Get response from AI chatbot
      const response = await aiServices.chatbotQuery(text);
      
      // Add bot response to chat
      const botMessage = {
        text: response.response,
        sender: 'bot',
        intent: response.intent,
        timestamp: response.timestamp
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error getting chatbot response:', error);
      
      // Add error message
      const errorMessage = {
        text: 'Sorry, I encountered an error processing your request. Please try again.',
        sender: 'bot',
        error: true,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickQuestion = (question) => {
    handleSendMessage(question.text);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        text: 'Hello! I\'m your Supply Chain Assistant. How can I help you today?',
        sender: 'bot',
        timestamp: new Date().toISOString()
      }
    ]);
    logActivity('chatbot_clear');
  };

  // Get intent color
  const getIntentColor = (intent) => {
    switch (intent) {
      case 'inventory':
        return 'primary';
      case 'supplier':
        return 'secondary';
      case 'order':
        return 'success';
      case 'forecast':
        return 'info';
      default:
        return 'default';
    }
  };

  // Get intent icon
  const getIntentIcon = (intent) => {
    switch (intent) {
      case 'inventory':
        return <InventoryIcon />;
      case 'supplier':
        return <BusinessIcon />;
      case 'order':
        return <OrderIcon />;
      case 'forecast':
        return <ForecastIcon />;
      default:
        return <QuestionIcon />;
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom component="div" sx={{ display: 'flex', alignItems: 'center' }}>
        <BotIcon sx={{ mr: 1 }} /> AI Supply Chain Assistant
      </Typography>
      
      {/* Quick Questions */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Quick Questions</Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {quickQuestions.map((question, index) => (
            <Button
              key={index}
              variant="outlined"
              color={getIntentColor(question.intent)}
              startIcon={question.icon}
              onClick={() => handleQuickQuestion(question)}
              sx={{ mb: 1, mr: 1 }}
            >
              {question.text}
            </Button>
          ))}
          <Button
            variant="outlined"
            color="error"
            startIcon={<RefreshIcon />}
            onClick={clearChat}
            sx={{ mb: 1 }}
          >
            Clear Chat
          </Button>
        </Box>
      </Paper>
      
      {/* Chat Container */}
      <Paper 
        sx={{ 
          height: 'calc(100vh - 300px)', 
          display: 'flex', 
          flexDirection: 'column',
          mb: 3
        }}
      >
        {/* Messages List */}
        <List 
          sx={{ 
            flexGrow: 1, 
            overflow: 'auto', 
            p: 2,
            bgcolor: 'background.paper'
          }}
        >
          {messages.map((message, index) => (
            <React.Fragment key={index}>
              <ListItem 
                alignItems="flex-start"
                sx={{
                  justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                  mb: 2
                }}
              >
                <Card 
                  sx={{ 
                    maxWidth: '80%',
                    bgcolor: message.sender === 'user' ? 'primary.light' : 
                            message.error ? 'error.light' : 'grey.100'
                  }}
                >
                  <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                      <ListItemAvatar sx={{ minWidth: 40 }}>
                        <Avatar 
                          sx={{ 
                            width: 32, 
                            height: 32,
                            bgcolor: message.sender === 'user' ? 'primary.main' : 
                                    message.error ? 'error.main' : 'secondary.main'
                          }}
                        >
                          {message.sender === 'user' ? 
                            <PersonIcon fontSize="small" /> : 
                            message.error ? 
                              <RefreshIcon fontSize="small" /> :
                              <BotIcon fontSize="small" />
                          }
                        </Avatar>
                      </ListItemAvatar>
                      <Box>
                        <Typography 
                          variant="subtitle2"
                          color={message.sender === 'user' ? 'primary.contrastText' : 'text.primary'}
                        >
                          {message.sender === 'user' ? 'You' : 'Supply Chain Assistant'}
                        </Typography>
                        <Typography 
                          variant="caption" 
                          color={message.sender === 'user' ? 'primary.contrastText' : 'text.secondary'}
                        >
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </Typography>
                        {message.intent && (
                          <Chip 
                            icon={getIntentIcon(message.intent)}
                            label={message.intent.charAt(0).toUpperCase() + message.intent.slice(1)}
                            size="small"
                            color={getIntentColor(message.intent)}
                            sx={{ ml: 1, height: 20 }}
                          />
                        )}
                      </Box>
                    </Box>
                    <Typography 
                      variant="body1"
                      color={message.sender === 'user' ? 'primary.contrastText' : 'text.primary'}
                      sx={{ whiteSpace: 'pre-wrap' }}
                    >
                      {message.text}
                    </Typography>
                  </CardContent>
                </Card>
              </ListItem>
              {index < messages.length - 1 && (
                <Divider variant="middle" component="li" />
              )}
            </React.Fragment>
          ))}
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
              <CircularProgress size={24} />
            </Box>
          )}
          <div ref={messagesEndRef} />
        </List>
        
        {/* Input Area */}
        <Box sx={{ p: 2, bgcolor: 'background.paper', borderTop: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <TextField
              fullWidth
              placeholder="Ask me anything about your supply chain..."
              variant="outlined"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
              multiline
              maxRows={3}
              sx={{ mr: 1 }}
            />
            <IconButton 
              color="primary" 
              onClick={() => handleSendMessage()}
              disabled={!input.trim() || loading}
              sx={{ p: '10px' }}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default ChatbotAssistant;