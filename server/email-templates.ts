interface QuizResults {
  userName: string;
  traumaScore: number;
  primaryPattern: string;
  recommendations: string[];
}

export function generateResultsEmail(results: QuizResults): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Break Free Quiz Results</title>
  <style>
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      line-height: 1.6;
      color: #1a1a1a;
      background-color: #f5f5f5;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background: white;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 40px 30px;
      text-align: center;
      color: white;
    }
    .header h1 {
      margin: 0 0 10px 0;
      font-size: 28px;
      font-weight: 700;
    }
    .header p {
      margin: 0;
      opacity: 0.95;
      font-size: 16px;
    }
    .content {
      padding: 40px 30px;
    }
    .greeting {
      font-size: 20px;
      font-weight: 600;
      margin-bottom: 20px;
      color: #1a1a1a;
    }
    .score-box {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      border-radius: 12px;
      padding: 30px;
      text-align: center;
      margin: 30px 0;
      color: white;
    }
    .score-label {
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 1px;
      opacity: 0.9;
      margin-bottom: 10px;
    }
    .score-value {
      font-size: 48px;
      font-weight: 700;
      margin: 10px 0;
    }
    .pattern-box {
      background: #f8f9fa;
      border-left: 4px solid #667eea;
      padding: 20px;
      margin: 20px 0;
      border-radius: 8px;
    }
    .pattern-title {
      font-size: 14px;
      text-transform: uppercase;
      color: #667eea;
      font-weight: 600;
      margin-bottom: 8px;
    }
    .pattern-value {
      font-size: 18px;
      color: #1a1a1a;
      font-weight: 600;
    }
    .recommendations {
      margin: 30px 0;
    }
    .recommendations h3 {
      font-size: 18px;
      margin-bottom: 15px;
      color: #1a1a1a;
    }
    .recommendation-item {
      background: #f8f9fa;
      padding: 15px 20px;
      margin: 10px 0;
      border-radius: 8px;
      display: flex;
      align-items: start;
    }
    .recommendation-icon {
      color: #667eea;
      margin-right: 12px;
      font-size: 20px;
    }
    .cta {
      text-align: center;
      margin: 40px 0 20px 0;
    }
    .cta-button {
      display: inline-block;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 16px 40px;
      border-radius: 30px;
      text-decoration: none;
      font-weight: 600;
      font-size: 16px;
      transition: transform 0.2s;
    }
    .footer {
      background: #f8f9fa;
      padding: 30px;
      text-align: center;
      color: #666;
      font-size: 14px;
    }
    .footer p {
      margin: 5px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🌸 Your Break Free Results</h1>
      <p>Thank you for taking the first step toward healing</p>
    </div>
    
    <div class="content">
      <p class="greeting">Hello ${results.userName},</p>
      
      <p>We're honored you trusted us with your journey. Based on your responses, here's what we discovered:</p>
      
      <div class="score-box">
        <div class="score-label">Your Awareness Score</div>
        <div class="score-value">${results.traumaScore}/100</div>
        <p style="margin: 10px 0 0 0; font-size: 14px; opacity: 0.95;">
          ${results.traumaScore > 70 ? 'High awareness - You\'re already on a powerful healing path' : results.traumaScore > 40 ? 'Growing awareness - You\'re opening doors to deeper understanding' : 'Early discovery - Every journey begins with a single step'}
        </p>
      </div>
      
      <div class="pattern-box">
        <div class="pattern-title">Primary Pattern Identified</div>
        <div class="pattern-value">${results.primaryPattern}</div>
      </div>
      
      <div class="recommendations">
        <h3>🌿 Your Personalized Recommendations</h3>
        ${results.recommendations.map(rec => `
          <div class="recommendation-item">
            <span class="recommendation-icon">✓</span>
            <div>${rec}</div>
          </div>
        `).join('')}
      </div>
      
      <p style="margin-top: 30px; font-size: 15px; line-height: 1.7;">
        Remember: Awareness is the first step to transformation. These patterns were formed over time, and with patience and the right support, they can be reshaped.
      </p>
      
      <div class="cta">
        <a href="${process.env.REPLIT_DEV_DOMAIN ? `https://${process.env.REPLIT_DEV_DOMAIN}` : 'http://localhost:5000'}" class="cta-button">
          Continue Your Journey
        </a>
      </div>
    </div>
    
    <div class="footer">
      <p><strong>Break Free</strong></p>
      <p>Helping you understand, heal, and grow</p>
      <p style="margin-top: 15px; font-size: 12px;">
        This email contains your personal quiz results. If you have any questions, please reply to this email.
      </p>
    </div>
  </div>
</body>
</html>
  `;
}
