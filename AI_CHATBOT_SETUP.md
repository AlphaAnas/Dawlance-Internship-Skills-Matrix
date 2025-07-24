# AI Chatbot Setup Guide

## Google Gemini API Integration

The AI Chatbot is integrated with Google Gemini for enhanced AI responses. Follow these steps to set up the API:

### 1. Get Google Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key

### 2. Configure the API Key

You can configure the API key in two ways:

#### Option A: Through the UI (Recommended)
1. Open the AI Chatbot by clicking the blue bot icon in the bottom right
2. Click the sparkles (✨) icon in the header
3. Enter your API key and click "Save"
4. The key will be saved in browser localStorage

#### Option B: Environment Variable
1. Copy `.env.example` to `.env.local`
2. Replace `your_gemini_api_key_here` with your actual API key
3. Restart the development server

### 3. Features

The enhanced AI Chatbot includes:

#### Pre-written Prompts
- **"Give me top 10 employees of Sheet Molding department"** - Find best performers
- **"What is the skill level distribution across all departments?"** - Analyze skills
- **"Show me gender diversity statistics by department"** - Diversity insights
- **"Which employees have the most experience in high-skill positions?"** - Experience analysis
- **"Compare performance between Assembly Line and Quality Control departments"** - Department comparison
- **"What departments need skill development and training?"** - Improvement suggestions

#### Chat Interface
- Real-time chat with typing indicators
- Message history with timestamps
- Suggested prompts sidebar
- Local data analysis as fallback

#### Smart Data Analysis
- Works with or without API key
- Analyzes employee data for insights
- Provides formatted responses with statistics
- Handles department-specific queries

### 4. Usage

1. Click the AI Assistant button (bot icon) in the bottom right
2. Choose a pre-written prompt or type your own question
3. The AI will analyze your employee data and provide detailed insights
4. For enhanced responses, make sure to add your Gemini API key

### 5. Data Privacy

- API key is stored locally in browser
- Employee data is only sent to Gemini when API key is configured
- All data processing follows privacy best practices
- Local analysis mode works without external API calls

### 6. Troubleshooting

**API Key Issues:**
- Ensure your API key is valid and has sufficient quota
- Check the API key format (should start with "AI...")
- Verify billing is enabled on your Google Cloud account

**No Response Issues:**
- Check internet connection
- Try using local analysis mode
- Verify employee data is loaded correctly

**Performance Issues:**
- Large datasets may take longer to process
- Consider filtering data before complex queries
- Use specific department names for better results
