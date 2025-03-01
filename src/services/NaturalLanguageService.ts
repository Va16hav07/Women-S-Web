export interface SentimentResult {
  score: number;  // -1 (very negative) to 1 (very positive)
  magnitude: number;  // Overall strength of emotion (0 to +inf)
  isDistress: boolean;  // Whether this is considered a distress message
  urgencyLevel: 'low' | 'medium' | 'high';  // Urgency level
}

export class NaturalLanguageService {
  private apiEndpoint: string;
  
  constructor(apiEndpoint: string = 'http://localhost:3001/api/analyze-sentiment') {
    this.apiEndpoint = apiEndpoint;
  }

  /**
   * Analyzes text for sentiment and distress signals
   * @param text The text message to analyze
   * @returns Promise with analysis result
   */
  public async analyzeSentiment(text: string): Promise<SentimentResult> {
    try {
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      
      // Determine if this is a distress message based on score and keywords
      const isDistress = this.detectDistress(text, data.score);
      
      // Determine urgency level
      const urgencyLevel = this.determineUrgencyLevel(text, data.score, data.magnitude);
      
      return {
        score: data.score,
        magnitude: data.magnitude,
        isDistress,
        urgencyLevel
      };
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
      // Fallback local detection in case the API fails
      const isDistress = this.detectDistressLocally(text);
      return {
        score: isDistress ? -0.8 : 0,
        magnitude: isDistress ? 0.9 : 0.1,
        isDistress,
        urgencyLevel: isDistress ? 'high' : 'low'
      };
    }
  }

  /**
   * Local detection of distress keywords
   * @param text The text to analyze
   * @returns Boolean indicating if distress is detected
   */
  private detectDistressLocally(text: string): boolean {
    const lowercaseText = text.toLowerCase();
    
    // List of emergency/distress keywords
    const emergencyKeywords = [
      'help', 'emergency', 'sos', 'urgent', 'danger', 
      'scared', 'afraid', 'hurt', 'injured', 'attacked',
      'following', 'stalking', 'threat', 'threatened', 'unsafe',
      'call police', '911', 'accident', 'bleeding', 'harm'
    ];
    
    // Check if any emergency keywords are present
    return emergencyKeywords.some(keyword => lowercaseText.includes(keyword));
  }

  /**
   * Combined detection using API score and keywords
   */
  private detectDistress(text: string, score: number): boolean {
    // If sentiment is very negative (below -0.4), or moderately negative with keywords
    const hasKeywords = this.detectDistressLocally(text);
    return score < -0.7 || (score < -0.4 && hasKeywords);
  }

  /**
   * Determine the level of urgency
   */
  private determineUrgencyLevel(text: string, score: number, magnitude: number): 'low' | 'medium' | 'high' {
    const lowercaseText = text.toLowerCase();
    
    // High urgency keywords that indicate immediate danger
    const highUrgencyKeywords = [
      'emergency', 'sos', 'help me', 'danger', 'hurt', 
      'attack', 'injured', 'blood', 'weapon', 'gun', 
      'knife', 'right now', 'immediately', 'call police', '911'
    ];
    
    // Check for high urgency keywords
    const hasHighUrgencyKeywords = highUrgencyKeywords.some(keyword => 
      lowercaseText.includes(keyword));
    
    if (score < -0.7 || hasHighUrgencyKeywords) {
      return 'high';
    } else if (score < -0.4 || magnitude > 0.8) {
      return 'medium';
    } else {
      return 'low';
    }
  }
}
