"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Send,
  Bot,
  User,
  Loader2,
  Copy,
  Download,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  Zap
} from "lucide-react";

interface Agent {
  id: string;
  name: string;
  description: string;
  category: string;
  isActive: boolean;
}

interface Message {
  id: string;
  content: string;
  sender: "user" | "assistant";
  timestamp: Date;
  agentId?: string;
  credits?: number;
}

interface ChatInterfaceProps {
  agents: Agent[];
}

export function ChatInterface({ agents }: ChatInterfaceProps) {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(
    agents.find(a => a.isActive) || agents[0] || null
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !selectedAgent || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Simulate AI response with realistic delay
    setTimeout(() => {
      const responses = {
        "1": "Based on my research capabilities, I've analyzed the latest market trends and compiled comprehensive insights. Here are the key findings:\n\n1. **Market Growth**: 15% YoY increase in your target sector\n2. **Competitive Landscape**: 3 new entrants identified\n3. **Opportunities**: Emerging markets show 23% potential\n\nI recommend focusing on digital transformation initiatives and exploring partnerships in the European market.",
        "2": "I've crafted a comprehensive marketing strategy for your campaign:\n\n**Content Strategy:**\n- 📱 Social Media: 20 posts across platforms\n- 📧 Email: 5-part nurture sequence\n- 📝 Blog: 3 thought leadership articles\n\n**Target Audience:**\n- Primary: Tech-savvy professionals 25-40\n- Secondary: Enterprise decision makers\n\n**Expected Results:**\n- 2M+ impressions\n- 5% engagement rate\n- 200+ qualified leads",
        "3": "Here's your financial analysis and Q4 recommendations:\n\n**Q3 Performance:**\n- Revenue: $2.3M (+15% YoY)\n- Operating Margin: 23.5%\n- Cash Flow: $450K positive\n\n**Q4 Strategy:**\n1. Increase marketing spend by 25%\n2. Optimize operational costs\n3. Expand into 2 new markets\n\n**ROI Projection:** 18-22% increase in Q4 revenue",
        "4": "I've prepared comprehensive customer support resources:\n\n**FAQ Created:**\n✅ 15 most common issues addressed\n✅ Step-by-step troubleshooting guides\n✅ Escalation procedures defined\n\n**Expected Impact:**\n- 40% reduction in ticket volume\n- 60% faster resolution times\n- 95% customer satisfaction score\n\nReady to implement across all support channels.",
        "5": "Content strategy and calendar completed:\n\n**Content Types:**\n- 📝 Blog posts: 8 articles\n- 🎥 Video content: 5 tutorials\n- 📊 Infographics: 3 data visualizations\n\n**Publishing Schedule:**\n- Week 1-2: Foundation content\n- Week 3-4: Engagement pieces\n\n**SEO Optimization:**\n- Target keywords: 25 identified\n- Meta descriptions optimized\n- Internal linking strategy",
        "6": "Data analysis reveals actionable insights:\n\n**Key Findings:**\n📊 User engagement patterns:\n- 65% drop-off at onboarding step 3\n- Power users spend 4x more time in analytics\n- Mobile engagement 30% lower than desktop\n\n**Recommendations:**\n1. Redesign onboarding flow\n2. Enhance mobile experience\n3. Add progressive disclosure\n\n**Expected Improvement:** 25% increase in user retention"
      };

      const response = responses[selectedAgent.id as keyof typeof responses] || 
        `As a ${selectedAgent.category.toLowerCase()} specialist, I can help you with that request. Let me analyze your needs and provide a comprehensive response with actionable insights and recommendations.`;

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: "assistant",
        timestamp: new Date(),
        agentId: selectedAgent.id,
        credits: Math.floor(Math.random() * 3) + 2, // 2-4 credits
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500 + Math.random() * 1000); // 1.5-2.5 second delay
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div className="flex flex-col h-[600px] border rounded-lg bg-white">
      {/* Agent Selector */}
      <div className="border-b p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium text-slate-900">Select AI Agent</h3>
          <Button variant="outline" size="sm" onClick={clearChat}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Clear Chat
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {agents.map((agent) => (
            <button
              key={agent.id}
              onClick={() => setSelectedAgent(agent)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedAgent?.id === agent.id
                  ? "bg-brand-500 text-white"
                  : agent.isActive
                  ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  : "bg-slate-50 text-slate-400 cursor-not-allowed"
              }`}
              disabled={!agent.isActive}
            >
              {agent.name}
              {!agent.isActive && " (Inactive)"}
            </button>
          ))}
        </div>
        {selectedAgent && (
          <p className="text-xs text-slate-600 mt-2">
            {selectedAgent.description}
          </p>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <Bot className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              Start a conversation
            </h3>
            <p className="text-slate-600">
              {selectedAgent 
                ? `Ask ${selectedAgent.name} anything to get started`
                : "Select an agent above to begin chatting"
              }
            </p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start space-x-3 ${
              message.sender === "user" ? "flex-row-reverse space-x-reverse" : ""
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                message.sender === "user"
                  ? "bg-brand-500 text-white"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {message.sender === "user" ? (
                <User className="w-4 h-4" />
              ) : (
                <Bot className="w-4 h-4" />
              )}
            </div>
            <div
              className={`flex-1 max-w-[80%] ${
                message.sender === "user" ? "text-right" : ""
              }`}
            >
              <div
                className={`p-3 rounded-lg ${
                  message.sender === "user"
                    ? "bg-brand-500 text-white"
                    : "bg-slate-100 text-slate-900"
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>
              <div className="flex items-center justify-between mt-2 text-xs text-slate-500">
                <span>{message.timestamp.toLocaleTimeString()}</span>
                <div className="flex items-center space-x-2">
                  {message.credits && (
                    <span className="flex items-center">
                      <Zap className="w-3 h-3 mr-1 text-yellow-500" />
                      {message.credits} credits
                    </span>
                  )}
                  {message.sender === "assistant" && (
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyMessage(message.content)}
                        className="h-6 w-6 p-0"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                      >
                        <ThumbsUp className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                      >
                        <ThumbsDown className="w-3 h-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
              <Bot className="w-4 h-4 text-slate-600" />
            </div>
            <div className="flex-1">
              <div className="bg-slate-100 p-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-slate-600">
                    {selectedAgent?.name} is thinking...
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t p-4">
        <div className="flex space-x-2">
          <div className="flex-1 relative">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                selectedAgent
                  ? `Ask ${selectedAgent.name} anything...`
                  : "Select an agent to start chatting"
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
              rows={2}
              disabled={!selectedAgent || isLoading}
            />
          </div>
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || !selectedAgent || isLoading}
            className="px-4 py-2"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
        {selectedAgent && (
          <p className="text-xs text-slate-500 mt-2">
            Press Enter to send, Shift+Enter for new line • 
            Estimated cost: 2-4 credits per message
          </p>
        )}
      </div>
    </div>
  );
}
