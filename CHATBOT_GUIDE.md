# AI Employee Assistant - User Guide

## Overview
The AI Employee Assistant is an intelligent chatbot that analyzes your employee data and provides instant insights. It features both local data analysis and optional AI enhancement for more sophisticated responses.

## Key Features
- 🎯 **Instant Analysis**: Real-time employee data insights
- 📊 **Pre-written Prompts**: Quick access to common queries
- 🤖 **Smart Processing**: Local analysis with optional AI enhancement
- 🚫 **No Setup Required**: Works immediately with your existing data
- 📱 **Modal Interface**: Clean overlay that doesn't interfere with your workflow

## How to Use

### 1. Open the Chatbot
- Click the blue chatbot icon in the bottom-right corner of any page
- The chatbot opens as a modal overlay

### 2. Use Pre-written Prompts
Click any of these instant queries:
- **Top Employees**: "Give me top 10 employees of Sheet Molding department"
- **Skill Distribution**: "Show me skill level distribution across all departments"
- **Diversity Analysis**: "Analyze gender diversity statistics by department"
- **Department Comparison**: "Compare performance between Assembly Line and Quality Control departments"
- **Training Needs**: "What departments need skill development and training?"

### 3. Ask Custom Questions
Type your own questions about:
- Employee performance and rankings
- Skill level analysis
- Department comparisons
- Gender diversity statistics
- Experience distributions

## Optional AI Enhancement

### Setup (Optional)
For enhanced responses with natural language processing:

1. Get an API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Copy `.env.example` to `.env.local`
3. Add your key: `NEXT_PUBLIC_GEMINI_API_KEY=your_key_here`
4. Restart the application

### Benefits of AI Enhancement
- More natural conversation flow
- Advanced analysis and insights
- Better understanding of complex queries
- Enhanced response formatting

## Data Analysis Capabilities

The chatbot automatically analyzes:
- **Employee Performance**: Rankings, skill levels, experience
- **Department Metrics**: Size, skill distribution, diversity
- **Skill Analysis**: Level distributions, training needs
- **Diversity Insights**: Gender statistics by department
- **Comparative Analysis**: Department performance comparisons

## Technical Details

### Processing Methods
- **Local Analysis**: Fast, reliable data processing (always available)
- **AI Enhancement**: Advanced natural language responses (with API key)
- **Automatic Fallback**: Seamlessly switches to local processing if needed

### Privacy & Security
- No personal data leaves your system without AI enhancement
- API keys stored securely in environment variables
- All processing respects data privacy guidelines
- Modal interface prevents background interaction

## Troubleshooting

### Common Issues
- **Empty Results**: Ensure employee data is properly loaded
- **Slow Responses**: Check your internet connection for AI enhancement
- **Modal Not Opening**: Refresh the page and try again

### Without API Key
- Chatbot works perfectly with local data analysis
- All core features remain fully functional
- No setup or configuration required

The AI Employee Assistant is designed to work seamlessly whether you choose to use AI enhancement or rely on the robust local analysis capabilities.
