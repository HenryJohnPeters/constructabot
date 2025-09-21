"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Send,
  Paperclip,
  Mic,
  MicOff,
  Settings,
  Download,
  Copy,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  User,
  Bot,
  Zap,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  status?: "sending" | "sent" | "error";
  metadata?: {
    model?: string;
    tokens?: number;
    cost?: number;
  };
}

interface ChatInterfaceProps {
  agentId?: string;
  agentName?: string;
  agentModel?: string;
  onMessage?: (message: Message) => void;
  className?: string;
}

export default function ChatInterface({ 
  agentId, 
  agentName = "Assistant", 
  agentModel = "GPT-4",
  onMessage,
  className = ""
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "system",
      content: `Welcome! I'm ${agentName}, powered by ${agentModel}. How can I help you today?`,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
      status: "sending"
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `I understand you're asking about "${input.trim()}". This is a simulated response from ${agentName}. In a real implementation, this would connect to your configured AI model and provide intelligent responses based on your agent's capabilities and knowledge base.`,
        timestamp: new Date(),
        metadata: {
          model: agentModel,
          tokens: 150,
          cost: 0.003
        }
      };

      setMessages(prev => [...prev.slice(0, -1), { ...userMessage, status: "sent" }, assistantMessage]);
      setIsLoading(false);
      onMessage?.(assistantMessage);
    }, 1500);
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

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // In a real app, this would start/stop speech recognition
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case "sending":
        return <Clock className="w-3 h-3 text-yellow-500" />;
      case "sent":
        return <CheckCircle className="w-3 h-3 text-green-500" />;
      case "error":
        return <XCircle className="w-3 h-3 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className={`flex flex-col h-full bg-white rounded-lg border ${className}`}>
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b bg-slate-50">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center">
            <Bot className="w-4 h-4 text-brand-600" />
          </div>
          <div>
            <h3 className="font-medium text-slate-900">{agentName}</h3>
            <p className="text-xs text-slate-600 flex items-center">
              <Zap className="w-3 h-3 mr-1" />
              {agentModel} • Online
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm">
            <Download className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start space-x-3 ${
              message.role === "user" ? "flex-row-reverse space-x-reverse" : ""
            }`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              message.role === "user" 
                ? "bg-brand-600 text-white" 
                : message.role === "system"
                ? "bg-slate-100 text-slate-600"
                : "bg-slate-100 text-slate-600"
            }`}>
              {message.role === "user" ? (
                <User className="w-4 h-4" />
              ) : message.role === "system" ? (
                <AlertCircle className="w-4 h-4" />
              ) : (
                <Bot className="w-4 h-4" />
              )}
            </div>
            
            <div className={`flex-1 max-w-xs sm:max-w-md lg:max-w-lg ${
              message.role === "user" ? "flex flex-col items-end" : ""
            }`}>
              <div className={`rounded-lg px-4 py-2 ${
                message.role === "user"
                  ? "bg-brand-600 text-white"
                  : message.role === "system"
                  ? "bg-blue-50 text-blue-900 border border-blue-200"
                  : "bg-slate-100 text-slate-900"
              }`}>
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                {message.metadata && (
                  <div className="mt-2 pt-2 border-t border-slate-200 text-xs opacity-75">
                    {message.metadata.model} • {message.metadata.tokens} tokens • ${message.metadata.cost}
                  </div>
                )}
              </div>
              
              <div className={`flex items-center space-x-2 mt-1 ${
                message.role === "user" ? "flex-row-reverse space-x-reverse" : ""
              }`}>
                <span className="text-xs text-slate-500">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                {getStatusIcon(message.status)}
                {message.role !== "system" && (
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => copyMessage(message.content)}
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                    {message.role === "assistant" && (
                      <>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <ThumbsUp className="w-3 h-3" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <ThumbsDown className="w-3 h-3" />
                        </Button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
              <Bot className="w-4 h-4 text-slate-600" />
            </div>
            <div className="bg-slate-100 rounded-lg px-4 py-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t bg-slate-50">
        <div className="flex items-end space-x-3">
          <div className="flex-1">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Message ${agentName}...`}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
              rows={1}
              style={{ minHeight: "40px", maxHeight: "120px" }}
              disabled={isLoading}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleRecording}
              className={isRecording ? "text-red-600" : ""}
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </Button>
            
            <Button variant="ghost" size="sm">
              <Paperclip className="w-4 h-4" />
            </Button>
            
            <Button
              onClick={handleSendMessage}
              disabled={!input.trim() || isLoading}
              className="gradient-brand"
              size="sm"
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-2 text-xs text-slate-500">
          <span>Press Enter to send, Shift+Enter for new line</span>
          <span>{input.length}/2000</span>
        </div>
      </div>
    </div>
  );
}
